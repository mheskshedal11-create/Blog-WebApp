import { body, validationResult } from 'express-validator';
import axios from 'axios';

const API_KEY = process.env.MOBILE_API;
const VALID_URL = 'http://apilayer.net/api/validate?';

// Phone number validation via external API
const numberValidation = async (number, countryCode) => {
    try {
        const res = await axios.get(VALID_URL, {
            params: {
                access_key: API_KEY,
                number: number,
                country_code: countryCode, // Specify the country code
                format: 1,
            },
        });

        // Check the validity of the phone number from the API response
        if (res.data.valid) {
            return res.data;
        } else {
            throw new Error('Phone number is not valid');
        }
    } catch (error) {
        throw new Error(error.response?.data?.error?.info || 'Phone number validation API failed');
    }
};

// Validate Name
export const validName = body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .bail()
    .isLength({ min: 3, max: 20 }).withMessage('Name should be between 3 and 20 characters');

// Validate Email
export const validEmail = body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .normalizeEmail()
    .bail()
    .isEmail().withMessage('Enter a valid email');

// Validate Password
export const validPassword = body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .bail()
    .isLength({ min: 6, max: 20 }).withMessage('Password should be between 6 and 20 characters')
    .bail()
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .bail()
    .matches(/\d/).withMessage('Password must contain at least one digit')
    .bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)');

// Validate Mobile Number with Country Code
export const validMobileNumber = [
    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^\+?\d{1,3}\d{10}$/).withMessage('Enter a valid mobile number with country code') // Validates mobile number with country code
        .custom(async (value) => {
            // Extract country code (first 3 digits including '+')
            const countryCode = value.slice(0, 3);
            const localNumber = value.slice(3);  // Get the rest of the number after the country code
            const result = await numberValidation(localNumber, countryCode); // Validate using country code and number
            if (!result.valid) {
                throw new Error('Invalid phone number');
            }
            return true;
        }),

    // Error handling middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Register validation middleware
export const RegisterValidation = [
    validName,
    validEmail,
    validPassword,
    validMobileNumber
];

// ========================validation for login======================
// Validate Email
export const validEmailForLogin = body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .optional()
    .normalizeEmail()
    .bail()
    .isEmail().withMessage('Enter a valid email');


export const validMobileNumberForLogin = [
    body('mobile')
        .trim()
        .optional()
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^\+?\d{1,3}\d{10}$/).withMessage('Enter a valid mobile number with country code') // Validates mobile number with country code
        .custom(async (value) => {
            // Extract country code (first 3 digits including '+')
            const countryCode = value.slice(0, 3);
            const localNumber = value.slice(3);  // Get the rest of the number after the country code
            const result = await numberValidation(localNumber, countryCode); // Validate using country code and number
            if (!result.valid) {
                throw new Error('Invalid phone number');
            }
            return true;
        }),

    // Error handling middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Login validation middleware
export const loginValidation = [
    validEmailForLogin,
    validMobileNumberForLogin,
    validPassword
];

// =================== Error Handling =====================

export const ValidError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            message: err.msg,
            field: err.param,
            value: err.value,
        }));

        return res.status(400).json({
            success: false,
            errors: formattedErrors,  // Return cleaner, customized error structure
        });
    }
    next();
};
