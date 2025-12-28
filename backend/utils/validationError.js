export const validErrorCheck = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => {
                return { message: err.msg }
            })
        })
    }
    next()
}