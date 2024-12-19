const User = require("../models/User");
const bcrypt = require("bcrypt");

class AuthController {
    // Trang đăng ký
    index(req, res) {
        res.render('users/register'); 
    }
    indexlogin(req, res) {
        res.render('login'); 
    }

    // Xử lý đăng ký người dùng
  async register(req, res) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Kiểm tra sự trùng lặp của email, username và phoneNumber trước khi lưu
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username },
                { phoneNumber: req.body.phoneNumber }
            ]
        });
         let errorMessage = ""; // Biến để lưu thông báo lỗi
        if (existingUser) {
            let errorMessage = "";
            if (existingUser.email === req.body.email) {
                errorMessage = "Email đã được đăng ký.";
            }
            if (existingUser.username === req.body.username) {
                errorMessage = "Tên người dùng đã được sử dụng.";
            }
            if (existingUser.phoneNumber === req.body.phoneNumber) {
                errorMessage = "Số điện thoại đã được đăng ký.";
            }

            // Gửi thông báo lỗi và render lại trang
            return res.render('users/register', {
                errorMessage: errorMessage, // Gửi thông báo lỗi
                successMessage: '' // Không hiển thị thông báo thành công
            });
        }
    
         // Kiểm tra độ dài của username
        if (req.body.username.length < 6) {
            return res.render('users/register', {
                errorMessage: "Tên người dùng phải dài ít nhất 6 ký tự.", // Thông báo lỗi nếu username quá ngắn
                successMessage: '' // Không hiển thị thông báo thành công
            });
        }
       // Kiểm tra xem có admin nào chưa
        const adminExists = await User.findOne({ admin: true });
        let isAdmin = false;

        if (!adminExists) {
            // Nếu chưa có admin, người đăng ký đầu tiên sẽ trở thành admin
            isAdmin = true;
        }

        // Tạo và lưu người dùng mới (mặc định là user, hoặc admin nếu chưa có admin trong hệ thống)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            admin: isAdmin // Chỉ người đầu tiên sẽ có quyền admin
        });

        await newUser.save();
        
        // Gửi thông báo thành công
        res.render('users/register', {
            successMessage: "Bạn đã đăng ký thành công!", // Gửi thông báo thành công
            errorMessage: '' // Không hiển thị thông báo lỗi
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err });
    }
}



    //login
    async login(req, res) {
    try {
        // Tìm người dùng theo username
        const user = await User.findOne({ username: req.body.username });

        // Nếu không tìm thấy user với username
        if (!user) {
            return res.render('login', { errorMessage: "Tên người dùng không tồn tại" }); // Trả lại trang login với thông báo lỗi
        }

        // Kiểm tra nếu tài khoản bị khóa
        if (!user.active) {
            return res.render('login', { errorMessage: "Tài khoản đã bị vô hiệu. Vui lòng liên hệ với quản trị viên." });
        }
        
        // So sánh mật khẩu người dùng với mật khẩu đã mã hóa trong cơ sở dữ liệu
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.render('login', { errorMessage: "Mật khẩu không đúng" }); // Trả lại trang login với thông báo lỗi
        }

          // Lưu thông tin người dùng vào session
            req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email,
                 phoneNumber: user.phoneNumber, 
                 address: user.address,
                 admin: user.admin
            };
        
        // Kiểm tra xem có phải admin không
        if (user.admin) {
            // Nếu là admin, chuyển hướng đến trang dashboard
            return res.redirect('/admin/dashboard');
        } else {
            // Nếu không phải admin, chuyển hướng đến trang home
            return res.redirect('/');
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
}
// Route xử lý đăng xuất
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Đăng xuất không thành công" });
            }
            res.redirect('/v1/auth/login'); // Chuyển hướng về trang đăng nhập
        });
    }
//ham kiem tra ngươi dung dang nhap chua
   async checkLoginStatus(req, res) {
    try {
        if (req.session && req.session.user) {
            res.json({
                loggedIn: true,
                user: {
                    username: req.session.user.username,
                    email: req.session.user.email,
                    phoneNumber: req.session.user.phoneNumber,  
                    address: req.session.user.address           
                },
            });
        } else {
            res.json({ loggedIn: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
}
   


}

module.exports = new AuthController();


