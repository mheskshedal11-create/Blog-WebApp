import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import AccessToken from '../utils/accessToken.js';
import RefreshToken from '../utils/refersToken.js';
import jwt from 'jsonwebtoken'

export const registerController = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, mobile } = req.body;

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email Already Registered'
                });
            }
        }

        if (mobile) {
            const existingMobile = await User.findOne({ mobile });
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile Number Already Registered"
                });
            }
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
            newUser
        });
    } catch (error) {
        console.error(error);  // Make sure the error is logged
        return res.status(500).json({
            success: false,
            message: "User registration failed due to server error",
            error: error.message // Adding error message here for better debugging
        });
    }
};

// for login 
export const loginController = async (req, res) => {
    try {
        const { email, password, mobile } = req.body;
        const user = await User.findOne({ $or: [{ email }, { mobile }] });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Mobile Number or Email',
            });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const accessToken = AccessToken(user._id);
        const refreshToken = await RefreshToken(user._id);  // ✅ Add await here

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        res.cookie('accessToken', accessToken, cookieOption);
        res.cookie('refreshToken', refreshToken, cookieOption);

        return res.status(200).json({
            success: true,
            message: 'Login Successful',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "User Login failed due to server error",
            error: error.message,
        });
    }
};

//logout
export const logoutController = async (req, res) => {
    try {
        const userId = req.user._id;

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        // Clear cookies
        res.clearCookie('accessToken', cookieOption);
        res.clearCookie('refreshToken', cookieOption);

        // Remove refresh token from database
        await User.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    refresh_token: 1
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'User logout failed - server error'
        });
    }
};


export const updatePasswordController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password, newPassword, confirmPassword } = req.body;

        // Fetch user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare the old password with the stored password
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect old password"
            });
        }

        // Ensure the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        // Hash the new password
        console.log('About to hash password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('Password hashed successfully');

        // Update the password in the database
        console.log('About to update database...');
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { password: hashedPassword } },
            { new: true }
        );
        console.log('Database updated:', !!updatedUser);

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            user: {
                username: updatedUser.username,
                email: updatedUser.email
            }
        });

    } catch (error) {
        console.error(error);  // Log the actual error to the console for debugging
        return res.status(500).json({
            success: false,
            message: "Failed to update password. Please try again later."
        });
    }
};
