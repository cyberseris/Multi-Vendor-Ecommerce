const { authMiddleware } = require('../../middlewares/authMiddleware');
const dashboardController = require('../../controllers/dashboard/dashboardController');
const express = require('express');
const router = express.Router();

router.get('/get-admin-dashboard-data', authMiddleware, dashboardController.get_admin_dashboard_data);

module.exports = router;

