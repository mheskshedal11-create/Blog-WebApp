import Comment from "../models/comment.model.js";
import Blog from '../models/blog.schema.js'

export const createCommentController = async (req, res) => {
    const { comment, parentComment } = req.body;
    const userId = req.user.id;
    const BlogId = req.params.BlogId;

    try {
        const blog = await Blog.findById(BlogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (parentComment) {

            const parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent comment not found'
                });
            }

            if (parent.blog.toString() !== BlogId) {
                return res.status(400).json({
                    success: false,
                    message: 'Parent comment does not belong to this blog'
                });
            }

            // ✅ This allows replying to ANY comment (parent OR reply)
            console.log('✅ Parent comment found and validated');
        } else {
            console.log('🔍 This is a NEW parent comment (no parentComment)');
        }

        const createComment = new Comment({
            user: userId,
            blog: BlogId,
            comment,
            parentComment: parentComment || null
        });
        await createComment.save();

        if (!blog.comment) {
            blog.comment = [];
        }

        blog.comment.push(createComment._id);
        await blog.save();

        return res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            comment: createComment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
};
export const getAllCommentsController = async (req, res) => {
    const blogId = req.params.blogId;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Get all parent comments (top-level only)
        const parentComments = await Comment.find({
            blog: blogId,
            parentComment: null
        })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // ✅ Recursive function to get nested replies (comment + user name)
        const getRepliesRecursive = async (commentId) => {
            const replies = await Comment.find({
                parentComment: commentId
            })
                .populate('user', 'name')  // ✅ Populate user name
                .sort({ createdAt: 1 });

            // For each reply, get its nested replies
            const repliesWithNested = await Promise.all(
                replies.map(async (reply) => {
                    const nestedReplies = await getRepliesRecursive(reply._id);

                    return {
                        comment: reply.comment,
                        userName: reply.user.name,  // ✅ User name
                        replies: nestedReplies
                    };
                })
            );

            return repliesWithNested;
        };

        // Build comment tree with nested replies
        const commentsWithReplies = await Promise.all(
            parentComments.map(async (parent) => {
                const replies = await getRepliesRecursive(parent._id);

                return {
                    comment: parent.comment,
                    userName: parent.user.name,  // ✅ User name
                    replies: replies
                };
            })
        );

        return res.status(200).json({
            success: true,
            comments: commentsWithReplies
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
};