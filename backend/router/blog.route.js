import express from 'express'
import { createBlogController, getAllBlogController, getBlogByIdController } from '../controllers/blog.controller.js'
import authMiddleware from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'
import roleAuthorization from '../middleware/roleAuthorization.js'
import { blogValidation } from '../utils/blogValidation.js'
import { validErrorCheck } from '../utils/validationError.js'

const blogRouter = express.Router()

blogRouter.post('/create', authMiddleware, blogValidation, validErrorCheck, upload.array('image', 5), roleAuthorization('user'), createBlogController)
blogRouter.get('/get-all', getAllBlogController)
blogRouter.get('/getblog/:_id', authMiddleware, getBlogByIdController);
export default blogRouter