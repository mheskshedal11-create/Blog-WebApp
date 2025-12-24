import express from 'express'
import { createNewPassword, forGotPasswordController, loginController, logoutController, registerController, updatePasswordController, verifyOtpController } from '../controllers/user.controller.js'
import { loginValidation, RegisterValidation, updatePasswordValidation, ValidError } from '../utils/userValidation.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router()
userRouter.post('/registers', RegisterValidation, ValidError, registerController);
userRouter.post('/login', loginValidation, ValidError, loginController);
userRouter.get('/logout', authMiddleware, logoutController)
userRouter.post('/update-password', authMiddleware, updatePasswordValidation, ValidError, updatePasswordController)
userRouter.post('/forogt-password', forGotPasswordController)
userRouter.post('/verify-opt', verifyOtpController)
userRouter.post('/change-password', createNewPassword)
export default userRouter;