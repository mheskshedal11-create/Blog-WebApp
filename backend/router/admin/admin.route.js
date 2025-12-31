import express from 'express'
import { getAllUserController } from '../../controllers/admin/user.controller.js'
import authMiddleware from '../../middleware/auth.js'
import roleAuthorization from '../../middleware/roleAuthorization.js'
const adminRouter = express.Router()
adminRouter.get('/get-all-user', authMiddleware, roleAuthorization('admin'), getAllUserController)
export default adminRouter