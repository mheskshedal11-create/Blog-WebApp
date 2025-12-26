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
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

//global error handler
app.use(globalErrorHandler)

//router
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
// connect db and start server
dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(` Server running at http://localhost:${PORT}`)
    })

})
