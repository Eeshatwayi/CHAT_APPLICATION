# Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring WebSocket communication for instant messaging, chat rooms, and media sharing capabilities.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSockets (Socket.io)
- **Chat Rooms**: Create and join different chat rooms for group conversations
- **Private Conversations**: One-on-one messaging between users
- **Media Sharing**: Send images and files in conversations
- **Message Persistence**: All messages are saved in MongoDB for chat history
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React.js (v18.2.0)
- Socket.io-client (v4.6.0)
- Axios (v1.6.0)
- React Router DOM (v6.20.0)
- CSS3 / Styled Components

**Backend:**
- Node.js (v18.x or higher)
- Express.js (v4.18.0)
- Socket.io (v4.6.0)
- MongoDB (v6.0 or higher)
- Mongoose (v8.0.0)

**Authentication:**
- JSON Web Tokens (JWT)
- bcrypt.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v18.x or higher ([Download here](https://nodejs.org/))
- **npm**: v9.x or higher (comes with Node.js)
- **MongoDB**: v6.0 or higher ([Download here](https://www.mongodb.com/try/download/community))
  - Or use MongoDB Atlas (cloud database)
- **Git**: For cloning the repository

To check your versions:
```bash
node --version
npm --version
mongo --version
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chat-application.git
cd chat-application
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_here_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud Database):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your frontend `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# For Windows:
net start MongoDB

# For macOS (using Homebrew):
brew services start mongodb-community

# For Linux:
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Add to backend `.env` file

## 🚀 Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm start

# Or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend Application

```bash
# From frontend directory (open new terminal)
cd frontend
npm start
```

Application will open automatically at `http://localhost:3000`

## 📁 Project Structure

```
chat-application/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   └── roomController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Room.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   └── roomRoutes.js
│   ├── uploads/
│   ├── socket/
│   │   └── socketHandler.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Chat/
│   │   │   ├── Rooms/
│   │   │   └── Common/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/chatapp |
| JWT_SECRET | Secret key for JWT | your_secret_key |
| NODE_ENV | Environment mode | development |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000 |
| REACT_APP_SOCKET_URL | WebSocket server URL | http://localhost:5000 |

## 📱 Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Create Room**: Click "New Room" to create a chat room
3. **Join Room**: Browse and join existing public rooms
4. **Private Chat**: Start a private conversation with any user
5. **Send Messages**: Type and send text messages in real-time
6. **Share Media**: Click the attachment icon to share images/files
7. **View History**: Scroll up to view previous messages from database

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB service is running
- Check connection string in `.env` file
- For Atlas, check network access settings

**Socket Connection Failed:**
- Verify backend server is running
- Check CORS settings in backend
- Ensure socket URL matches in frontend `.env`

**Port Already in Use:**
```bash
# Find and kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting service
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Add build command: `npm run build`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)
- Already cloud-based, just update connection string

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Message Endpoints
- `GET /api/messages/:roomId` - Get room messages
- `POST /api/messages` - Send message
- `POST /api/messages/upload` - Upload media

### Room Endpoints
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Real-world inspiration: Slack, WhatsApp, Microsoft Teams
- Socket.io documentation
- MERN stack community

---

**Note**: This is an educational project created for assignment purposes.