const mongoose = require('mongoose');

// Định nghĩa schema cho collection reviews
const reviewSchema = new mongoose.Schema({
    image: String, // URL ảnh của người dùng đánh giá
    name: String,  // Tên của người dùng
    review: String // Nội dung đánh giá
});

// Tạo model từ schema
module.exports = mongoose.model('Review', reviewSchema);

