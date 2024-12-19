const mongoose = require('mongoose');

const RevenueReportSchema = new mongoose.Schema({
    month: { type: Number, required: true }, // Tháng (1-12)
    year: { type: Number, required: true },  // Năm
    totalRevenue: { type: Number, default: 0 }, // Tổng doanh thu
    totalOrders: { type: Number, default: 0 }, // Số lượng đơn hàng hoàn tất
}, { timestamps: true });

module.exports = mongoose.model('RevenueReport', RevenueReportSchema);
