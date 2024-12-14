const express = require('express');
const { sendMessage, getMessages, editMessage, deleteMessage } = require('../Controller/messagingController');
const authMiddleware = require('../Middleware/AuthMiddleware/AuthMiddleware');

const router = express.Router();

router.post('/send', authMiddleware, sendMessage);
router.get('/:propertyId', authMiddleware, getMessages);

// New routes for editing and deleting messages
router.put('/edit/:messageId', authMiddleware, editMessage);
router.delete('/delete/:messageId', authMiddleware, deleteMessage);

module.exports = router;
