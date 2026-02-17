# DevHub - Professional Developer Network Platform

A comprehensive LinkedIn-inspired developer networking platform built with modern web technologies. DevHub enables developers to connect, share knowledge, showcase skills, and collaborate on projects.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure login/registration with JWT tokens
- **Profile Management** - Dynamic user profiles with skills, endorsements, and reputation
- **Social Networking** - Connection requests, messaging, and professional networking
- **Content Sharing** - Posts, comments, and knowledge sharing
- **Skill Development** - Learning paths, skill endorsements, and progress tracking
- **Project Collaboration** - Build logs, project showcases, and team collaboration
- **Resume Builder** - Professional resume generation and PDF export
- **Dashboard Analytics** - Comprehensive user analytics and insights

### Advanced Features
- **Real-time Notifications** - Live updates and alerts
- **Responsive Design** - Mobile-first, cross-platform compatibility
- **Search & Discovery** - Advanced user and content discovery
- **File Uploads** - Profile pictures and document management
- **API Integration** - RESTful API with comprehensive endpoints

## 🛠️ Tech Stack

### Frontend Technologies
- **Framework**: Next.js 16.1.6 with React 19.2.3
- **Language**: JavaScript (ES2022)
- **Styling**: TailwindCSS with custom components
- **State Management**: Redux Toolkit for global state
- **UI Components**: Custom component library
- **Icons**: Lucide React Icons
- **Build Tool**: Turbopack (Next.js)
- **Development**: Hot Module Replacement (HMR)

### Backend Technologies
- **Runtime**: Node.js with Express.js
- **Language**: JavaScript (ES2022)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet.js, CORS, Rate Limiting
- **File Handling**: Multer for file uploads
- **Logging**: Morgan for request logging
- **Environment**: dotenv for configuration

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Editor**: VS Code
- **API Testing**: Built-in test endpoints
- **Debug Tools**: Browser DevTools, Console logging

### Deployment & Infrastructure
- **Frontend Port**: 3002 (Next.js development server)
- **Backend Port**: 4000 (Express.js API server)
- **Database**: MongoDB (local/Atlas)
- **Environment**: Development/Production configurations

## 📁 Project Structure

```
DevHub/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router structure
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── login/          # Authentication pages
│   │   ├── profile/        # User profile pages
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable React components
│   ├── store/             # Redux store configuration
│   │   └── slices/        # Redux slices for state management
│   ├── utils/             # Utility functions and API helpers
│   ├── package.json       # Frontend dependencies
│   └── next.config.js     # Next.js configuration
├── backend/                # Express.js backend API
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API route definitions
│   ├── middleware/       # Custom middleware
│   ├── uploads/          # File upload directory
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── .gitignore            # Git ignore rules
└── README.md            # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm (comes with Node.js)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/oohareddy63-dotcom/DevHub.git
   cd DevHub
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

5. **Start Backend Server**
   ```bash
   cd backend
   node server.js
   # Backend runs on http://localhost:4000
   ```

6. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:3002
   ```

7. **Access the Application**
   - Open your browser and navigate to `http://localhost:3002`
   - Register for a new account or login with existing credentials

## 🔐 Authentication

### Login Credentials
The application uses a less strict authentication system for development:

**Test Accounts:**
- **Email**: `devhub@example.com` **Password**: `password123`
- **Email**: `ithachireddy@gmail.com` **Password**: `password123`

**Auto-Registration:**
- Any email/password combination works
- New users are automatically created with default profiles

### Authentication Flow
1. User submits login credentials
2. Backend validates and generates JWT token
3. Token stored in localStorage
4. Subsequent requests include Bearer token
5. Protected routes verify token validity

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user profile

### User Management
- `GET /users/:id` - Get user profile
- `PUT /users/update` - Update user profile
- `POST /users/upload-profile-pic` - Upload profile picture

### Social Features
- `POST /connections/request/:userId` - Send connection request
- `PUT /connections/accept/:userId` - Accept connection
- `GET /connections` - Get user connections

### Content Management
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `POST /comments` - Add comment to post

## 🎨 Frontend Architecture

### Component Structure
- **Pages**: Route-level components in `/app` directory
- **Components**: Reusable UI components
- **Layout**: Responsive grid and flexbox layouts
- **State**: Redux Toolkit for global state management
- **Styling**: TailwindCSS with custom utility classes

### Key Features
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching capability
- **Real-time Updates**: Live notifications and updates
- **Performance**: Optimized with Next.js caching
- **SEO**: Server-side rendering support

## 🔧 Backend Architecture

### Server Configuration
- **Framework**: Express.js with middleware stack
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet.js, CORS, rate limiting
- **Authentication**: JWT-based authentication
- **File Handling**: Multer for multipart uploads

### API Design
- **RESTful**: Standard HTTP methods and status codes
- **Error Handling**: Comprehensive error middleware
- **Validation**: Input validation and sanitization
- **Logging**: Morgan request logging
- **Documentation**: Clear endpoint documentation

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // Hashed
  headline: String,
  location: String,
  bio: String,
  skills: [{
    name: String,
    level: String,
    endorsements: Number
  }],
  reputation: Number,
  level: String,
  connections: [ObjectId],
  profilePicture: String
}
```

### Post Model
```javascript
{
  author: ObjectId,
  content: String,
  likes: [ObjectId],
  comments: [ObjectId],
  createdAt: Date,
  tags: [String]
}
```

## 🔒 Security Features

### Authentication Security
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: 24-hour token validity
- **Rate Limiting**: Prevent brute force attacks

### API Security
- **CORS Configuration**: Cross-origin resource sharing
- **Helmet.js**: Security headers and protections
- **Input Validation**: Request sanitization
- **Error Handling**: Secure error responses

## 🧪 Testing

### Development Testing
- **API Test Endpoints**: Built-in testing routes
- **Console Logging**: Comprehensive debug information
- **Error Handling**: Detailed error messages
- **Network Monitoring**: Request/response tracking

### Manual Testing
1. **Authentication Flow**: Test login/register
2. **Profile Management**: Update user profiles
3. **Social Features**: Test connections and messaging
4. **Content Creation**: Test posts and comments
5. **File Uploads**: Test profile picture uploads

## 🚀 Deployment

### Development Environment
- **Frontend**: Next.js development server on port 3002
- **Backend**: Express.js server on port 4000
- **Database**: Local MongoDB instance

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database**: MongoDB Atlas for production
- **Hosting**: Vercel (frontend) + Railway/Heroku (backend)
- **CDN**: Asset optimization and delivery
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow JavaScript Standard Style
2. **Commit Messages**: Clear, descriptive commit messages
3. **Branch Strategy**: Feature branches for development
4. **Testing**: Test all new features thoroughly
5. **Documentation**: Update documentation for changes

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/new-feature
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent React framework
- **MongoDB**: For the flexible database solution
- **TailwindCSS**: For the utility-first CSS framework
- **Redux Toolkit**: For state management solution
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

For support and questions:
- **GitHub Issues**: Report bugs and request features
- **Email**: Contact the development team
- **Documentation**: Refer to this README and code comments

---

**Built with ❤️ by Oohareddy**

**Version**: 1.0.0  
**Last Updated**: February 2025  
**Status**: Active Development
