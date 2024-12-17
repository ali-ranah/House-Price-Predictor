const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId:{type: mongoose.Schema.Types.ObjectId,ref:'Property' ,required: true},
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  conversationId: { type: String, required: true },
  receiverSeen: { type: Boolean, default: false },  // Add field to track if the message has been seen
});

module.exports = mongoose.model('Message', messageSchema);
