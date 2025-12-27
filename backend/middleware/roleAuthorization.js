const roleAuthorization = (role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient privileges.'
            })
        }
        next()
    }
}
export default roleAuthorization