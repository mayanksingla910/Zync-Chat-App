const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap express in http server
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000', // frontend origin (change later)
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Zync ChatApp');
});

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData.id); // join room with user's ID
    console.log(`User ${userData.username} setup complete`);
    socket.emit('connected');
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});