import express from 'express'
import { createBlogController } from '../controllers/blog.controller.js'
import authMiddleware from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'
import roleAuthorization from '../middleware/roleAuthorization.js'

const blogRouter = express.Router()

blogRouter.post('/create', authMiddleware, upload.array('image', 5), roleAuthorization('user'), createBlogController)
export default blogRouter