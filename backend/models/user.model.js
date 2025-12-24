import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
        ,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
        default: ''
    },
    forgot_password_otp: {
        type: Number,
        default: ''
    },
    forgot_password_exp: {
        type: Date,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    bio: {
        type: String,
        default: ''
    }
}, { timestamps: true })
const User = mongoose.model('User', userSchema)

export default User