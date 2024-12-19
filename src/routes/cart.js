const express = require('express');
const router = express.Router();
const CartController = require('../app/controllers/CartController');
const isAuthenticated = require('../app/middlewares/isAuthenticated');  // Đảm bảo người dùng đã đăng nhập

// Thêm tour vào giỏ hàng
router.post('/add-to-cart/:slug', isAuthenticated, CartController.addToCart);

// Xem giỏ hàng
router.get('/cart', isAuthenticated, CartController.viewCart);

// Xóa tour khỏi giỏ hàng
router.delete('/cart/remove/:slug', isAuthenticated, CartController.removeFromCart);

router.get('/count', isAuthenticated, CartController.cartItemCount);

module.exports = router;
