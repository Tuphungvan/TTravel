const express = require('express');
const router = express.Router();
const ReviewController = require('../app/controllers/ReviewController');
const isAdmin = require('../app/middlewares/isAdmin');

// Route lấy danh sách tất cả review
router.get('/admin/review', isAdmin, ReviewController.getAllReviews);

// Route hiển thị form thêm review
router.get('/admin/add-review', isAdmin, ReviewController.getAddReview);

// Route thêm review mới
router.post('/admin/add-review', isAdmin, ReviewController.addReview);

// Route xóa review
router.get('/admin/delete-review/:id', isAdmin, ReviewController.deleteReview);

router.get('/api/reviews', ReviewController.getReviewsJson);
module.exports = router;
