// adminRoutes.js
const express = require('express');
const router = express.Router();
const isAdmin = require('../app/middlewares/isAdmin'); 
const ensureActive = require('../app/middlewares/ensureActive');
const adminController = require('../app/controllers/AdminController');


router.get('/edit-tour/:id', isAdmin, ensureActive, adminController.renderEditTour);
router.post('/edit-tour/:id', isAdmin, ensureActive, adminController.updateTour);
router.post('/delete-tour/:id', isAdmin, ensureActive, adminController.deleteTour);
// Chỉ cho phép admin truy cập
router.get('/dashboard', isAdmin, ensureActive, adminController.dashboard);
// Quản lý người dùng
router.get('/users', isAdmin, ensureActive, adminController.manageUsers);

router.post('/deactivate-user/:id', isAdmin, ensureActive, adminController.deactivateUser);
router.post('/activate-user/:id', isAdmin, ensureActive, adminController.activateUser);
router.post('/reset-password/:id', isAdmin, ensureActive, adminController.resetPassword);

// Thêm các route khác cho admin như quản lý tour, v.v.
router.get('/create-admin', isAdmin, adminController.renderCreateAdminForm);

router.post('/create-admin', isAdmin, adminController.createAdmin); // Xử lý thêm admin

// Quản lý tour
router.get('/manage-tours', isAdmin, ensureActive, adminController.manageTours); // Danh sách tour
router.get('/create-tour', isAdmin, adminController.renderCreateTour); // Danh sách tour
router.post('/create-tour', isAdmin, adminController.createTour); // Danh sách tour



module.exports = router;
