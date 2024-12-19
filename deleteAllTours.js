const mongoose = require('mongoose');
const Tour = require('./src/app/models/Tour'); // Import model Tour
const { connect } = require('./src/config/db'); // Import hàm kết nối DB

// Kết nối MongoDB
connect();

const deleteAllTours = async () => {
    try {
        await Tour.deleteMany({}); // Xóa toàn bộ dữ liệu trong collection Tour
        console.log('Đã xóa toàn bộ tour thành công.');
        process.exit();
    } catch (error) {
        console.error('Lỗi khi xóa tour:', error);
        process.exit(1);
    }
};

// Gọi hàm xóa
deleteAllTours();
