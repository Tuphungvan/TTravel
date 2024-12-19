// AdminController.js
const Tour = require('../models/Tour'); 
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Hàm trích xuất videoId từ URL YouTube
function extractVideoId(videoUrl) {
    if (typeof videoUrl === 'string' && videoUrl) {
        // Kiểm tra nếu URL là YouTube
        const regex = /(?:youtube\.com\/(?:[^\/]+\/[^\?]+|\S+\/\S+\/\S+))?([a-zA-Z0-9_-]{11})/;
        const match = videoUrl.match(regex);
        return match ? match[1] : null;
    }
    return null; // Trả về null nếu không tìm thấy ID
}


class AdminController {
  async dashboard(req, res) {
    try {
        res.render('admin/dashboard'); // Tạo view 'dashboard' nếu chưa có
    } catch (err) {
        console.error('Error rendering dashboard view:', err);
        res.status(500).json({ message: "Server error", error: err });
    }
}

    // [GET] /admin/manage-tours - Quản lý danh sách tour
async manageTours(req, res) {
    try {
        const tours = await Tour.find(); // Lấy danh sách tất cả các tour
        console.log(tours); 
        res.render('admin/manageTours', { tours });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// [GET] /admin/create-tour - Tạo tour mới
async renderCreateTour(req, res) {
    res.render('admin/createTour');
}

// [POST] /admin/create-tour - Lưu tour mới
    async createTour(req, res) {
        try {
            const { name, description, videoUrl, level, startDate, endDate, itinerary, price } = req.body;

            // Trích xuất videoId từ URL YouTube
            const videoId = extractVideoId(videoUrl);
            if (!videoId) {
                return res.status(400).json({ message: 'Invalid YouTube URL' });
            }

            // Tạo URL thumbnail từ videoId
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

            const newTour = new Tour({
                name,
                description,
                videoId,
                level,
                startDate,
                endDate,
                itinerary,
                price,
                image: thumbnailUrl // Lưu thumbnail vào image
            });
            await newTour.save();
            res.redirect('/admin/manage-tours');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err });
        }
    }

// [GET] /admin/edit-tour/:id - Chỉnh sửa tour
async renderEditTour(req, res) {
    try {
        const tour = await Tour.findById(req.params.id).lean();
        res.render('admin/editTour', { tour });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// [POST] /admin/edit-tour/:id - Lưu chỉnh sửa
    async updateTour(req, res) {
        try {
            const { name, description, videoUrl, level, startDate, endDate, itinerary, price } = req.body;

            // Trích xuất videoId từ URL YouTube
            const videoId = extractVideoId(videoUrl);
            if (!videoId) {
                return res.status(400).json({ message: 'Invalid YouTube URL' });
            }

            // Tạo URL thumbnail từ videoId
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

            const updatedTour = await Tour.findByIdAndUpdate(req.params.id, {
                name,
                description,
                videoId,
                level,
                startDate,
                endDate,
                itinerary,
                price,
                image: thumbnailUrl // Cập nhật thumbnail mới
            }, { new: true });
            res.redirect('/admin/manage-tours');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err });
        }
    }

// [DELETE] /admin/delete-tour/:id - Xóa tour
async deleteTour(req, res) {
    try {
        
        await Tour.findByIdAndDelete(req.params.id);
        res.redirect('/admin/manage-tours');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
}

    // [GET] /admin/manage-users - Quản lý người dùng
    
    async manageUsers(req, res) {
        try {
            const query = {};

            // Thêm điều kiện tìm kiếm nếu có query "search"
            if (req.query.search) {
                query.username = { $regex: req.query.search, $options: 'i' }; // Tìm kiếm không phân biệt hoa/thường
            }

            // Tạo điều kiện sắp xếp nếu có query "sort"
            const sortOption = req.query.sort === 'asc' ? { username: 1 } : req.query.sort === 'desc' ? { username: -1 } : {};

            // Lấy danh sách người dùng và sắp xếp theo sortOption
            const users = await User.find(query).sort(sortOption);
            

            res.render('admin/manageUsers', {
                users,
                searchQuery: req.query.search || '',
                sortOrder: req.query.sort || ''
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }


    // [POST] /admin/deactivate-user/:id - Khóa tài khoản người dùng
    async deactivateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { active: false },
                { new: true } // Trả về bản ghi sau khi cập nhật
            );
            if (user) {
                res.redirect('/admin/users');
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }

    // [POST] /admin/activate-user/:id - Kích hoạt tài khoản người dùng
    async activateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { active: true },
                { new: true } // Trả về bản ghi sau khi cập nhật
            );
            if (user) {
                res.redirect('/admin/users');
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }


    // [POST] /admin/reset-password/:id - Khôi phục mật khẩu
    async resetPassword(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const defaultPassword = "000000"; // Mật khẩu mặc định
            const salt = await bcrypt.genSalt(10); // Tạo salt để mã hóa
            const hashedPassword = await bcrypt.hash(defaultPassword, salt); // Mã hóa mật khẩu

            user.password = hashedPassword; // Lưu mật khẩu mã hóa vào DB
            await user.save();

            res.redirect('/admin/users'); // Chuyển hướng sau khi reset
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }
  // Các chức năng khác cho admin
   // Controller để tạo admin
    async createAdmin(req, res) {
        try {
          if (!req.session.user || !req.session.user.admin) {
            return res.redirect('/'); // Nếu không phải admin, chuyển hướng về trang chính
        }
            const { username, email, password, phoneNumber } = req.body;

            const existingUser = await User.findOne({
                $or: [
                    { email },
                    { username },
                    { phoneNumber }
                ]
            });

            if (existingUser) {
                let errorMessage = "";

                if (existingUser.email === email) {
                    errorMessage = "Email đã được đăng ký.";
                } else if (existingUser.phoneNumber === phoneNumber) {
                    errorMessage = "Số điện thoại đã được đăng ký.";
                } else if (existingUser.username === username) {
                    errorMessage = "Tên người dùng đã được đăng ký.";
                }

                return res.render('admin/createAdmin', {
                    errorMessage, // Gửi thông báo lỗi cụ thể
                    successMessage: ''
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = new User({
                username,
                email,
                password: hashedPassword,
                phoneNumber,
                admin: true // Gán quyền admin
            });

            await newAdmin.save();
            res.render('admin/createAdmin', {
                successMessage: "Đã tạo quản trị viên mới thành công!",
                errorMessage: ''
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    }
    async renderCreateAdminForm(req, res) {
        try {
            res.render('admin/createAdmin');
        } catch (err) {
            console.error('Lỗi hiển thị:', err);
            res.status(500).json({ message: 'Server error', error: err });
        }
    }

}

module.exports = new AdminController();
