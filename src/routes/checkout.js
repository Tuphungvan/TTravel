const express = require('express');
const router = express.Router();
const checkoutController = require('../app/controllers/CheckoutController');
const isAuthenticated = require('../app/middlewares/isAuthenticated'); 
// Route hiển thị trang thanh toán
router.get('/', isAuthenticated, checkoutController.index);

// Route xác nhận thanh toán
router.post('/confirm', isAuthenticated, checkoutController.confirm);
// Route chỉ đặt hàng
router.post('/place-order', isAuthenticated, checkoutController.placeOrder);
// Xác nhận thanh toán cho đơn hàng
router.post('/confirm-payment/:id', isAuthenticated, checkoutController.confirmPayment);
// Route hiển thị trang thanh toán với thông tin đơn hàng
router.get('/payment/:id', isAuthenticated, checkoutController.showPaymentPage);

module.exports = router;
