const { authMiddleware } = require('../../middlewares/authMiddleware');
const categoryController = require('../../controllers/dashboard/categoryController');
const express = require('express');
const router = express.Router();

router.post('/category-add', authMiddleware, categoryController.add_category);
router.get('/category-get', authMiddleware, categoryController.get_category);
router.put('/category-update/:id', authMiddleware, categoryController.update_category);
router.delete('/category-delete/:id', authMiddleware, categoryController.delete_category);

module.exports = router;