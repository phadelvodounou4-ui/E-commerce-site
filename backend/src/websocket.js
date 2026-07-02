const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
const logger = require('./utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
let io;

const initializeWebSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, JWT_SECRET, { issuer: 'ecommerce-api', audience: 'ecommerce-client' });
      const user = await User.findByPk(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);
    socket.on('message', (data) => {
      io.to(`user:${data.receiverId}`).emit('newMessage', { senderId: socket.userId, senderName: socket.user.getFullName(), content: data.content, createdAt: new Date().toISOString() });
    });
    socket.on('disconnect', () => logger.info(`User disconnected: ${socket.userId}`));
  });
  return io;
};

const getIO = () => { if (!io) throw new Error('WebSocket not initialized'); return io; };
const emitToUser = (userId, event, data) => { if (io) io.to(`user:${userId}`).emit(event, data); };

module.exports = { initializeWebSocket, getIO, emitToUser };
