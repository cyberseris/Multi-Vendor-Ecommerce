const { authMiddleware } = require('../../middlewares/authMiddleware');
const chatController = require('../../controllers/chat/chatController');
const express = require('express');
const router = express.Router();

router.post('/chat/customer/add-customer-friend', chatController.add_customer_friend);
router.post('/chat/customer/send-message-to-seller', chatController.add_customer_message);
router.get('/chat/seller/get-customers/:sellerId', chatController.get_customers);
router.get('/chat/seller/get-customer-message/:customerId', authMiddleware, chatController.get_customers_seller_message);
router.post('/chat/seller/send-message-to-customer', authMiddleware, chatController.add_seller_message);
router.get('/chat/admin/get-sellers', authMiddleware, chatController.get_sellers);
router.post('/chat/send-message-seller-admin', chatController.send_message_seller_admin);
router.get('/chat/get-admin-message/:receiverId', authMiddleware, chatController.get_admin_message)
router.get('/chat/get-seller-message', authMiddleware, chatController.get_seller_message)


module.exports = router;

