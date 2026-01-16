import express from 'express'
import 'dotenv/config'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dbConnection from './config/connection.js'
import globalErrorHandler from './middleware/globalErrorHandling.js'
import userRouter from './router/user.route.js'
import categoryRouter from './router/category.route.js'
import blogRouter from './router/blog.route.js'
import commentRouter from './router/comment.route.js'
import likeRouter from './router/like.route.js'
import adminRouter from './router/admin/admin.route.js'
import searchRouter from './router/search.route.js'

const app = express()
const PORT = process.env.PORT || 8000

// Security & parsing
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Logging
app.use(morgan('dev'))

// CORS
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


//global error handler
app.use(globalErrorHandler)


//router
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/blog', blogRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/comment', likeRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/search', searchRouter)

// connect db and start server
dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(` Server running at http://localhost:${PORT}`)
    })

})
