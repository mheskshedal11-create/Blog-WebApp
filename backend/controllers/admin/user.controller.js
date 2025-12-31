import User from '../../models/user.model.js'

// Get all users (excluding admins)
export const getAllUserController = async (req, res) => {
    try {
        const getAllUser = await User.find({ role: { $ne: 'admin' } });
        if (getAllUser.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No users found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            getAllUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve users'
        })
    }
}
