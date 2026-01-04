import Blog from "../models/blog.schema.js";
import Category from "../models/category.model.js";
import { cloudinary, uploadCloudinary } from "../utils/cloudinary.js";

//create blog post 
export const createBlogController = async (req, res) => {
    try {

        const { title, category, excerpt, description, tag, status, commentEnable } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        //find category 
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        let tagArray = [];

        if (!tag) {
            return res.status(400).json({
                success: false,
                message: 'At least one tag is required'
            });
        }

        if (typeof tag === 'string') {
            tagArray = tag.split(',').map(t => t.trim()).filter(t => t !== '');
        } else if (Array.isArray(tag)) {
            tagArray = tag;
        }

        if (tagArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one valid tag is required'
            });
        }

        // Validate that at least one image is uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        // Upload images to Cloudinary
        let uploadedImages = [];
        for (let file of req.files) {
            try {
                const result = await uploadCloudinary(file, 'blog-images');
                if (result.secure_url) {
                    // Store only the URL as a string (matching schema)
                    uploadedImages.push(result.secure_url);
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload images',
                    error: uploadError.message
                });
            }
        }

        if (uploadedImages.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'No images were successfully uploaded'
            });
        }

        // Create blog with Cloudinary URLs
        const newBlog = new Blog({
            author: req.user._id || req.user,
            category,
            image: uploadedImages,
            title,
            excerpt,
            description,
            tag: tagArray,
            status: status || 'Accept',
            commentEnable: commentEnable !== undefined ? commentEnable : true
        });

        await newBlog.save();

        await newBlog.populate([
            { path: 'author', select: 'name email' },
            { path: 'category', select: 'name slug' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully!',
            data: newBlog
        });

    } catch (error) {
        console.error('Blog creation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create the blog',
            error: error.message
        });
    }
};
//get all blog
export const getAllBlogController = async (req, res) => {
    try {
        // Fetch all blogs
        const getAllBlog = await Blog.find();

        // Check if no blogs are found
        if (getAllBlog.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found"
            });
        }

        // Return the blogs if found
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            blogs: getAllBlog
        });

    } catch (error) {
        console.error(error);


        return res.status(500).json({
            success: false,
            message: "Error while fetching blogs"
        });
    }
};

export const getPublishedBlogByIdController = async (req, res) => {
    try {
        const { BlogId } = req.params;

        if (!BlogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }

        // Only fetch if status is 'Accept'
        const blog = await Blog.findOne({
            _id: BlogId,
            status: 'Accept'
        })
            .populate('author', 'name email')
            .populate('category', 'name slug')
            .populate({
                path: 'comment',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found or not published yet'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully fetched the blog',
            data: blog
        });

    } catch (error) {
        console.error('Error fetching blog:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error fetching blog",
            error: error.message
        });
    }
};

//update blog 
export const updateBlogController = async (req, res) => {
    try {
        const { title, category, excerpt, description } = req.body;
        const { blogId } = req.params;
        const userId = req.user._id || req.user.id;

        // Validate blog ID
        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }
        // Find existing blog
        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        // Check authorization - only author can update
        if (existingBlog.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            });
        }
        // Prepare update object
        const updateData = {};
        // Update title if provided
        if (title !== undefined && title.trim() !== '') {
            updateData.title = title.trim();
        }
        // Update category if provided and validate
        if (category !== undefined && category !== '') {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            updateData.category = category;
        }
        // Update excerpt if provided
        if (excerpt !== undefined && excerpt.trim() !== '') {
            updateData.excerpt = excerpt.trim();
        }
        // Update description if provided
        if (description !== undefined && description.trim() !== '') {
            updateData.description = description.trim();
        }
        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid data provided to update"
            });
        }
        // Update the blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate([
            { path: 'author', select: 'name email' },
            { path: 'category', select: 'name slug' }
        ]);
        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found after update"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });

    } catch (error) {
        console.error('Blog update error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update the blog",
            error: error.message
        });
    }
};


