import express from 'express'
import { loginController, registerController } from '../controllers/user.controller.js'
import { loginValidation, RegisterValidation, ValidError } from '../utils/userValidation.js';
const userRouter = express.Router()
userRouter.post('/registers', RegisterValidation, ValidError, registerController);

// Login route with validation middleware and error handling
userRouter.post('/login', loginValidation, ValidError, loginController);
export default userRouter;