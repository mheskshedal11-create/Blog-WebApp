import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    mobile: {
        type: Number
    },
    refers_token: {
        type: String
    },
    forgot_password_otp: {
        type: Number
    },
    forgot_password_exp: {
        type: Date
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    bio: {
        type: String
    }
}, { timestamps: true })
const User = mongoose.model('User', userSchema)

export default User