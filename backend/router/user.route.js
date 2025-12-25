import express from 'express'
import { createNewPassword, forGotPasswordController, getProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfileController, verifyOtpController } from '../controllers/user.controller.js'
import { loginValidation, RegisterValidation, updatePasswordValidation, ValidError, validForgotPassword } from '../utils/userValidation.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router()
userRouter.post('/registers', RegisterValidation, ValidError, registerController);
userRouter.post('/login', loginValidation, ValidError, loginController);
userRouter.get('/logout', authMiddleware, logoutController)
userRouter.put('/update-profile', authMiddleware, updateProfileController)
userRouter.post('/update-password', authMiddleware, updatePasswordValidation, ValidError, updatePasswordController)
userRouter.post('/forogt-password', validForgotPassword, ValidError, forGotPasswordController)
userRouter.post('/verify-opt', validForgotPassword, ValidError, verifyOtpController)
userRouter.post('/change-password', validForgotPassword, ValidError, createNewPassword)
userRouter.get('/get-profile', authMiddleware, getProfileController)
export default userRouter;