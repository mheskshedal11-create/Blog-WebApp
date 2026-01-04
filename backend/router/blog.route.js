import express from 'express'
import { createBlogController, getAllBlogController, getPublishedBlogByIdController, updateBlogController } from '../controllers/blog.controller.js'
import authMiddleware from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'
import roleAuthorization from '../middleware/roleAuthorization.js'
import { blogValidation } from '../utils/blogValidation.js'
import { validErrorCheck } from '../utils/validationError.js'
import { updateBlogValidation } from '../utils/updateBlogValidation.js'

const blogRouter = express.Router()

blogRouter.post('/create', authMiddleware, upload.array('image', 5), blogValidation, validErrorCheck, roleAuthorization('user'), createBlogController)
blogRouter.get('/get-all', getAllBlogController)
blogRouter.get('/getblog/:BlogId', authMiddleware, getPublishedBlogByIdController);
blogRouter.put('/update/:blogId', authMiddleware, updateBlogValidation, validErrorCheck, roleAuthorization('user'), updateBlogController)
export default blogRouter