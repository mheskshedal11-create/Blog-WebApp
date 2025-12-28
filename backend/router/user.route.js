import express from 'express';
import {
    createNewPassword,
    forGotPasswordController,
    getProfileController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    updatePasswordController,
    updateProfileController,
    verifyOtpController
} from '../controllers/user.controller.js';
import { loginValidator, RegisterValidator, updatePasswordValidation, updateProfileValidation } from '../utils/userValidation.js';
import authMiddleware from '../middleware/auth.js';
import { validErrorCheck } from '../utils/validationError.js'

const userRouter = express.Router();

userRouter.post('/register', RegisterValidator, validErrorCheck, registerController);
userRouter.post('/login', loginValidator, validErrorCheck, loginController);
userRouter.post('/refresh-token', refreshTokenController);
userRouter.post('/forgot-password', forGotPasswordController);
userRouter.post('/verify-otp', verifyOtpController);
userRouter.put('/reset-password', updatePasswordValidation, validErrorCheck, createNewPassword);
userRouter.post('/logout', authMiddleware, logoutController);
userRouter.get('/profile', authMiddleware, getProfileController);
userRouter.put('/profile', authMiddleware, updateProfileValidation, validErrorCheck, updateProfileController);
userRouter.put('/password', authMiddleware, updatePasswordValidation, validErrorCheck, updatePasswordController);

export default userRouter;