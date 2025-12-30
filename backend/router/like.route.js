import express from 'express'
import { addLikeController, removeLikeController, toggleLikeController } from '../controllers/like.controller.js'
import authMiddleware from '../middleware/auth.js'
import roleAuthorization from '../middleware/roleAuthorization.js'

const likeRouter = express.Router()


likeRouter.post('/like/:blogId', authMiddleware, roleAuthorization('user'), addLikeController)
likeRouter.post('/remove/:blogId', authMiddleware, roleAuthorization('user'), removeLikeController)
likeRouter.post('/toggle/:blogId', authMiddleware, roleAuthorization('user'), toggleLikeController)

export default likeRouter