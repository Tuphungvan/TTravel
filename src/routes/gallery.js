const express = require('express');
const router = express.Router();
const galleryController = require('../app/controllers/GalleryController');
const isAdmin = require('../app/middlewares/isAdmin');

// Route lấy gallery theo category cho người dùng
router.get('/gallery/category/:category', galleryController.getGalleryItemsByCategoryUser);


// Lấy tất cả các mục gallery (không phân loại)
router.get('/admin/gallery', isAdmin, galleryController.getAllGalleryItems);

// Các route khác: thêm, sửa, xóa gallery
router.post('/admin/gallery/add', isAdmin, galleryController.addGalleryItem); // Thêm mới mục gallery
router.post('/admin/gallery/update/:id', isAdmin, galleryController.updateGalleryItem);
router.post('/admin/gallery/delete/:id', isAdmin, galleryController.deleteGalleryItem); // Xóa mục gallery
router.get('/admin/gallery/add', isAdmin, galleryController.getAddGallery);
router.get('/admin/gallery/update/:id', isAdmin, galleryController.getUpdateGalleryItem);
module.exports = router;
