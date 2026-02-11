# Inkwell - Blog Application

A modern, full-stack blog platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Blog Posts**: Create, read, update, and delete blog posts
- **Social Interactions**: Like posts, comment, and bookmark favorites
- **User Profiles**: Customizable user profiles with bio and avatar
- **Trending & Latest**: Discover popular and newest content
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- **React.js 18** - UI library
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd inkwell
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Environment Configuration

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inkwell
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Start the application

**Backend (from server directory):**
```bash
npm run dev
```

**Frontend (from client directory):**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
inkwell/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/          # Utilities and helpers
│   │   ├── assets/       # Static assets
│   │   └── main.jsx      # Application entry
│   └── package.json
│
└── server/                # Express backend
    ├── src/
    │   ├── models/       # Mongoose schemas
    │   ├── routes/       # API routes
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Custom middleware
    │   └── server.js     # Server entry
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/trending` - Get trending posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Interactions
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `POST /api/posts/:id/comment` - Add comment (protected)
- `PUT /api/posts/:postId/comments/:commentId` - Update comment (protected)
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment (protected)
- `POST /api/posts/:id/bookmark` - Bookmark/unbookmark post (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update own profile (protected)
- `GET /api/users/bookmarks` - Get user bookmarks (protected)

## Build for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```

## License

This project is licensed under the MIT License.

## Author

MERN Stack Blog Application
