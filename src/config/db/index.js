const mongoose = require('mongoose');

async function connect() {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect('mongodb://localhost:27017/travel');

        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!');
        console.error(error);  // In ra lỗi chi tiết để dễ dàng chẩn đoán
    }
}

module.exports = { connect };

