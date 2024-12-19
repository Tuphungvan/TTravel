const express = require('express');
const router = express.Router();
const managerOrderController = require('../app/controllers/ManagerOrderController');
const isAdmin = require('../app/middlewares/isAdmin');
const ensureActive = require('../app/middlewares/ensureActive');
// Lấy danh sách đơn hàng chờ thanh toán
router.get('/pending-payment', isAdmin, ensureActive, managerOrderController.getOrdersPendingPayment);

// Lấy danh sách đơn hàng đã thanh toán và chờ xác nhận
router.get('/to-confirm', isAdmin, ensureActive, managerOrderController.getOrdersToConfirm);

// Xác nhận đơn hàng và chuyển sang trạng thái "Hoàn tất"
router.get('/confirm/:orderId', isAdmin, ensureActive, managerOrderController.confirmOrder);

// Xóa đơn hàng chưa thanh toán
router.get('/delete/:orderId', isAdmin, ensureActive, managerOrderController.deletePendingOrder);

// Hoàn tất đơn hàng đã hết hạn
router.get('/complete/:orderId', isAdmin, ensureActive, managerOrderController.confirmExpiredOrder);

router.get('/completed', isAdmin, ensureActive, managerOrderController.getOrdersCompleted);

// Lấy báo cáo doanh thu
router.get('/revenue-report', isAdmin, ensureActive, managerOrderController.getRevenueReport);

// Trang tổng quan
router.get('/', isAdmin, ensureActive, (req, res) => {
    res.render('admin/manager-order'); // Trang tổng quan với các nút điều hướng
});


module.exports = router;

