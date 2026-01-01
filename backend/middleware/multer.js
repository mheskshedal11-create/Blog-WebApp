
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    file.mimetype.startsWith('image/')
        ? cb(null, true)
        : cb(new Error('Only image files are allowed!'), false);
}

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});