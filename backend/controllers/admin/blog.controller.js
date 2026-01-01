import Blog from '../../models/blog.schema.js'

export const verifyBlogController = async (req, res) => {
    try {
        const adminId = req.user.id;
        const blogId = req.params.blogId;
        const { status, rejectionReason } = req.body;

        // ✅ Admin check
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized'
            });
        }

        // ✅ Status validation
        if (!['Accept', 'Reject'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // ✅ Verification update
        blog.status = status;
        blog.verifiedBy = adminId;
        blog.verifiedAt = new Date();

        // ✅ Correct ternary usage
        blog.rejectionReason =
            status === 'Reject' ? (rejectionReason || 'Not specified') : '';

        await blog.save();

        return res.status(200).json({
            success: true,
            message: `Blog ${status === 'Accept' ? 'approved' : 'rejected'} successfully`,
            blog
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify the post'
        });
    }
};