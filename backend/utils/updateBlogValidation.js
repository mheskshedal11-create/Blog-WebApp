import { body } from 'express-validator';

// Validation for updating blog (only title, category, excerpt, description)
export const updateBlogValidation = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),

    body('category')
        .optional()
        .notEmpty().withMessage('Category cannot be empty')
        .isMongoId().withMessage('Category must be a valid ID'),

    body('excerpt')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Excerpt must not exceed 500 characters'),

    body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Description cannot be empty')
]