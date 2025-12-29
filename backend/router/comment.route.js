import express from 'express'
import { createCommentController, getAllCommentsController } from '../controllers/comment.controller.js'
import authMiddleware from '../middleware/auth.js'
const commentRouter = express.Router()
commentRouter.post('/blog/:BlogId/comment', authMiddleware, createCommentController);
commentRouter.get('/get-comments/:blogId', getAllCommentsController)

export default commentRouter