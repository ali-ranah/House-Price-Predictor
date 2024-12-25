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

    let userEmail = null;  // Track user email for this socket
    let isUserConnected = false; // Flag to track if the user is connected

    // Handle user connection
    socket.on('USER_CONNECTED', async ({ userEmail: connectedUserEmail }) => {
      userEmail = connectedUserEmail;
      // Store the socket ID for the user by email
      connectedUsers[userEmail] = socket.id;
      isUserConnected = true; // Mark the user as connected
      console.log(`User ${userEmail} connected with socket ID ${socket.id}`);

      try {
        // Find the user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
          socket.emit('UNSEEN_COUNT_ERROR', { status: 'error', error: 'User not found' });
          return;
        }

        // Fetch all unseen messages for the user
        const unseenMessages = await MessageModel.find({
          receiver: user._id,
          receiverSeen: false, // Unseen messages only
        });

        // Group unseen messages by propertyId
        const unseenMessageCount = unseenMessages.reduce((acc, message) => {
          const propertyId = message.propertyId; // Assuming propertyId exists in the message
          acc[propertyId] = (acc[propertyId] || 0) + 1;
          return acc;
        }, {});
        console.log('unseen messages',unseenMessageCount);

        // Emit the unseen message count for each propertyId
        socket.emit('UNSEEN_MESSAGE_COUNT', { unseenMessage: unseenMessageCount });
      } catch (error) {
        console.error('Error fetching unseen message count:', error);
        socket.emit('UNSEEN_COUNT_ERROR', { status: 'error', error: 'Failed to fetch unseen message count' });
      }
    });

    // Handle message sending only if user is connected
    socket.on('SEND_MESSAGE', async ({ receiverId, message }) => {
      if (!isUserConnected) {
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'User is not connected' });
        return;
      }
    
      try {
        // Find the receiver's email from the User model using receiverId
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Receiver not found' });
          return;
        }
        const receiverEmail = receiver.email; // Retrieve the receiver's email
    
        // Emit the message to the receiver if they are connected
        if (connectedUsers[receiverEmail]) {
          io.to(connectedUsers[receiverEmail]).emit('RECEIVE_MESSAGE', message);
        }

           // Update and emit unseen count after marking as seen
       const unseenMessages = await MessageModel.find({
        receiver: receiver,
        receiverSeen: false,
      });

      // Group unseen messages by propertyId
      const unseenMessageCount = unseenMessages.reduce((acc, message) => {
        const propertyId = message.propertyId;
        acc[propertyId] = (acc[propertyId] || 0) + 1;
        return acc;
      }, {});

      // Emit the updated unseen message count
      if (connectedUsers[receiverEmail]) {
        io.to(connectedUsers[receiverEmail]).emit('UNSEEN_MESSAGE_COUNT', { unseenMessage: unseenMessageCount });
      }
    
        // Acknowledge the sender
        socket.emit('MESSAGE_SENT', { status: 'success', message: message });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Failed to send message' });
      }
    });


  // Handle MARK_AS_SEEN event
socket.on('MARK_AS_SEEN', async ({ messageId, sender, receiver }) => {
  try {
    // Fetch the sender's and receiver's emails from the User model
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Sender or receiver not found' });
    }

    const senderEmail = senderUser.email;
    const receiverEmail = receiverUser.email;

    // Update the message's receiverSeen field to true
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { receiverSeen: true },
      { new: true }
    );

    if (updatedMessage) {
      console.log('Message marked as seen:', updatedMessage);

      // Emit to the receiver if they are connected
      if (connectedUsers[receiverEmail]) {
        io.to(connectedUsers[receiverEmail]).emit('MESSAGE_SEEN', {
          messageId: updatedMessage._id,
          senderEmail,
        });
      } else {
        console.log(`${receiverEmail} is not online`);
      }

      // Optionally, emit to the sender that their message was seen
      if (connectedUsers[senderEmail]) {
        io.to(connectedUsers[senderEmail]).emit('MESSAGE_SEEN', {
          messageId: updatedMessage._id,
          senderEmail,
        });
      }
       // Update and emit unseen count after marking as seen
       const unseenMessages = await MessageModel.find({
        receiver: receiver,
        receiverSeen: false,
      });

      // Group unseen messages by propertyId
      const unseenMessageCount = unseenMessages.reduce((acc, message) => {
        const propertyId = message.propertyId;
        acc[propertyId] = (acc[propertyId] || 0) + 1;
        return acc;
      }, {});

      // Emit the updated unseen message count
      if (connectedUsers[receiverEmail]) {
        io.to(connectedUsers[receiverEmail]).emit('UNSEEN_MESSAGE_COUNT', { unseenMessage: unseenMessageCount });
      }
      if (connectedUsers[senderEmail]) {
        io.to(connectedUsers[senderEmail]).emit('UNSEEN_MESSAGE_COUNT', { unseenMessage: unseenMessageCount });
      }
    } else {
      socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Message not found' });
    }
  } catch (error) {
    console.error('Error marking message as seen:', error);
    socket.emit('MESSAGE_ERROR', { status: 'error', error: 'Failed to mark message as seen' });
  }
});
    

    // Handle message editing only if user is connected
    socket.on('EDIT_MESSAGE', async ({ messageId, content }) => {
      if (!isUserConnected) {
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'User is not connected' });
        return;
      }

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

    // Handle message deletion only if user is connected
    socket.on('DELETE_MESSAGE', async ({ messageId }) => {
      if (!isUserConnected) {
        socket.emit('MESSAGE_ERROR', { status: 'error', error: 'User is not connected' });
        return;
      }

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
