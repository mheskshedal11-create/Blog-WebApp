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

// Delete user by admin
export const deleteUserController = async (req, res) => {
    try {
        const adminId = req.user._id;
        const userId = req.params.userId;

        const adminUser = await User.findById(adminId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only admins can delete users.'
            });
        }

        if (userId === adminId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Admins cannot delete themselves'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully by admin',
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete user: server error"
        });
    }
}
