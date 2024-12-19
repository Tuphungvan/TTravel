const User = require('../models/User');
const Order = require('../models/Order');
const History = require('../models/History');
const Tour = require('../models/Tour');
const bcrypt = require('bcrypt');
const Wallet = require('../models/Wallet');
class ProfileController {
    // Trang user profile chính
    async index(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const user = req.session.user;
            res.render('users/user-profile', { user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }

    // Hiển thị danh sách đơn hàng
    async myOrders(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const userId = req.session.user.id;
            console.log(`User ID: ${userId}`); // Log để kiểm tra user ID

            const orders = await Order.find({ userId }).sort({ createdAt: -1 });
            console.log(`Orders: ${JSON.stringify(orders)}`); // Kiểm tra dữ liệu đơn hàng

            res.render('users/my-orders', { orders });
        } catch (err) {
            console.error(err); // Kiểm tra chi tiết lỗi
            res.status(500).json({ message: "Server error", error: err });
        }
    }


    // Hiển thị lịch sử đơn hàng
    async history(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const userId = req.session.user.id;

            // Lấy đầy đủ thông tin lịch sử và populate các trường liên quan
            const histories = await History.find({ userId }).sort({ completedAt: -1 });

            res.render('users/history', { histories });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }


    // Hiển thị trang cập nhật thông tin cá nhân
    async updateProfile(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const userId = req.session.user.id;
            const user = await User.findById(userId);
            res.render('users/update-profile', { user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }

    // Xử lý cập nhật thông tin cá nhân
    async handleUpdateProfile(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const userId = req.session.user.id;
            const { username, email, phoneNumber, address, password } = req.body;            await User.findByIdAndUpdate(userId, { username, email, phoneNumber, address });

            // Kiểm tra trùng lặp email, username, phoneNumber
            const existingUser = await User.findOne({ $or: [{ username }, { email }, { phoneNumber }] });
            if (existingUser && existingUser.id !== userId) {
                return res.render('users/update-profile', {
                    user: req.body,
                    errorMessage: 'Username, email, or phone number already in use.'
                });
            }

            // Nếu có thay đổi mật khẩu, mã hóa mật khẩu
            let hashedPassword = password;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }

            // Cập nhật thông tin người dùng
            await User.findByIdAndUpdate(userId, {
                username,
                email,
                phoneNumber,
                address,
                password: hashedPassword !== password ? hashedPassword : undefined // Chỉ cập nhật password nếu có thay đổi
            });

            // Cập nhật lại session sau khi thay đổi thông tin
            req.session.user = await User.findById(userId);
            res.redirect('/v1/auth/login');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }
    // Hiển thị trang nạp tiền vào ví
    async rechargeWallet(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }

            const userId = req.session.user.id;
            const wallet = await Wallet.findOne({ userId });
            if (!wallet) {
                wallet = await Wallet.create({ userId, balance: 0 }); // Tạo ví mới với số dư 0
            }
            res.render('users/recharge-wallet', { wallet });
        } catch (err) {
            console.error(err);
            res.redirect('/profile/recharge-wallet');
        }
    }

    // Xử lý nạp tiền vào ví
    async handleRechargeWallet(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }

            const userId = req.session.user.id;
            const { amount } = req.body;
            // Kiểm tra tính hợp lệ của số tiền
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: "Invalid amount" });
            }

            const wallet = await Wallet.findOneAndUpdate(
                { userId },
                { $inc: { balance: Number(amount) } },
                { new: true, upsert: true } // Tạo ví mới nếu chưa tồn tại
            );

            res.render('users/recharge-wallet', { wallet, successMessage: 'Nạp tiền thành công!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }

    // Hiển thị chi tiết đơn hàng
    async orderDetail(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const { orderId } = req.params;
            const order = await Order.findById(orderId).populate('items.slug');

            if (!order) {
                return res.status(404).render('404', { message: "Order not found" });
            }

            res.render('users/order-detail', { order });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }

    // Hiển thị chi tiết lịch sử đơn hàng
    async historyDetail(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/v1/auth/login');
            }
            const { historyId } = req.params;
            const history = await History.findById(historyId).populate('orderId');

            if (!history) {
                return res.status(404).render('404', { message: "History record not found" });
            }

            res.render('users/history-detail', { history });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }
}

module.exports = new ProfileController();
