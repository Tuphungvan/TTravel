const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars'); // Sử dụng cú pháp require
const session = require('express-session');
const { faker } = require('@faker-js/faker');
const cron = require('node-cron');
const ManagerOrderController = require('./app/controllers/ManagerOrderController');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const route = require('./routes');
const db = require('./config/db');
const User = require('./app/models/User'); // Mô hình người dùng

// xử lý ngoài POST/GET
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`Phương thức sau ghi đè: ${req.method}, URL: ${req.url}`);
  next();
});
//su dung file tinh
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
//vs dn dk
app.use(cors())
app.use(cookieParser())
// HTTP logger
app.use(morgan('combined'));

//session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Template engine
app.engine('hbs', engine(
  {
    extname: '.hbs',
    helpers: {
      eq: (a, b) => a === b,
      add: (a, b) => a + b,
      increment: function (value) {
        return parseInt(value) + 1;
      },
      split: (text, delimiter) => text ? text.split(delimiter) : [],
      formatDate: (date) => new Date(date).toLocaleDateString('vi-VN'),
      reduce: function (array, field) {
        return array.reduce((total, item) => total + (item[field] || 0), 0);
      },
      ifEquals: function (a, b, options) {  // Helper so sánh hai giá trị
        if (a === b) {
          return options.fn(this);  // Nếu bằng nhau, trả về nội dung block
        } else {
          return options.inverse(this);  // Nếu không, trả về nội dung ngược lại
        }
      },
      compare: function (value1, value2, options) {  // Helper so sánh giá trị
        if (value1 >= value2) {
          return options.fn(this);  // Nếu điều kiện đúng, trả về nội dung block
        } else {
          return options.inverse(this);  // Nếu điều kiện sai, trả về nội dung block ngược lại
        }
      },
      formatPrice: (value) => {
        if (typeof value === 'number') {
          return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }); // Format theo chuẩn Việt Nam
        }
        return value;
      },
      translateLevel: function (level) {
        if (level === 'Easy') return 'Dễ';
        if (level === 'Medium') return 'Vừa';
        if (level === 'Hard') return 'Khó';
        return level; // Nếu không phải là các giá trị trên thì trả về chính nó
      }
    },
    layoutsDir: path.join(__dirname, 'resources', 'views', 'users', 'layouts'),
    partialsDir: path.join(__dirname, 'resources', 'views', 'users', 'partials'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,  // Cho phép truy cập vào thuộc tính prototype
      allowProtoMethodsByDefault: true,     // Cho phép truy cập vào phương thức prototype
    },
  }
));
app.set('view engine', 'hbs');
//quan ly duong dan, dung tu thu muc
app.set('views', path.join(__dirname, 'resources', 'views'));
// Middleware để tắt layout cho tất cả các route dưới /admin
app.use('/admin', (req, res, next) => {
  res.locals.layout = false;  // Tắt layout cho tất cả các route dưới /admin
  next();
});

// Route

route(app);

// Hàm khởi động ứng dụng
const startApp = async () => {
  try {
    // Kết nối MongoDB
    await db.connect();
    console.log('Kết nối MongoDB thành công!');

    // Xóa các đơn hàng hết hạn
    const managerOrderController = ManagerOrderController;
    await managerOrderController.deleteExpiredOrders();

    // Khởi động server
    app.listen(port, () => {
      console.log(`Server đang chạy tại http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Lỗi khi khởi động ứng dụng:', error);
  }
};

// Gọi hàm khởi động
startApp();


