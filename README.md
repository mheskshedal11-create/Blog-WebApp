<p align="center">
  <h1 align="center">📝 Blog WebApp – Backend API</h1>
  <h3 align="center">A Modern, Production-Ready REST API for Blogging Platforms</h3>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"></a>
  <a href="https://cloudinary.com/"><img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"></a>
</p>

<p align="center">
  <strong>A robust, scalable backend REST API with role-based authentication, admin content moderation, and seamless media management.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-api-documentation">API Routes</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles--permissions)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Blog Verification Workflow](#-blog-verification-workflow)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Blog WebApp Backend API** is a professional-grade REST API designed for modern blogging platforms. It provides comprehensive features including secure authentication, role-based access control, content moderation, and cloud-based media storage. Built with scalability and security in mind, this API serves as a solid foundation for any content management platform.

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based Authentication** - Secure token-based user sessions
- **Role-Based Access Control** - Separate permissions for Users and Admins
- **Password Recovery** - OTP-based forgot/reset password functionality
- **Secure Routes** - Protected endpoints with authentication middleware

### 📰 Blog Management

- **Full CRUD Operations** - Create, read, update, and delete blog posts
- **Admin Verification** - Content moderation system before publication
- **Rich Media Support** - Image uploads via Cloudinary integration
- **Category System** - Organize blogs with customizable categories

### 🔍 Search & Discovery

- **Advanced Search** - Find blogs by title, author, or category
- **Filter Options** - View verified content or all posts (admin only)

### 💬 User Engagement

- **Like System** - Toggle likes on blog posts
- **Comments** - Engage with content through comments
- **User Profiles** - Customizable user profiles with avatar upload

### ⚙️ Developer Experience

- **RESTful Design** - Clean, intuitive API structure
- **Environment Configuration** - Easy setup with `.env` files
- **Modular Architecture** - Organized, maintainable codebase

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="50%">

### Backend

| Technology     | Purpose             |
| :------------- | :------------------ |
| **Node.js**    | Runtime Environment |
| **Express.js** | Web Framework       |
| **MongoDB**    | NoSQL Database      |
| **Mongoose**   | ODM for MongoDB     |

</td>
<td align="center" width="50%">

### Tools & Libraries

| Technology     | Purpose             |
| :------------- | :------------------ |
| **JWT**        | Authentication      |
| **Cloudinary** | Image Storage       |
| **Multer**     | File Upload Handler |
| **dotenv**     | Environment Config  |

</td>
</tr>
</table>

---

## 👥 User Roles & Permissions

<table>
<tr>
<td width="50%">

### 🧑‍💻 User Role

**Capabilities:**

- ✅ Register and login
- ✅ Password recovery (Forgot/Reset)
- ✅ Create, edit, delete own blogs
- ✅ Upload blog images
- ✅ Search blogs
- ✅ Like and comment on blogs
- ✅ View verified blogs only
- ✅ Manage personal profile

</td>
<td width="50%">

### 👨‍💼 Admin Role

**Capabilities:**

- ✅ All user capabilities
- ✅ View all blogs (verified & pending)
- ✅ Verify or reject blog posts
- ✅ Delete any blog post
- ✅ User management
- ✅ Content moderation
- ✅ Bulk blog verification/rejection

</td>
</tr>
</table>

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**
- **Cloudinary Account** (for image storage)

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mheskshedal11-create/Blog-WebApp.git
   cd Blog-WebApp/backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the backend directory:

   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development

   # Database
   MONGO_URI=your_mongodb_connection_string

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the Application**

   **Development Mode:**

   ```bash
   npm run dev
   ```

   **Production Mode:**

   ```bash
   npm start
   ```

5. **Access the API**
   ```
   http://localhost:8000/api/v1
   ```

---

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### 🔑 User Authentication Routes

| Method | Endpoint                | Description                 | Auth Required |
| :----: | :---------------------- | :-------------------------- | :-----------: |
| `POST` | `/user/register`        | Register a new user         |      ❌       |
| `POST` | `/user/login`           | User login                  |      ❌       |
| `PUT`  | `/user/upload-avatar`   | Upload user avatar          |      ✅       |
| `POST` | `/user/refresh-token`   | Refresh JWT token           |      ✅       |
| `POST` | `/user/forgot-password` | Send OTP for password reset |      ❌       |
| `POST` | `/user/verify-otp`      | Verify OTP code             |      ❌       |
| `PUT`  | `/user/reset-password`  | Reset password with OTP     |      ❌       |
| `POST` | `/user/logout`          | Logout user                 |      ✅       |
| `GET`  | `/user/profile`         | Get user profile            |      ✅       |
| `PUT`  | `/user/profile`         | Update user profile         |      ✅       |
| `PUT`  | `/user/password`        | Change password             |      ✅       |

### 📝 Blog Routes

| Method | Endpoint                | Description                           | Auth Required |
| :----: | :---------------------- | :------------------------------------ | :-----------: |
| `POST` | `/blog/create`          | Create a new blog post (max 5 images) |    ✅ User    |
| `GET`  | `/blog/get-all`         | Get all verified blogs                |      ❌       |
| `GET`  | `/blog/getblog/:BlogId` | Get single blog by ID                 |      ✅       |
| `PUT`  | `/blog/update/:blogId`  | Update blog post                      |    ✅ User    |

### 🔍 Search Routes

| Method | Endpoint  | Description                                | Auth Required |
| :----: | :-------- | :----------------------------------------- | :-----------: |
| `GET`  | `/search` | Search blogs by title, author, or category |      ❌       |

### 💬 Comment Routes

| Method | Endpoint                        | Description                 | Auth Required |
| :----: | :------------------------------ | :-------------------------- | :-----------: |
| `POST` | `/comment/blog/:BlogId/comment` | Add comment to blog         |      ✅       |
| `GET`  | `/comment/get-comments/:blogId` | Get all comments for a blog |      ❌       |

### ❤️ Like Routes

| Method | Endpoint               | Description           | Auth Required |
| :----: | :--------------------- | :-------------------- | :-----------: |
| `POST` | `/like/like/:blogId`   | Like a blog post      |    ✅ User    |
| `POST` | `/like/remove/:blogId` | Remove like from blog |    ✅ User    |
| `POST` | `/like/toggle/:blogId` | Toggle like status    |    ✅ User    |

### 🏷️ Category Routes

|  Method  | Endpoint                 | Description         | Auth Required |
| :------: | :----------------------- | :------------------ | :-----------: |
|  `POST`  | `/category/create`       | Create new category |   👨‍💼 Admin    |
|  `GET`   | `/category/get-category` | Get all categories  |      ✅       |
|  `PUT`   | `/category/update/:slug` | Update category     |   👨‍💼 Admin    |
| `DELETE` | `/category/delete/:slug` | Delete category     |   👨‍💼 Admin    |

### 👨‍💼 Admin Routes

|  Method  | Endpoint                       | Description                  | Auth Required |
| :------: | :----------------------------- | :--------------------------- | :-----------: |
|  `GET`   | `/admin/get-all-user`          | Get all users                |   👨‍💼 Admin    |
| `DELETE` | `/admin/delete-user/:userId`   | Delete a user                |   👨‍💼 Admin    |
|  `GET`   | `/admin/get-unverify-blog`     | Get all unverified blogs     |   👨‍💼 Admin    |
|  `GET`   | `/admin/get-unverify-blog/:id` | Get specific unverified blog |   👨‍💼 Admin    |
|  `PUT`   | `/admin/verify-all-blogs`      | Verify all pending blogs     |   👨‍💼 Admin    |
|  `PUT`   | `/admin/verify-blog/:id`       | Verify specific blog         |   👨‍💼 Admin    |
|  `PUT`   | `/admin/reject-all-blogs`      | Reject all pending blogs     |   👨‍💼 Admin    |
|  `PUT`   | `/admin/reject-blog/:id`       | Reject specific blog         |   👨‍💼 Admin    |

---

## 🔄 Blog Verification Workflow

```
┌─────────────────┐
│  User Creates   │
│   Blog Post     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Status: Pending │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Admin Reviews  │
│   Blog Content  │
└────────┬────────┘
         │
         ▼
    ┌────┴────┐
    │Decision?│
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌────────┐
│Approve│ │ Reject │
└───┬───┘ └───┬────┘
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│Verified │ │ Rejected │
└────┬────┘ └────┬─────┘
     │           │
     ▼           ▼
┌─────────┐ ┌──────────┐
│Visible  │ │   Not    │
│to Users │ │ Visible  │
└─────────┘ └──────────┘
```

### Workflow Steps

1. **📝 Creation** - User creates a blog post with optional image upload
2. **⏳ Pending Status** - Blog is automatically set to "Pending" status
3. **👨‍💼 Admin Review** - Admin reviews the blog content
4. **✅ Verification** - Admin either verifies or rejects the blog
5. **👁️ Visibility** - Only verified blogs are visible to regular users

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=8000                           # Port number for the server
NODE_ENV=development                # Environment (development/production)

# Database Configuration
MONGO_URI=mongodb://localhost:27017/blog-webapp  # MongoDB connection string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here        # Secret key for JWT
JWT_EXPIRE=7d                                     # Token expiration time

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name            # Cloudinary cloud name
CLOUDINARY_API_KEY=your_api_key                  # Cloudinary API key
CLOUDINARY_API_SECRET=your_api_secret            # Cloudinary API secret

# Email Configuration (Optional - for OTP)
SMTP_HOST=smtp.gmail.com                         # SMTP host
SMTP_PORT=587                                     # SMTP port
SMTP_USER=your_email@gmail.com                   # Email address
SMTP_PASS=your_email_password                    # Email password
```

> ⚠️ **Important:** Never commit the `.env` file to version control. Add it to `.gitignore`.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Steps to Contribute

1. **Fork the Repository**

   ```bash
   # Click the 'Fork' button at the top right of this page
   ```

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Blog-WebApp.git
   cd Blog-WebApp/backend
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**

   - Write clean, documented code
   - Follow existing code style
   - Test your changes thoroughly

5. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add: amazing new feature"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click 'New Pull Request'
   - Select your feature branch
   - Describe your changes in detail

### Contribution Guidelines

- ✅ Write clear commit messages
- ✅ Add comments for complex logic
- ✅ Update documentation if needed
- ✅ Ensure all tests pass
- ✅ Follow the existing code style
- ✅ Be respectful and constructive

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@mheskshedal11-create](https://github.com/mheskshedal11-create)
- Email:mheskshedal11@gmail.com

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Inspired by modern blogging platforms and content management systems
- Built with ❤️ using Node.js and Express.js

---

## 📞 Support

If you have any questions or need help, please:

- 🐛 [Open an issue](https://github.com/mheskshedal11-create/Blog-WebApp/issues)
- 💬 [Start a discussion](https://github.com/mheskshedal11-create/Blog-WebApp/discussions)
- 📧 Email:mheskshedal11@gmail.com

---

<p align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong>
</p>

<p align="center">
  <a href="#-blog-webapp--backend-api">⬆ Back to Top</a>
</p>
