const roleAuthorization = (role) => {
    return (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Access denied. Admin privileges required...........'
            })
        }
        next()
    }
}
export default roleAuthorization