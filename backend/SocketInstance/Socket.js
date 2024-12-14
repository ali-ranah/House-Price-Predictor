const socketIo = require('socket.io');
const MessageModel = require('../Model/messagingModel'); // Import the message model
const User = require('../Model/userModel'); // Import user model for user data

let io;
let connectedUsers = {}; // Object to store connected users and their socket IDs

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client Connected!', socket.id);

    // Handle user connection
    socket.on('USER_CONNECTED', ({ userId }) => {
      connectedUsers[userId] = socket.id; // Map user ID to the socket ID
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    });

    // Handle message sending
    socket.on('SEND_MESSAGE', async ({ senderId, receiverId, content }) => {
      try {
        // Save message to the database
        const newMessage = await MessageModel.create({
          sender: senderId,
          receiver: receiverId,
          content,
          timestamp: new Date(),
        });

        // Emit the message to the receiver if they're online
        if (connectedUsers[receiverId]) {
          io.to(connectedUsers[receiverId]).emit('RECEIVE_MESSAGE', newMessage);
        }

        // Acknowledge the sender
        socket.emit('MESSAGE_SENT', { status: 'success', message: newMessage });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Failed to send message' });
      }
    });

    // Handle message fetching
    socket.on('GET_MESSAGES', async ({ userId, chatPartnerId }) => {
      try {
        const messages = await MessageModel.find({
          $or: [
            { sender: userId, receiver: chatPartnerId },
            { sender: chatPartnerId, receiver: userId },
          ],
        }).sort({ timestamp: 1 }); // Sort by timestamp

        socket.emit('MESSAGES_RESPONSE', { status: 'success', messages });
      } catch (error) {
        console.error('Error fetching messages:', error);
        socket.emit('MESSAGES_ERROR', { status: 'error', error: 'Failed to fetch messages' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove the user from the connected users list
      for (const [userId, socketId] of Object.entries(connectedUsers)) {
        if (socketId === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
    });
  });
};

const getIoInstance = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initializeSocket, getIoInstance };
