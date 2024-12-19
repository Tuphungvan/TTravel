const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const User = require('./src/app/models/User'); // Import model User
const { connect } = require('./src/config/db'); // Import hàm kết nối DB

// Kết nối MongoDB
connect();

// Danh sách tên người Việt (80 tên khác nhau)
const vietnameseNames = [
    "Nguyễn Văn Toàn", "Trần Thị Hoa", "Phạm Minh Hải", "Lê Quang Huy", "Hoàng Thị Vân",
    "Nguyễn Thị Mai", "Trần Minh Tuấn", "Phạm Thị Lan", "Lê Minh Thảo", "Hoàng Thị Bích",
    "Nguyễn Tiến Dũng", "Trần Thi Lan", "Phạm Ngọc Mai", "Lê Thị Lan", "Hoàng Minh Thịnh",
    "Nguyễn Quang Duy", "Trần Thế Anh", "Phạm Minh Tuấn", "Lê Thị Hương", "Hoàng Thị Phương",
    "Nguyễn Minh Nhật", "Trần Nhật Hào", "Phạm Hồng Ngọc", "Lê Thái Sơn", "Hoàng Duy Anh",
    "Nguyễn Tuấn Anh", "Trần Hoàng Nam", "Phạm Thị Vân", "Lê Thanh Bình", "Hoàng Minh Tuấn",
    "Nguyễn Hoàng Hải", "Trần Quang Tùng", "Phạm Minh Tân", "Lê Thi Thanh", "Hoàng Quang Minh",
    "Nguyễn Thị Cẩm", "Trần Thị Bích", "Phạm Tuấn Anh", "Lê Hoàng Cường", "Hoàng Thi Minh",
    "Nguyễn Minh Cảnh", "Trần Minh Hảo", "Phạm Thị Hiền", "Lê Thị Thủy", "Hoàng Minh Khôi",
    "Nguyễn Đỗ Thanh", "Trần Quang Lê", "Phạm Duy Quân", "Lê Thanh Lan", "Hoàng Hải Phong",
    "Nguyễn Kim Hoàng", "Trần Hồng Vân", "Phạm Đình Bảo", "Lê Hoàng Sơn", "Hoàng Khánh Chi",
    "Nguyễn Quang Thành", "Trần Tiến Thịnh", "Phạm Tuấn Thành", "Lê Hoàng Giang", "Hoàng Minh Quân",
    "Nguyễn Đạt Minh", "Trần Thị Quỳnh", "Phạm Tiến Nam", "Lê Ngọc Quân", "Hoàng Quang Ngọc",
    "Nguyễn Duy Trí", "Trần Kim Huy", "Phạm Thi Lan", "Lê Thu Hòa", "Hoàng Minh Trí",
    "Nguyễn Thanh Hà", "Trần Minh Hoài", "Phạm Hoàng Quang", "Lê Quang Nhật", "Hoàng Hồng Sơn",
    "Nguyễn Thi Mai", "Trần Minh Thành", "Phạm Thanh Hương", "Lê Thái Bảo", "Hoàng Hữu Tài"
];

// Danh sách tên người nước ngoài
const foreignNames = [
    "John Doe", "Jane Smith", "Michael Johnson", "Emily Davis", "James Brown", "Olivia Wilson",
    "Daniel Miller", "Sophia Moore", "William Taylor", "Charlotte Anderson", "David Thomas",
    "Mia Jackson", "Matthew Harris", "Amelia Clark", "Benjamin Lewis", "Evelyn Walker",
    "Lucas Robinson", "Abigail Hall", "Henry Young", "Ella King"
];

// Danh sách thành phố Việt Nam (20 thành phố khác nhau)
const vietnamCities = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Nha Trang", "Hải Phòng", "Huế", "Vũng Tàu",
    "Quảng Ninh", "Bình Dương", "Bắc Giang", "Bình Phước", "Quảng Ngãi", "Ninh Bình", "Lâm Đồng",
    "Phú Yên", "Kon Tum", "Sơn La", "Thanh Hóa", "Vĩnh Phúc"
];

// Danh sách 100 số điện thoại
const phoneNumbers = [
    '0912345678', '0923456789', '0934567890', '0945678901', '0956789012', '0967890123', '0978901234', '0989012345',
    '0990123456', '0901234567', '0912345679', '0923456790', '0934567901', '0945679012', '0956789123', '0967891234',
    '0978902345', '0989013456', '0990124567', '0901234568', '0912345680', '0923456801', '0934568012', '0945679123',
    '0956789234', '0967890345', '0978903456', '0989014567', '0990125678', '0901234569', '0912345681', '0923456812',
    '0934568123', '0945679234', '0956789345', '0967890456', '0978904567', '0989015678', '0990126789', '0901234570',
    '0912345682', '0923456823', '0934568234', '0945679345', '0956789456', '0967890567', '0978905678', '0989016789',
    '0990127890', '0901234571', '0912345683', '0923456834', '0934568345', '0945679456', '0956789567', '0967890678',
    '0978906789', '0989017890', '0990128901', '0901234572', '0912345684', '0923456845', '0934568456', '0945679567',
    '0956789678', '0967890789', '0978907890', '0989018901', '0990129012', '0901234573', '0912345685', '0923456856',
    '0934568567', '0945679678', '0956789789', '0967890890', '0978908901', '0989019012', '0990129123', '0901234574',
    '0912345686', '0923456867', '0934568678', '0945679789', '0956789890', '0967890901', '0978909012', '0989019123',
    '0990129234', '0901234575', '0912345687', '0923456878', '0934568789', '0945679890', '0956789901', '0967891012',
    '0978909123', '0989019234', '0990129345', '0901234576', '0912345688', '0923456889', '0934568890', '0945679901'
];
// Hàm mã hóa mật khẩu
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ phức tạp 10
    return bcrypt.hash(password, salt); // Mã hóa mật khẩu
};
// Hàm tạo một user giả lập
const generateUser = async (isForeign = false) => {
    const nameList = isForeign ? foreignNames : vietnameseNames;
    const phone = phoneNumbers.pop(); // Lấy số điện thoại duy nhất từ danh sách
    const hashedPassword = await hashPassword('123456');
    return {
        username: nameList[Math.floor(Math.random() * nameList.length)], // Chọn tên ngẫu nhiên
        email: faker.internet.email(), // Email vẫn giữ nguyên
        password: hashedPassword, // Mật khẩu mặc định
        phoneNumber: phone, // Sử dụng số điện thoại trong danh sách
        address: vietnamCities[Math.floor(Math.random() * vietnamCities.length)] + ', Việt Nam', // Địa chỉ tại Việt Nam
        admin: false, 
        active: true // Mặc định là active
    };
};

// Hàm thêm dữ liệu vào MongoDB
const addUsers = async () => {
    try {
        const batchSize = 10; // Số lượng user thêm vào mỗi lần
        const users = [];
        const usedVietnameseNames = new Set();
        const usedForeignNames = new Set();
        const usedPhoneNumbers = new Set();

        // Hàm thêm user theo nhóm
        const addBatch = async (batch) => {
            for (const user of batch) {
                await User.create(user);
            }
        };

        // Thêm 20 người nước ngoài
        for (let i = 0; i < 20; i++) {
            let newUser;
            do {
                newUser = await generateUser(true); // Tạo một user nước ngoài
            } while (usedForeignNames.has(newUser.username) || await User.exists({ username: newUser.username }));
            usedForeignNames.add(newUser.username);
            users.push(newUser);

            if (users.length >= batchSize) {
                await addBatch(users.splice(0, batchSize));
            }
        }

        // Thêm 80 người Việt Nam
        for (let i = 0; i < 80; i++) {
            let newUser;
            do {
                newUser = await generateUser(false); // Tạo một user Việt Nam
            } while (usedVietnameseNames.has(newUser.username) || await User.exists({ username: newUser.username }));
            usedVietnameseNames.add(newUser.username);
            users.push(newUser);

            if (users.length >= batchSize) {
                await addBatch(users.splice(0, batchSize));
            }
        }

        // Thêm những user còn lại
        if (users.length > 0) {
            await addBatch(users);
        }

        console.log('Thêm user thành công!');
    } catch (error) {
        console.error('Lỗi:', error);
    }
};


// Thực thi hàm
addUsers();
