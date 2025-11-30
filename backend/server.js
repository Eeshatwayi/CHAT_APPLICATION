const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Message = require('./models/message');
const Room = require('./models/room');
const User = require('./models/user');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO Connection
io.on('connection', async (socket) => {
  console.log('👤 User connected:', socket.userId);

  // Get user info
  const user = await User.findById(socket.userId).select('-password');
  
  // Join room
  socket.on('join-room', async (roomName) => {
    socket.join(roomName);
    console.log(`${user.username} joined room: ${roomName}`);
    
    // Load previous messages
    const messages = await Message.find({ room: roomName })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(50);
    
    socket.emit('load-messages', messages);
    
    // Notify others
    socket.to(roomName).emit('user-joined', {
      username: user.username,
      message: `${user.username} joined the room`
    });
  });

  // Send message
  socket.on('send-message', async (data) => {
  try {
    const message = new Message({
      room: data.room,
      sender: socket.userId,
      content: data.content,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileName: data.fileName
    });
      
      await message.save();
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username avatar');
      
      io.to(data.room).emit('receive-message', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user-typing', {
      username: user.username,
      isTyping: data.isTyping
    });
  });

  // Leave room
  socket.on('leave-room', (roomName) => {
    socket.leave(roomName);
    console.log(`${user.username} left room: ${roomName}`);
    
    socket.to(roomName).emit('user-left', {
      username: user.username,
      message: `${user.username} left the room`
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});