const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order/orderController');

router.post('/home/order/place-order', orderController.place_order);
router.get('/home/customer/get-orders/:customerId/:status', orderController.get_orders);
router.get('/home/customer/get-order-details/:orderId', orderController.get_order_details);
router.get('/home/customer/get-dashboard-data/:userId', orderController.get_customer_dashboard_data);
router.get('/admin/orders', orderController.get_admin_orders);
router.get('/admin/orders/:orderId', orderController.get_admin_order);
router.put('/admin/order-status/update/:orderId', orderController.admin_order_status_update);

module.exports = router;