import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    parentComment: {  // ✅ Remove the array brackets
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;