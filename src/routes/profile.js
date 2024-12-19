// profileRouter.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../app/middlewares/isAuthenticated'); 
const profileController = require('../app/controllers/ProfileController'); // Controller cho trang profile

// Hiển thị trang profile
router.get('/', isAuthenticated, profileController.index);
router.get('/my-orders', isAuthenticated, profileController.myOrders);
router.get('/history', isAuthenticated, profileController.history);
router.get('/update-profile', isAuthenticated, profileController.updateProfile);
router.post('/update-profile', isAuthenticated, profileController.handleUpdateProfile);
router.get('/my-orders/:orderId', isAuthenticated, profileController.orderDetail);
router.get('/history/:historyId', isAuthenticated, profileController.historyDetail);
router.get('/recharge-wallet', isAuthenticated, profileController.rechargeWallet);
router.post('/recharge-wallet', isAuthenticated, profileController.handleRechargeWallet);

module.exports = router;
