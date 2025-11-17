const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/home/cartController');

router.post('/home/product/add-to-cart', cartController.add_to_cart);
router.post('/home/product/add-to-wishlist', cartController.add_wishlist);
router.get('/home/product/get-wishlist/:userId', cartController.get_wishlist);
router.delete('/home/product/remove-wishlist/:wishlistId', cartController.remove_wishlist);
router.get('/home/product/get-cart-products/:userId', cartController.get_cart_products);
router.delete('/home/product/delete-cart-product/:cartProductId', cartController.delete_cart_product);
router.patch('/home/product/quantity-inc/:cartProductId', cartController.quantity_inc);
router.patch('/home/product/quantity-dec/:cartProductId', cartController.quantity_dec);

module.exports = router;

