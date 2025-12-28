import { body } from 'express-validator';

export const blogValidation = [
    body('author')
        .notEmpty().withMessage('Author is required')
        .isMongoId().withMessage('Author must be a valid user ID'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Category must be a valid category ID'),
    body('image')
        .isArray().withMessage('Image must be an array of strings')
        .notEmpty().withMessage('At least one image is required'),
    body('title')
        .trim()
        .isLength({ min: 1 }).withMessage('Title must be at least 1 character')
        .isString().withMessage('Title must be a string')
        .matches(/^[A-Za-z0-9\s]+$/).withMessage('Title can only contain letters, numbers, and spaces'),
    body('excerpt')
        .isString().withMessage('Excerpt must be a string')
        .optional({ nullable: true }),
    body('description')
        .isString().withMessage('Description must be a string')
        .optional({ nullable: true }),
    body('tag')
        .isArray().withMessage('Tags must be an array')
        .optional({ nullable: true }),
    body('status')
        .isIn(['Pending', 'Accept', 'Reject']).withMessage('Status must be one of: Pending, Accept, Reject')
        .optional({ nullable: true }),
    body('commentEnable')
        .isBoolean().withMessage('Comment enable must be a boolean value')
        .optional({ nullable: true })
];
