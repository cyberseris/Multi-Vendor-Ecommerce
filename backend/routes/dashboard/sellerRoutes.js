const { authMiddleware } = require('../../middlewares/authMiddleware');
const sellerControllers = require('../../controllers/dashboard/sellerController');
const express = require('express');
const router = express.Router();

router.get('/request-seller-get', authMiddleware, sellerControllers.request_seller_get);
router.get('/get-seller/:sellerId', authMiddleware, sellerControllers.get_seller);
router.patch('/seller-status-update', authMiddleware, sellerControllers.seller_status_update);



module.exports = router;

