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
        type: String,
        required: true
    },
    excerpt: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Pending', 'Accept', 'Reject'],
        default: 'Pending'
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: ''
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

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
