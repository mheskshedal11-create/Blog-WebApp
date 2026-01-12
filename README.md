BLOG WEBAPP – BACKEND API

A professional, role-based backend REST API for a modern blogging platform.
Built using Node.js, Express.js, and MongoDB.
The system supports User and Admin roles, secure authentication, blog verification by Admin,
password recovery, advanced blog search, and image uploads using Cloudinary.

==================================================

KEY FEATURES

- Role-based authentication (User & Admin)
- Secure user registration and login
- Forgot and reset password functionality
- Blog creation, update, and deletion
- Admin blog verification system
- Search blogs by title, author, and category
- Image upload support using Cloudinary
- JWT-protected API routes
- MongoDB database with Mongoose ODM
- Environment-based configuration

==================================================

USER ROLES AND PERMISSIONS

USER
- Register and login
- Forgot and reset password
- Create, edit, and delete own blog posts
- Upload blog images using Cloudinary
- Search blogs by title, author, or category
- View only verified blog posts

ADMIN
- Login as admin
- View all blog posts (verified and pending)
- Verify or reject blog posts
- Delete any blog post
- user management
- Moderate platform content

==================================================

TECH STACK

Runtime        : Node.js
Framework      : Express.js
Database       : MongoDB
ODM            : Mongoose
Authentication : JWT
Image Storage  : Cloudinary
Utilities      : dotenv, nodemon, multer

==================================================

PROJECT STRUCTURE

backend/
|
├── config/         Database and Cloudinary configuration
├── controllers/   Business logic
├── middleware/    Authentication, role, and upload middleware
├── models/        Mongoose schemas
├── routes/        Auth, blog, and admin routes
├── .env           Environment variables
├── package.json
└── server.js

==================================================

INSTALLATION AND SETUP

1. Clone the repository

git clone https://github.com/mheskshedal11-create/Blog-WebApp.git
cd Blog-WebApp/backend

2. Install dependencies

npm install

3. Create a .env file in the backend folder

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

==================================================

RUNNING THE APPLICATION

Development Mode
npm run dev
==================================================
BLOG VERIFICATION WORKFLOW

1. User creates a blog post with image upload
2. Blog status is set to Pending
3. Admin reviews the blog post
4. Admin verifies or rejects the blog
5. Only verified blogs are visible to users

==================================================

CONTRIBUTION GUIDELINES

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request


