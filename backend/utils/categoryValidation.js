import { body } from 'express-validator'

export const categoryValidator = [
    body('name')
        .notEmpty().withMessage('Category name cannot be empty')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters')
        .isLength({ max: 20 }).withMessage('Category name must not exceed 20 characters')
        .trim() // Remove whitespace
]
