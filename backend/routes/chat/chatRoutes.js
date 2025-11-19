const chatController = require('../../controllers/chat/chatController');
const express = require('express');
const router = express.Router();

router.post('/chat/customer/add-customer-friend', chatController.add_customer_friend);
router.post('/chat/customer/send-message-to-seller', chatController.add_customer_message);



module.exports = router;

