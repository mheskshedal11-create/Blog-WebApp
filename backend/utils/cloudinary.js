import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Upload function for buffer or file path
const uploadCloudinary = async (file, folder = 'uploads') => {
    if (!file) return { secure_url: '', public_id: '' };

    try {
        // Handle buffer upload (from memoryStorage)
        if (file.buffer) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: folder },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            secure_url: result.secure_url,
                            public_id: result.public_id
                        });
                    }
                );
                uploadStream.end(file.buffer);
            });
        }

        // Handle file path upload (from diskStorage)
        if (file.path) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folder
            });
            return { secure_url: result.secure_url, public_id: result.public_id };
        }

        return { secure_url: '', public_id: '' };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export { cloudinary, uploadCloudinary };