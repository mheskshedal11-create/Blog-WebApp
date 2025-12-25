import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import AccessToken from '../utils/accessToken.js';
import RefreshToken from '../utils/refersToken.js';
import jwt from 'jsonwebtoken'
import OtpGenerator from '../utils/otpGenerator.js';

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

//updateProfile 
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID not found"
            });
        }

        // Check if email is being updated and ensure it's unique
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Check if mobile is unique (whether or not you are updating it)
        if (mobile) {
            const existingMobile = await User.findOne({ mobile });
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: 'Mobile number already exists'
                });
            }
        }

        // Perform the update, allowing updates only for the fields provided
        const user = await User.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),  // Only update name if provided
                ...(email && { email }),  // Only update email if provided
                ...(mobile && { mobile })  // Only update mobile if provided
            },
            { new: true }  // Return the updated document
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Profile update failed, server error'
        });
    }
};



//updatePassword
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

// Forgot Password Controller
export const forGotPasswordController = async (req, res) => {
    try {
        const { email, mobile } = req.body;
        // Find user by email or mobile number
        const user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or mobile number.',
            });
        }
        // Generate OTP
        let otp = OtpGenerator();
        // Get the current time
        const saveDate = new Date();
        // Set the expiration time to 20 minutes from now
        const expirationTime = new Date(saveDate.getTime() + 20 * 60 * 1000);

        // Update the user's OTP and expiration time
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    forgot_password_otp: otp,
                    forgot_password_exp: expirationTime,
                },
            },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: 'OTP generated successfully. Please check your email or mobile.',
            data: {
                expiration: expirationTime.toISOString(),
                opt: otp
            },
        });

    } catch (error) {
        console.error('Error in forgot password:', error);
        return res.status(500).json({
            success: false,
            message: 'Forgot password failed, server error.',
        });
    }
};

// Verify OTP Controller
export const verifyOtpController = async (req, res) => {
    try {
        const { email, mobile, otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide OTP.',
            });
        }

        // Find user by email or mobile number
        const user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or mobile number.',
            });
        }

        // Check if OTP exists
        if (!user.forgot_password_otp) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new one.',
            });
        }

        const currentTime = new Date();
        const otpExpiration = new Date(user.forgot_password_exp);

        if (otpExpiration < currentTime) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.',
            });
        }

        // Validate OTP (convert both to string for comparison)
        if (String(otp) !== String(user.forgot_password_otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.',
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'OTP verification failed due to a server error. Please try again later.',
        });
    }
}

// Create New Password Controller
export const createNewPassword = async (req, res) => {
    try {
        const { email, mobile, newPassword, confirmPassword } = req.body;
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both new password and confirm password.',
            });
        }

        // Find user
        const user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or mobile number.',
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match.',
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // FIX: Use findByIdAndUpdate correctly with proper syntax
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    password: hashedPassword,
                    // Clear OTP fields after password reset
                    forgot_password_otp: null,
                    forgot_password_exp: null,
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully.',
        });

    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update password. Server error.',
        });
    }
}

//get user profile 
export const getProfileController = async (req, res) => {
    try {
        const { id } = req.user;

        // Check if user ID is available
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Profile not fetched, server error"
        });
    }
};
