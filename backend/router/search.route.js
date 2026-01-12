import express from 'express'
import { searchBlogController } from '../controllers/search.controller.js'
const searchRouter = express.Router()
// Search blogs by title, author, category, tags (single or combined)
// GET /api/search?query=javascript&author=john&category=tech&tags=nodejs&page=1&limit=10
searchRouter.get('/', searchBlogController)

export default searchRouter