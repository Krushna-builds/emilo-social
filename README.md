<div align="center">

# 🌐 Emilo — Social Media Platform

**A full-stack social media web app built with React, Node.js, MongoDB & Cloudinary.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-emilo--socialll.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://emilo-socialll.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Krushna--builds-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Krushna-builds/emilo-social)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](./LICENSE)

</div>

---

## 📖 About

**Emilo** is a full-stack mini social media platform where users can register, create posts with images, like posts, follow other users, and manage their profiles — all in a clean, dark-mode-first UI. Built as a production-grade project demonstrating end-to-end skills across modern web development.

> Live at 👉 [https://emilo-socialll.vercel.app](https://emilo-socialll.vercel.app/)

---

## ✨ Features

### 🔐 Authentication
- User **registration** with name, email, and password
- Secure **login** with JWT token-based authentication
- **Password hashing** with bcryptjs — plain text passwords never stored
- **Protected routes** — unauthenticated users are redirected to login

### 👤 User Profiles
- View and **edit your profile** (name, bio, profile picture)
- Upload profile pictures directly to **Cloudinary**
- See **follower & following counts** on your profile
- **Form validation** — name ≥ 3 chars, valid email format, password ≥ 6 chars (Zod schemas)

### 📝 Posts
- **Create posts** with text and optional image upload
- Images uploaded to Cloudinary — no base64, no local disk storage
- **View all posts** in a chronological feed
- **View your own posts** separately on the My Posts page
- **Delete your own posts** — only the author can delete

### ❤️ Likes
- **Like and unlike** any post with a single click
- **Optimistic UI** — like count updates instantly before server confirms
- Heart icon fills red when liked

### 👥 Follow System
- **Follow and unfollow** other users directly from the feed or post cards
- **Suggested users** sidebar on the Feed page — shows users you don't follow yet
- Follow state is tracked globally and updated across all components

### 🌙 Dark Mode
- **Dark mode by default** — no flash of white on load
- Toggle between dark and light from the Navbar (desktop) or Bottom Nav (mobile)
- Preference persisted in `localStorage`

### 📱 Responsive UI
- **Instagram-style bottom navigation bar** on mobile
- Full desktop Navbar with active link highlighting
- Fully responsive layouts using Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB) | UI framework |
| ![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white) | Build tool & dev server |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Utility-first styling + dark mode |
| ![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=flat&logo=react-router&logoColor=white) | Client-side routing |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | HTTP client with auth interceptor |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat) | Schema-based form validation |

### Backend
| Technology | Purpose |
|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | JavaScript runtime |
| ![Express](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white) | Web framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | NoSQL database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat) | ODM for MongoDB |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Stateless authentication |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-4A4A4A?style=flat) | Password hashing |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) | Image storage & CDN |
| ![Multer](https://img.shields.io/badge/Multer-FF6600?style=flat) | Multipart file handling |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat) | Request body validation |

### Deployment
| Service | Purpose |
|---|---|
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) | Frontend (static) + Backend (serverless) |
| ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat&logo=mongodb&logoColor=white) | Cloud database |

---

## 🗂️ Project Architecture

```
emilo-social/
│
├── backend/                        # Node.js + Express API
│   ├── vercel.json                 # Vercel serverless config
│   ├── package.json
│   └── src/
│       ├── index.js                # App entry point, CORS, routes, error handler
│       ├── db/
│       │   └── connect.js          # MongoDB connection
│       ├── models/
│       │   ├── User.js             # User schema (followers, following, profilePic)
│       │   └── Post.js             # Post schema (text, imageUrl, likes[])
│       ├── controllers/
│       │   ├── authController.js   # register, login
│       │   ├── userController.js   # getProfile, updateProfile, followToggle, getSuggested
│       │   └── postController.js   # createPost, getAllPosts, getMyPosts, deletePost, toggleLike
│       ├── routes/
│       │   ├── auth.js             # /api/auth/*
│       │   ├── user.js             # /api/user/*
│       │   └── post.js             # /api/posts/*
│       ├── middlewares/
│       │   ├── auth.js             # JWT verification middleware
│       │   └── upload.js           # Multer memory storage config
│       ├── config/
│       │   └── cloudinary.js       # Cloudinary SDK configuration
│       └── validators/
│           ├── authSchemas.js      # Zod schemas for register/login
│           └── postSchemas.js      # Zod schemas for post creation
│
└── frontend/                       # React + Vite SPA
    ├── vercel.json                 # SPA rewrite rule
    ├── tailwind.config.js          # Dark mode + brand colors
    ├── package.json
    └── src/
        ├── main.jsx                # BrowserRouter > ThemeProvider > AuthProvider > App
        ├── App.jsx                 # Route definitions + layout
        ├── index.css               # Global styles, dark mode, scrollbar
        ├── api/
        │   └── axiosInstance.js    # Axios with baseURL + auth interceptor
        ├── context/
        │   ├── AuthContext.jsx     # Auth state (token, user, login, logout)
        │   └── ThemeContext.jsx    # Dark mode toggle (default: dark)
        ├── components/
        │   ├── PrivateRoute.jsx    # Route guard for authenticated pages
        │   ├── Navbar.jsx          # Desktop navigation bar
        │   ├── BottomNav.jsx       # Mobile bottom navigation
        │   ├── PostCard.jsx        # Post with like + follow actions
        │   └── CreatePostForm.jsx  # Text + image post form
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Feed.jsx            # All posts + suggested users sidebar
        │   ├── MyPosts.jsx         # Current user's posts + create form
        │   └── Profile.jsx         # Edit profile, follower/following counts
        └── validators/
            └── authSchemas.js      # Frontend Zod validation schemas
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) — local instance or [MongoDB Atlas](https://cloud.mongodb.com/)
- [Cloudinary account](https://cloudinary.com/) — free tier works fine
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Krushna-builds/emilo-social.git
cd emilo-social
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/emilo-social
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend dev server:

```bash
npm run dev
```

> API will be running at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

> App will be running at `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (default: `5000`) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Your Cloudinary API secret |
| `FRONTEND_URL` | ✅ | Frontend origin for CORS (e.g. `https://emilo-socialll.vercel.app`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend API base URL (e.g. `https://emilo-social-111.vercel.app`) |

---

## 📡 API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |

### 👤 User — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/user/profile` | ✅ | Get logged-in user's profile |
| `PUT` | `/api/user/profile` | ✅ | Update name, bio, or profile picture |
| `GET` | `/api/user/suggested` | ✅ | Get 5 suggested users to follow |
| `GET` | `/api/user/:id` | ✅ | Get another user's public profile |
| `PATCH` | `/api/user/:id/follow` | ✅ | Follow or unfollow a user (toggle) |

### 📝 Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/posts` | ✅ | Create a new post (text + image) |
| `GET` | `/api/posts` | ✅ | Get all posts (feed) |
| `GET` | `/api/posts/mine` | ✅ | Get posts by the logged-in user |
| `DELETE` | `/api/posts/:id` | ✅ | Delete own post by ID |
| `PATCH` | `/api/posts/:id/like` | ✅ | Like or unlike a post (toggle) |

---

## 🖼️ Screenshots

> _Coming soon — UI screenshots of Feed, Profile, Dark Mode, and Mobile view._

To contribute screenshots, open a PR with images added to `docs/screenshots/`.

---

## ☁️ Deployment Guide (Vercel)

### Backend

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import `emilo-social` repo
2. Set **Root Directory** → `backend`
3. Add all backend environment variables from the table above
4. Deploy → note your backend URL (e.g. `https://emilo-social-111.vercel.app`)

### Frontend

1. **Add New Project** again → import same repo
2. Set **Root Directory** → `frontend`
3. Add environment variable: `VITE_API_URL` = your backend URL from above
4. Deploy → note your frontend URL (e.g. `https://emilo-socialll.vercel.app`)

### Final Step — CORS Wiring

Go back to your **backend** Vercel project → **Settings → Environment Variables** → Add:

```
FRONTEND_URL = https://emilo-socialll.vercel.app
```

Redeploy the backend. Done ✅

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request** against `main`

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Krushna**

[![GitHub](https://img.shields.io/badge/GitHub-Krushna--builds-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Krushna-builds)

---

<div align="center">

Made with ❤️ by [Krushna](https://github.com/Krushna-builds)


</div>
