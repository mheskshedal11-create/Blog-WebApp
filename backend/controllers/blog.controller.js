import Blog from "../models/blog.schema.js";
import Category from "../models/category.model.js";
import fs from 'fs'
import path from 'path'

//create blog post 
export const createBlogController = async (req, res) => {
    try {
        const { title, category, excerpt, description, tag, status, commentEnable } = req.body;
        //find caregory 
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
            // Split by comma and trim whitespace
            tagArray = tag.split(',').map(t => t.trim()).filter(t => t !== '');
        } else if (Array.isArray(tag)) {
            // Already an array
            tagArray = tag;
        }

        // Validate tags
        if (tagArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one valid tag is required'
            });
        }

        // Create blog first WITHOUT images
        const newBlog = new Blog({
            author: req.user,
            category,
            image: [],
            title,
            excerpt,
            description,
            tag: tagArray,
            status,
            commentEnable
        });

        await newBlog.save();

        // Only upload images if blog creation succeeded
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            const uploadDir = path.join(process.cwd(), "temp", "blog");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            for (let img of req.files) {
                const sanitizedName = img.originalname.replace(/\s+/g, '-').toLowerCase();
                const filename = `${Date.now()}-${sanitizedName}`;
                const filepath = path.join(uploadDir, filename);
                fs.writeFileSync(filepath, img.buffer);
                uploadedImages.push(filepath);
            }

            // Update blog with images
            newBlog.image = uploadedImages;
            await newBlog.save();
        }

        await newBlog.populate([
            { path: 'author', select: 'name email -_id' },
            { path: 'category', select: 'name slug -_id' }
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

//get blog by id 
export const getBlogByIdController = async (req, res) => {
    try {
        // Extract the blogId from req.params
        const blogId = req.params._id;
        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }

        // Find the blog by ID
        const getBlog = await Blog.findById(blogId);

        if (!getBlog) {
            return res.status(404).json({
                success: false,
                message: 'Cannot fetch the blog'
            });
        }

        // Return the blog if found
        return res.status(200).json({
            success: true,
            message: 'Successfully fetched the blog by ID',
            getBlog
        });
    } catch (error) {
        console.error(error);
        // Log error for debugging
        return res.status(500).json({
            success: false,
            message: "Error to fetch blog by id"
        });
    }
};

//update blog post 
export const updateBlogController = async (req, res) => {
    try {
        const { blogId } = req.params;

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            // If no body fields but has files, that's okay
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No data provided to update"
                });
            }
        }

        const { title, category, excerpt, description, tag, status, commentEnable } = req.body;

        // Find existing blog
        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // // Check authorization(optional - if you want only author to update)
        // if (existingBlog.author.toString() !== req.user.toString()) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "You are not authorized to update this blog"
        //     });
        // }

        // Prepare update object - only include fields that are provided
        const updateData = {};

        // Update title if provided
        if (title !== undefined && title !== '') {
            updateData.title = title;
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
        if (excerpt !== undefined && excerpt !== '') {
            updateData.excerpt = excerpt;
        }

        // Update description if provided
        if (description !== undefined && description !== '') {
            updateData.description = description;
        }

        // Update status if provided
        if (status !== undefined && status !== '') {
            updateData.status = status;
        }

        // Update commentEnable if provided (boolean can be false, so check undefined only)
        if (commentEnable !== undefined) {
            updateData.commentEnable = commentEnable === 'true' || commentEnable === true;
        }

        // Handle tags if provided
        if (tag !== undefined) {
            let tagArray;
            if (typeof tag === 'string' && tag.trim() !== '') {
                tagArray = tag.split(',').map(t => t.trim()).filter(t => t !== '');
            } else if (Array.isArray(tag)) {
                tagArray = tag.filter(t => t && t.trim() !== '');
            }

            if (tagArray && tagArray.length > 0) {
                updateData.tag = tagArray;
            } else if (tag === '' || (Array.isArray(tag) && tag.length === 0)) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one valid tag is required'
                });
            }
        }

        // Handle image upload if new files are provided
        if (req.files && req.files.length > 0) {
            const uploadDir = path.join(process.cwd(), "temp", "blog");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Delete old images
            if (existingBlog.image && existingBlog.image.length > 0) {
                existingBlog.image.forEach(imgPath => {
                    if (fs.existsSync(imgPath)) {
                        try {
                            fs.unlinkSync(imgPath);
                        } catch (err) {
                            console.error('Error deleting old image:', err);
                        }
                    }
                });
            }

            // Upload new images
            const uploadedImages = [];
            for (let img of req.files) {
                const sanitizedName = img.originalname.replace(/\s+/g, '-').toLowerCase();
                const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedName}`;
                const filepath = path.join(uploadDir, filename);
                fs.writeFileSync(filepath, img.buffer);
                uploadedImages.push(filepath);
            }

            updateData.image = uploadedImages;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid data provided to update"
            });
        }

        // Update blog with new data
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate([
            { path: 'author', select: 'name email -_id' },
            { path: 'category', select: 'name slug -_id' }
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
            message: "Failed to update blog",
            error: error.message
        });
    }
};