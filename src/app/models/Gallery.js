const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho Gallery (bộ sưu tập ảnh/video)
const gallerySchema = new Schema({
    mediaUrl: {
        type: String,
        required: true, // Đường dẫn tới hình ảnh hoặc video (URL hoặc file path)
    },
    type: {
        type: String,
        enum: ['image', 'video'], // Phân biệt media là ảnh hay video
        required: true, // Loại media (image hoặc video)
    },
    category: {
        type: String,
        enum: ['Biển đảo', 'Thiên nhiên', 'Văn hóa, lịch sử', 'Miền núi, cao nguyên', 'Miền Tây'], // Loại tour liên quan đến media
        required: true, // Phân loại bộ sưu tập theo tour hoặc địa điểm
    },
    caption: {
        type: String,
        required: true, // Chú thích cho hình ảnh/video
    },
    createdAt: {
        type: Date,
        default: Date.now, // Thời gian tạo bộ sưu tập ảnh/video
    }
}, { timestamps: true }); // Tự động tạo trường createdAt và updatedAt

// Tạo model từ schema
module.exports = mongoose.model('Gallery', gallerySchema);


