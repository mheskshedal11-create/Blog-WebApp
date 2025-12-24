import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

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

        return res.status(200).json({
            success: true,
            message: 'Login Successful',
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Login failed due to server error",
            error: error.message,
        });
    }
};
