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
        type: [String], // Keep as array of strings (URLs)
        default: [],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        default: [],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one tag is required'
        }
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