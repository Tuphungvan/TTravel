const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthControllers');

// Hiển thị form đăng ký
router.get('/register', authController.index);
router.get('/login', authController.indexlogin);
router.get('/logout', authController.logout); // Route xử lý đăng xuất




// Xử lý yêu cầu đăng ký
router.post('/register', authController.register);
router.post('/login', authController.login);

// Route kiểm tra trạng thái đăng nhập
router.get('/check-login-status', authController.checkLoginStatus);

module.exports = router;
