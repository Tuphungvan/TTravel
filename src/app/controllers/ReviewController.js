// controllers/ReviewController.js
const Review = require('../models/Review');

class ReviewController {
    // Lấy tất cả các review
    getAllReviews(req, res) {
        Review.find()
            .then(reviews => {
                if (reviews.length === 0) {
                    return res.render('admin/review', { message: 'Không có đánh giá nào' });
                }
                res.render('admin/review', { reviews });
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi lấy danh sách đánh giá', error });
            });
    }

    // Thêm một review mới
    getAddReview(req, res) {
        res.render('admin/add-review');
    }

    addReview(req, res) {
        const { image, name, review } = req.body;

        if (!image || !name || !review) {
            return res.render('admin/add-review', { message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        const newReview = new Review({ image, name, review });

        newReview.save()
            .then(() => {
                res.redirect('/admin/review'); // Redirect đến danh sách reviews
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi thêm review', error });
            });
    }

    // Xóa review
    deleteReview(req, res) {
        const { id } = req.params;

        Review.findByIdAndDelete(id)
            .then(deletedReview => {
                if (!deletedReview) {
                    return res.status(404).send({ message: 'Không tìm thấy review để xóa' });
                }
                res.redirect('/admin/review');
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi xóa review', error });
            });
    }

    // Lấy các review cho người dùng (trang chủ)
    getReviewsJson(req, res) {
        Review.find()
            .then(reviews => {
                res.json(reviews);  // Trả về dữ liệu review dưới dạng JSON
            })
            .catch(error => {
                console.error('Có lỗi khi lấy review:', error);
                res.status(500).send({ message: 'Lỗi khi lấy dữ liệu' });
            });
    }

}

module.exports = new ReviewController();
