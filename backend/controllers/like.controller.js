// controllers/likeController.js
import Like from '../models/like.model.js';
import Blog from '../models/blog.schema.js';

// Add a like to a blog post
export const addLikeController = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id; // from auth middleware

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user already liked this blog
        const existingLike = await Like.findOne({ post: blogId, user: userId });
        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: 'Already liked this blog'
            });
        }

        // Create new like
        const like = await Like.create({
            post: blogId,
            user: userId
        });

        // Update blog like count
        blog.likes = (blog.likes || 0) + 1;
        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Blog liked successfully',
            likes: blog.likes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Remove a like from a blog post
export const removeLikeController = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        // Find and delete the like
        const like = await Like.findOneAndDelete({ post: blogId, user: userId });
        if (!like) {
            return res.status(404).json({
                success: false,
                message: 'Like not found'
            });
        }

        // Update blog like count
        const blog = await Blog.findById(blogId);
        if (blog) {
            blog.likes = Math.max((blog.likes || 0) - 1, 0);
            await blog.save();
        }

        res.status(200).json({
            success: true,
            message: 'Like removed successfully',
            likes: blog.likes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Toggle like (like if not liked, unlike if already liked) - RECOMMENDED
export const toggleLikeController = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const existingLike = await Like.findOne({ post: blogId, user: userId });

        if (existingLike) {
            // Unlike
            await Like.findByIdAndDelete(existingLike._id);
            blog.likes = Math.max((blog.likes || 0) - 1, 0);
            await blog.save();

            return res.status(200).json({
                success: true,
                liked: false,
                message: 'Like removed',
                likes: blog.likes
            });
        } else {
            // Like
            await Like.create({ post: blogId, user: userId });
            blog.likes = (blog.likes || 0) + 1;
            await blog.save();

            return res.status(200).json({
                success: true,
                liked: true,
                message: 'Blog liked',
                likes: blog.likes
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

