import Blog from "../models/blog.schema.js";
import Category from "../models/category.model.js";
import fs from 'fs'
import path from 'path'
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
            const uploadDir = './temp/blog';
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