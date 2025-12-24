import jwt from 'jsonwebtoken';
const AccessToken = (userId) => {
    try {
        if (!process.env.ACCESS_TOKEN) {
            throw new Error('ACCESS_TOKEN is not defined in environment variables');
        }
        const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN, { expiresIn: '5h' });
        return token;
    } catch (error) {
        console.error('Error generating ACCESS_TOKEN:', error.message);
        throw new Error('Failed to generate token');
    }
};

export default AccessToken;
