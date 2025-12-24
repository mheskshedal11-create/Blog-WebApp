import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
const RefreshToken = async (userId) => {
    try {

        if (!process.env.REFRESH_TOKEN) {
            throw new Error('REFRESH_TOKEN is not defined in environment variables');
        }
        const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN, { expiresIn: '7d' });
        const updateResult = await User.updateOne(
            { _id: userId },
            { refresh_token: refreshToken }
        );
        return refreshToken;
    } catch (error) {
        console.error('Error generating or updating refresh token:', error.message);
        throw new Error('Failed to generate or update refresh token');
    }
};
export default RefreshToken;
