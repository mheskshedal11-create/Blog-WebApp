
import mongoose from "mongoose";
const blogSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: [String],
        default: []
    },
    title: {
        type: String
    },
    excerpt: {  // Fixed typo here
        type: String
    },
    description: {
        type: String
    },
    tag: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Pending', 'Accept', "Reject"],
        default: 'Pending'
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: {
        type: Number,
        default: 0
    },
    commentEnable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema)
export default Blog