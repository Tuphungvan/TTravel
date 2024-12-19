const mongoose = require('mongoose');
const slugify = require('slugify');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

// Khai báo schema cho Tour
const Tour = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        videoId: { type: String, required: true },
        level: { type: String },
        startDate: { type: Date },  // Ngày bắt đầu tour
        endDate: { type: Date },    // Ngày kết thúc tour
        itinerary: { type: String }, // Lịch trình tour
        price: { type: Number },      // Giá tour
        slug: { type: String, unique: true },  // Không sử dụng slug tự động
    },
    {
        timestamps: true,  // Tự động thêm createdAt và updatedAt
    }
);

// Thêm hàm tạo slug trước khi lưu
Tour.pre('save', function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Thêm các plugin vào mongoose
Tour.plugin(mongooseDelete, {
    deletedAt: true,  // Trường deletedAt để đánh dấu thời gian xóa
    overrideMethods: 'all',  // Cung cấp các phương thức như find, findOne với xóa mềm
});

// Xuất mô hình Tour
module.exports = mongoose.model('Tour', Tour);
