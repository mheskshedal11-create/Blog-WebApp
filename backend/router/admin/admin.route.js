import express from 'express'
import { deleteUserController, getAllUserController } from '../../controllers/admin/user.controller.js'
import authMiddleware from '../../middleware/auth.js'
import roleAuthorization from '../../middleware/roleAuthorization.js'
import {
    unverifyBlogByIdController,
    unverifyBlogController,
    verifyBlogController,
    verifyByIdController,
    rejectBlogController,
    rejectByIdController
} from '../../controllers/admin/verify.controller.js'

const adminRouter = express.Router()

// User management routes
adminRouter.get('/get-all-user', authMiddleware, roleAuthorization('admin'), getAllUserController)
adminRouter.delete('/delete-user/:userId', authMiddleware, roleAuthorization('admin'), deleteUserController)

// Get unverified blogs routes
adminRouter.get('/get-unverify-blog', authMiddleware, roleAuthorization('admin'), unverifyBlogController)
adminRouter.get('/get-unverify-blog/:id', authMiddleware, roleAuthorization('admin'), unverifyBlogByIdController)

// Verify blog routes
adminRouter.put('/verify-all-blogs', authMiddleware, roleAuthorization('admin'), verifyBlogController)
adminRouter.put('/verify-blog/:id', authMiddleware, roleAuthorization('admin'), verifyByIdController)

// Reject blog routes
adminRouter.put('/reject-all-blogs', authMiddleware, roleAuthorization('admin'), rejectBlogController)
adminRouter.put('/reject-blog/:id', authMiddleware, roleAuthorization('admin'), rejectByIdController)


export default adminRouter