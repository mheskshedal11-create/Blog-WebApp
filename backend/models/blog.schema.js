import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: [String],
        default: []
    },
    title: {
        type: String
    },
    excent: {
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
        default: 'pending'
    },
    commentEnable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Blog = mongoose.model('Blog', blogSchema)
export default Blog