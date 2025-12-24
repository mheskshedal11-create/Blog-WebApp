import mongoose from 'mongoose'

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }
}, { timestamps: true })

const Like = mongoose.model('Like', likeSchema)

export default Like