import { body, validationResult } from 'express-validator'

// =================================================validation for register ===============================================
const validateName = body('name')
    .trim()
    .notEmpty().withMessage('Enter Your FullName')
    .bail()
    .isLength({ min: 3 }).withMessage('Name should be minimum 3 characters')
    .bail()
    .isLength({ max: 20 }).withMessage('Name should be maximum 20 characters')

const validateEmail = body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Please enter valid email')
    .normalizeEmail()

const validatePassword = body('password')
    .trim()
    .notEmpty().withMessage('Enter your password')
    .bail()
    .isLength({ min: 6 }).withMessage('Password should be minimum 6 characters')
    .bail()
    .isLength({ max: 20 }).withMessage('Password should be maximum 20 characters')
    .bail()
    .matches(/[A-Z]/).withMessage('Password should have at least one capital letter')
    .bail()
    .matches(/[a-z]/).withMessage('Password should have at least one lowercase letter')
    .bail()
    .matches(/[0-9]/).withMessage('Password should have at least one digit')
    .bail()
    .matches(/[!@#$%&*]/).withMessage('Password should have at least one special character (!@#$%&*)')

const validateMobile = body('mobile')
    .trim()
    .notEmpty().withMessage('Please enter your mobile number')
    .bail()
    .matches(/^9[6-9]\d{8}$/).withMessage('Please enter a valid Nepali mobile number starting with 96, 97, 98, or 99')
    .bail()
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits')


export const RegisterValidator = [
    validateName,
    validateEmail,
    validatePassword,
    validateMobile
]
// =======================================================login validation=========================================================
const validateEmailForLogin = body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Please enter valid email')
    .normalizeEmail()
    .optional()

const validateMobileForLogin = body('mobile')
    .trim()
    .notEmpty().withMessage('Please enter your mobile number')
    .bail()
    .matches(/^9[6-9]\d{8}$/).withMessage('Please enter a valid Nepali mobile number starting with 96, 97, 98, or 99')
    .bail()
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits')
    .optional()

export const loginValidator = [
    validateEmailForLogin,
    validatePassword,
    validateMobileForLogin
]


// ===================================================validation for updatepassword ===========================================
const validatePasswordForUpdate = body('newPassword')
    .trim()
    .notEmpty().withMessage('Enter your password')
    .bail()
    .isLength({ min: 6 }).withMessage('Password should be minimum 6 characters')
    .bail()
    .isLength({ max: 20 }).withMessage('Password should be maximum 20 characters')
    .bail()
    .matches(/[A-Z]/).withMessage('Password should have at least one capital letter')
    .bail()
    .matches(/[a-z]/).withMessage('Password should have at least one lowercase letter')
    .bail()
    .matches(/[0-9]/).withMessage('Password should have at least one digit')
    .bail()
    .matches(/[!@#$%&*]/).withMessage('Password should have at least one special character (!@#$%&*)')

export const updatePasswordValidation = [
    validatePasswordForUpdate
]
// ==================================================update profile==============================================================

const validateNameForUpdate = body('name')
    .trim()
    .notEmpty().withMessage('Enter Your FullName')
    .bail()
    .isLength({ min: 3 }).withMessage('Name should be minimum 3 characters')
    .bail()
    .isLength({ max: 20 }).withMessage('Name should be maximum 20 characters')
    .optional()

const validateEmailForUpdate = body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Please enter valid email')
    .normalizeEmail()
    .optional()


const validateMobileForUpdate = body('mobile')
    .trim()
    .notEmpty().withMessage('Please enter your mobile number')
    .bail()
    .matches(/^9[6-9]\d{8}$/).withMessage('Please enter a valid Nepali mobile number starting with 96, 97, 98, or 99')
    .bail()
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits')
    .optional()

export const updateProfileValidation = [
    validateNameForUpdate,
    validateEmailForUpdate,
    validateMobileForUpdate
]
// ==============================================for error===================================================================

export const validErrorCheck = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => {
                return { message: err.msg }
            })
        })
    }
    next()
}