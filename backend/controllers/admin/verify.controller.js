import Blog from "../../models/blog.schema.js";

// Get all unverified blogs
export const unverifyBlogController = async (req, res) => {
    try {
        const getBlog = await Blog.find({ status: "Pending" });

        return res.status(200).json({
            success: true,
            message: "Successfully fetched unverified blogs",
            getBlog
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get unverified blogs"
        });
    }
};

// Get unverified blog by ID
export const unverifyBlogByIdController = async (req, res) => {
    try {
        const blogId = req.params.id;

        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }

        const getBlog = await Blog.findOne({ _id: blogId, status: "Pending" });

        if (!getBlog) {
            return res.status(404).json({
                success: false,
                message: "Unverified blog not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully fetched unverified blog",
            getBlog
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get unverified blog by ID"
        });
    }
};

// Verify all pending blogs
export const verifyBlogController = async (req, res) => {
    try {
        const allBlog = await Blog.find({ status: 'Pending' });

        if (allBlog.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending blogs found"
            });
        }

        const result = await Blog.updateMany(
            { status: 'Pending' },
            {
                $set: {
                    status: "Accept",
                    verifiedAt: Date.now()
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Successfully verified all pending blogs",
            verifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify all blogs'
        });
    }
};

// Verify single blog by ID
export const verifyByIdController = async (req, res) => {
    try {
        const blogId = req.params.id;

        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: 'Blog ID is required'
            });
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    status: "Accept",
                    verifiedAt: Date.now()
                }
            },
            { new: true }
        );

        if (!updateBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog verified successfully',
            updateBlog
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify blog by ID'
        });
    }
};

// Reject all pending blogs
export const rejectBlogController = async (req, res) => {
    try {
        const { rejectionReason } = req.body;

        if (!rejectionReason || rejectionReason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const allBlog = await Blog.find({ status: 'Pending' });

        if (allBlog.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending blogs found"
            });
        }

        const result = await Blog.updateMany(
            { status: 'Pending' },
            {
                $set: {
                    status: "Reject",
                    rejectionReason: rejectionReason
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Successfully rejected all pending blogs",
            rejectedCount: result.modifiedCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reject all blogs'
        });
    }
};

// Reject single blog by ID
export const rejectByIdController = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { rejectionReason } = req.body;

        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: 'Blog ID is required'
            });
        }

        if (!rejectionReason || rejectionReason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    status: "Reject",
                    rejectionReason: rejectionReason
                }
            },
            { new: true }
        );

        if (!updateBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog rejected successfully',
            updateBlog
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reject blog by ID'
        });
    }
};