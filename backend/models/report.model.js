import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Reject', 'Accept'],
            default: 'Pending' // Default status to 'Pending'
        }
    },
    { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
