const { authMiddleware } = require('../middlewares/authMiddleware');
const authControllers = require('../controllers/authControllers');
const express = require('express');
const router = express.Router();

router.post('/admin-login', authControllers.admin_login);
router.get('/get-user', authMiddleware, authControllers.getUser);
router.post('/seller-register', authControllers.seller_register);
router.post('/seller-login', authControllers.seller_login);
router.patch('/profile-image-upload', authMiddleware, authControllers.profile_image_upload);
router.post('/profile-info-add', authMiddleware, authControllers.profile_info_add);

module.exports = router;