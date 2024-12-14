// const Message = require('../Model/messagingModel');
// const Property = require('../Model/propertyModel');

// exports.sendMessage = async (req, res) => {
//     const { propertyId, message } = req.body;
//     const sender = req.user.userId;

//     console.log('propertyId',propertyId);
//     console.log('message',message);
//     console.log('sender',sender);


//     try {
//         const property = await Property.findById(propertyId);

//         if (!property || !property.isSold || 
//             (property.owner.toString() !== sender && property.buyer.toString() !== sender)) {
//             return res.status(403).json({ message: 'Unauthorized to send messages for this property' });
//         }

//         // Determine the receiver based on who the sender is
//         const receiver = property.owner.toString() === sender ? property.buyer : property.owner;

//         // Create a conversationId based on the sender and receiver
//         const conversationId = `${sender}-${receiver}`;

//         // Save the message with the correct sender, receiver, and content
//         const newMessage = await Message.create({
//             sender,
//             receiver,  // Ensure that the receiver is provided
//             content: message,
//             conversationId
//         });

//         // Populate sender and receiver details if necessary
//         await newMessage.populate('sender', 'name email');
//         await newMessage.populate('receiver', 'name email');

//         res.status(201).json({ message: 'Message sent successfully', newMessage });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to send message', error });
//     }
// };

// exports.getMessages = async (req, res) => {
//     const { propertyId } = req.params;
//     const userId = req.user.userId;

//     try {
//         // Fetch property
//         const property = await Property.findById(propertyId);
//         console.log('Property', property);

//         // Ensure the user is either the owner or the buyer of the property and that the property is sold
//         if (!property || !property.isSold ||
//             (property.owner.toString() !== userId && property.buyer.toString() !== userId)) {
//             return res.status(403).json({ message: 'Unauthorized to view messages for this property' });
//         }

//         // Determine the conversationId based on the user requesting the messages
//         const receiver = property.owner.toString() === userId ? property.buyer : property.owner;

//         // Handle both 'seller-buyer' and 'buyer-seller' conversationId formats
//         const conversationId1 = `${property.owner}-${property.buyer}`;
//         const conversationId2 = `${property.buyer}-${property.owner}`;

//         console.log('conversationId1', conversationId1);
//         console.log('conversationId2', conversationId2);

//         // Fetch messages for both conversation formats
//         const messages = await Message.find({
//             $or: [
//                 { conversationId: conversationId1 },
//                 { conversationId: conversationId2 }
//             ]
//         })
//         .populate('sender', 'name email')
//         .populate('receiver', 'name email');

//         // Return the fetched messages
//         return res.status(200).json({ messages });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to fetch messages', error });
//     }
// };


const Message = require('../Model/messagingModel');
const Property = require('../Model/propertyModel');

exports.sendMessage = async (req, res) => {
    const { propertyId, message } = req.body;
    const sender = req.user.userId;

    try {
        const property = await Property.findById(propertyId);

        if (!property || !property.isSold || 
            (property.owner.toString() !== sender && property.buyer.toString() !== sender)) {
            return res.status(403).json({ message: 'Unauthorized to send messages for this property' });
        }

        const receiver = property.owner.toString() === sender ? property.buyer : property.owner;

        const conversationId = `${sender}-${receiver}`;

        const newMessage = await Message.create({
            sender,
            receiver,
            content: message,
            conversationId,
            timestamp: Date.now()
        });

        await newMessage.populate('sender', 'name email');
        await newMessage.populate('receiver', 'name email');

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error });
    }
};

exports.getMessages = async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user.userId;
  
    try {
      // Fetch property and check if the user is allowed to view messages
      const property = await Property.findById(propertyId);
      if (!property || !property.isSold || (property.owner.toString() !== userId && property.buyer.toString() !== userId)) {
        return res.status(403).json({ message: 'Unauthorized to view messages for this property' });
      }
  
      // Determine the conversationId based on the user requesting the messages
      const receiver = property.owner.toString() === userId ? property.buyer : property.owner;
      const conversationId1 = `${property.owner}-${property.buyer}`;
      const conversationId2 = `${property.buyer}-${property.owner}`;
  
      // Fetch messages for both conversation formats
      const messages = await Message.find({
        $or: [{ conversationId: conversationId1 }, { conversationId: conversationId2 }]
      })
        .populate('sender', 'name email')
        .populate('receiver', 'name email');
  
      // Mark all messages as seen by the receiver
      await Message.updateMany(
        { receiver: userId, receiverSeen: false },  // Only update unseen messages
        { $set: { receiverSeen: true } }
      );
  
      // Return the fetched messages
      return res.status(200).json({ messages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch messages', error });
    }
  };
  
// Edit message controller
exports.editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    const timeDiff = new Date() - new Date(message.timestamp);
    if (timeDiff > 15 * 60 * 1000) {
        return res.status(400).json({ message: 'Editing time expired' });
    }

    if (message.sender.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized to edit this message' });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ message: 'Message updated successfully', updatedMessage: message });
};

// Delete message controller
exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    const timeDiff = new Date() - new Date(message.timestamp);
    if (timeDiff > 30 * 60 * 1000 && message.receiverSeen) {
        return res.status(400).json({ message: 'Message cannot be deleted' });
    }

    if (message.sender.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await message.remove();
    res.status(200).json({ message: 'Message deleted successfully' });
};