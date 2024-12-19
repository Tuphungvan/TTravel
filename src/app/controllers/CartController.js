const Cart = require('../models/Cart');  // Thêm Cart model
const Tour = require('../models/Tour');  // Thêm Tour model để lấy thông tin tour

class CartController {
    // Thêm tour vào giỏ hàng
    async addToCart(req, res) {
        try {
            const { slug } = req.params;

            // Tìm tour theo slug
            const tour = await Tour.findOne({ slug });
            if (!tour) {
                return res.status(404).render('errors/404', { message: 'Tour không tồn tại' });
            }

            // Lấy giỏ hàng từ cơ sở dữ liệu hoặc tạo mới
            let cart = await Cart.findOne({ userId: req.session.user.id }); // Sử dụng `id` thay vì `_id`
            if (!cart) {
                cart = new Cart({ userId: req.session.user.id, items: [] }); // Sử dụng `id`
            }

            // Kiểm tra xem tour đã có trong giỏ hàng chưa
            const existingItem = cart.items.find(item => item.slug === slug);
            if (existingItem) {
                return res.json({ success: true, message: 'Tour đã có trong giỏ hàng' });
            }

            // Thêm tour vào giỏ hàng
            cart.items.push({
                slug: tour.slug,
                name: tour.name,
                price: tour.price,
                image: tour.image,
            });

            await cart.save(); // Lưu giỏ hàng
            res.json({ success: true, message: 'Tour đã được thêm vào giỏ hàng', cart });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm vào giỏ hàng", error: err.message });
        }
    }

    // Xem giỏ hàng của người dùng
    async viewCart(req, res) {
        if (!req.session.user) {  // Kiểm tra đăng nhập
            return res.status(401).json({ message: "Vui lòng đăng nhập để xem giỏ hàng" });
        }

        try {
            // Lấy giỏ hàng từ cơ sở dữ liệu
            const cart = await Cart.findOne({ userId: req.session.user.id }).populate('items.slug');
            // Kiểm tra nếu cart hoặc cart.items không tồn tại
            if (!cart || !cart.items) {
                return res.render('users/cart', { cart: { items: [] }, total: 0 });
            }
            // Tính tổng tiền giỏ hàng
            const total = cart.items.reduce((sum, item) => sum + (item.price || 0), 0);

            // Render giỏ hàng
            res.render('users/cart', { cart, total });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ message: "Đã xảy ra lỗi khi hiển thị giỏ hàng", error: err.message });
        }
    }

    // Xóa tour khỏi giỏ hàng
    async removeFromCart(req, res) {
        const { slug } = req.params;
        try {
            const cart = await Cart.findOne({ userId: req.session.user.id });
            if (!cart) {
                return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
            }

            // Tìm và xóa tour khỏi giỏ hàng
            cart.items = cart.items.filter(item => item.slug !== slug);
            await cart.save();
            res.json({ success: true, message: 'Tour đã được xóa khỏi giỏ hàng', cart });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ message: "Đã xảy ra lỗi khi xóa tour khỏi giỏ hàng", error: err.message });
        }
    }
    //lay so luong tour
    async cartItemCount(req, res) {
        try {
            const cart = await Cart.findOne({ userId: req.session.user.id });
            const totalCount = cart ? cart.items.length : 0;

            res.json({ success: true, count: totalCount });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi lấy số lượng giỏ hàng", error: err.message });
        }
    }
}

module.exports = new CartController();
