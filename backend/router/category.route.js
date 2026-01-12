import express from 'express'
import { createCategory, deleteCategoryControlller, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'
import roleAuthorization from '../middleware/roleAuthorization.js'
import authMiddleware from '../middleware/auth.js'
import { categoryValidator } from '../utils/categoryValidation.js'
const categoryRouter = express.Router()

categoryRouter.post('/create', authMiddleware, categoryValidator, roleAuthorization('admin'), createCategory)
categoryRouter.get('/get-category', authMiddleware, getCategoryController)
categoryRouter.put('/update/:slug', authMiddleware, categoryValidator, roleAuthorization('admin'), updateCategoryController)
categoryRouter.delete('/delete/:slug', authMiddleware, roleAuthorization('admin'), deleteCategoryControlller)

export default categoryRouter