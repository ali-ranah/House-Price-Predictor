const socketIo = require('socket.io');
const MessageModel = require('../Model/messagingModel'); // Import message model
const User = require('../Model/userModel'); // Import user model

let io;
let connectedUsers = {}; // Object to store connected users by email

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
    socket.on('USER_CONNECTED', async ({ userEmail }) => {
      // Store the socket ID for the user by email
      connectedUsers[userEmail] = socket.id;
      console.log(`User ${userEmail} connected with socket ID ${socket.id}`);

      try {
        // Find the user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
          socket.emit('UNSEEN_COUNT_ERROR', { status: 'error', error: 'User not found' });
          return;
        }

        // Fetch the unseen message count for the user
        const unseenCount = await MessageModel.countDocuments({
          receiver: user._id,
          receiverSeen: false, // Assuming this field tracks whether the receiver has seen the message
        });

        // Emit the unseen message count to the connected user
        socket.emit('UNSEEN_MESSAGE_COUNT', { unseenCount });
      } catch (error) {
        console.error('Error fetching unseen message count:', error);
        socket.emit('UNSEEN_COUNT_ERROR', { status: 'error', error: 'Failed to fetch unseen message count' });
      }
    });

    // Handle message sending
    socket.on('SEND_MESSAGE', async ({ senderId, receiverId, content, propertyId }) => {
      try {
        // Save the message to the database
        const newMessage = await MessageModel.create({
          sender: senderId,
          receiver: receiverId,
          content,
          timestamp: new Date(),
          receiverSeen: false,
          propertyId
        });

        // Emit the message to the receiver if they are connected
        if (connectedUsers[receiverId]) {
          io.to(connectedUsers[receiverId]).emit('RECEIVE_MESSAGE', newMessage);

          // Update unseen message count for the receiver
          const unseenCount = await MessageModel.countDocuments({
            receiver: receiverId,
            receiverSeen: false,
          });
          io.to(connectedUsers[receiverId]).emit('UNSEEN_MESSAGE_COUNT', { unseenCount });
        }

        // Acknowledge the sender
        socket.emit('MESSAGE_SENT', { status: 'success', message: newMessage });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Failed to send message' });
      }
    });

    // Handle message editing
    socket.on('EDIT_MESSAGE', async ({ messageId, content }) => {
      try {
        const message = await MessageModel.findById(messageId);
        if (!message) {
          socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Message not found' });
          return;
        }

        message.content = content;
        await message.save();

        // Emit updated message to the receiver if they are connected
        if (connectedUsers[message.receiver.toString()]) {
          io.to(connectedUsers[message.receiver.toString()]).emit('RECEIVE_MESSAGE', message);
        }

        socket.emit('MESSAGE_UPDATED', { status: 'success', message });
      } catch (error) {
        console.error('Error editing message:', error);
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Failed to edit message' });
      }
    });

    // Handle message deletion
    socket.on('DELETE_MESSAGE', async ({ messageId }) => {
      try {
        const message = await MessageModel.findById(messageId);
        if (!message) {
          socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Message not found' });
          return;
        }

        await message.remove();

        // Emit the deletion event to the receiver if they are connected
        if (connectedUsers[message.receiver.toString()]) {
          io.to(connectedUsers[message.receiver.toString()]).emit('MESSAGE_DELETED', { messageId });
        }

        socket.emit('MESSAGE_DELETED', { status: 'success', messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Failed to delete message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from connectedUsers on disconnect
      for (const [userEmail, socketId] of Object.entries(connectedUsers)) {
        if (socketId === socket.id) {
          delete connectedUsers[userEmail];
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
