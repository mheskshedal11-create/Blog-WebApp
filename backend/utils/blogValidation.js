import { body } from 'express-validator';

export const blogValidation = [


    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Category must be a valid category ID'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),

    body('excerpt')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isString().withMessage('Excerpt must be a string')
        .isLength({ max: 500 }).withMessage('Excerpt must not exceed 500 characters'),

    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string')
        .trim(),

    body('tag')
        .optional({ nullable: true })
        .custom((value) => {
            if (typeof value === 'string') {
                return value.trim().length > 0;
            }
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return false;
        }).withMessage('Tags must be a non-empty string or array'),

    body('status')
        .optional({ nullable: true })
        .isIn(['Pending', 'Accept', 'Reject']).withMessage('Status must be one of: Pending, Accept, Reject'),

    body('commentEnable')
        .optional({ nullable: true })
        .custom((value) => {
            // Accept both string 'true'/'false' and boolean
            if (typeof value === 'string') {
                return value === 'true' || value === 'false';
            }
            return typeof value === 'boolean';
        }).withMessage('Comment enable must be true or false')
];