import { body, validationResult } from 'express-validator';
import axios from 'axios'

const API_KEY = process.env.MOBILE_API
const VALID_URL = 'http://apilayer.net/api/validate?'
const numberValidation = async (number) => {
    const res = await axios.get(VALID_URL, {
        params: {
            access_key: API_KEY,
            number: number,
            country_code: '',
            format: 1,
        },
    });
    return res.data
}




export const validName = body('name')
    .trim()
    .notEmpty().withMessage('Name is Required')
    .bail()
    .isLength({ min: 3, max: 20 }).withMessage('Name Should be Minimum 3 chars and Max 20 chars');

export const validEmail = body('email')
    .notEmpty().withMessage('Email is Required')
    .bail()
    .normalizeEmail()
    .bail()
    .isEmail().withMessage('Enter Valid Email');

export const validPassword = body('password')
    .trim()
    .notEmpty().withMessage('Password is Required')
    .bail()
    .isLength({ min: 6, max: 20 }).withMessage('Password Should be Minimum 6 chars and Max 20 Chars')
    .bail()
    .matches([/[a-z]/]).withMessage('Password must contain at least one lowercase letter')
    .bail()
    .matches([/\d/]).withMessage('Password must contain at least one digit')
    .bail()
    .matches([/A-Z/]).withMessage('Password must contain at least one Capital letter')
    .bail()
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)');


export const validMobileNumber = [
    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile Number is required')
        .isLength({ min: 10, max: 10 }).withMessage('Enter Valid Number with Country Code')
        .custom(async (value) => {
            const result = await numberValidation(value);
            if (!result.valid) {
                throw new Error('Invalid phone number');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const RegisterValidation = {
    validName,
    validEmail,
    validPassword,
    validMobileNumber
}

export const loginValidation = [
    validMobileNumber,
    validEmail,
    validPassword
]

// ===================ErrorHandling========================
export const ValidError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
