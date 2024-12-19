const Gallery = require('../models/Gallery');

class GalleryController {

    // Lấy các mục gallery theo category cho user
    getGalleryItemsByCategoryUser(req, res) {
        const { category } = req.params; // Lấy category từ URL

        Gallery.find({ category })
            .then(galleryItems => {
                if (galleryItems.length === 0) {
                    return res.render('users/gallery-detail', {
                        message: 'Không tìm thấy bộ sưu tập cho thể loại này', galleryItems: [],
                        category
                    });
                }
                res.render('users/gallery-detail', { galleryItems, category }); // Trả về các mục gallery theo category
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi lấy bộ sưu tập', error });
            });
    }


    // Lấy tất cả các mục gallery (không phân loại)
    getAllGalleryItems(req, res) {
        Gallery.find()
            .then(galleryItems => {
                if (galleryItems.length === 0) {
                    return res.render('admin/gallery', { message: 'Không có mục gallery nào' });
                }
                res.render('admin/gallery', { galleryItems });
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi lấy danh sách bộ sưu tập', error });
            });
    }

    getAddGallery(req, res) {
        res.render('admin/addGallery');
    }
    // Thêm một mục vào gallery
    addGalleryItem(req, res) {
        const { mediaUrl, type, category, caption } = req.body;

        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!mediaUrl || !type || !category || !caption) {
            return res.render('admin/addGallery', {
                message: 'Vui lòng điền đầy đủ thông tin mục gallery.'
            });
        }

        const newGalleryItem = new Gallery({
            mediaUrl,
            type,
            category,
            caption,
        });

        newGalleryItem.save()
            .then(galleryItem => {
                res.redirect('/admin/gallery');
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi thêm mục vào bộ sưu tập', error });
            });
    }

    getUpdateGalleryItem(req, res) {
        const { id } = req.params;
        Gallery.findById(id)
            .then(galleryItem => {
                if (!galleryItem) {
                    return res.status(404).send({ message: 'Không tìm thấy mục gallery với ID này.' });
                }
                res.render('admin/updateGallery', { galleryItem });
            })
            .catch(error => {
                res.status(500).send({ message: 'Có lỗi khi lấy dữ liệu mục gallery', error });
            });
    }
    // Sửa một mục trong gallery
    updateGalleryItem(req, res) {
        const { id } = req.params;
        const { mediaUrl, type, category, caption } = req.body;
        console.log(req.body);
        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!mediaUrl || !type || !category || !caption) {
            return res.render('admin/updateGallery', {
                message: 'Vui lòng điền đầy đủ thông tin mục gallery.',
                galleryItem: { mediaUrl, type, category, caption } // Truyền lại dữ liệu đã nhập
            });
        }

        // Tìm và cập nhật mục gallery theo ID
        Gallery.findByIdAndUpdate(id, { mediaUrl, type, category, caption }, { new: true })
            .then(updatedItem => {
                if (!updatedItem) {
                    // Nếu không tìm thấy mục gallery theo ID, thông báo lỗi và giữ lại dữ liệu đã nhập
                    return res.render('admin/updateGallery', {
                        message: 'Không tìm thấy mục trong bộ sưu tập.',
                        galleryItem: { mediaUrl, type, category, caption } // Trả lại thông tin đã nhập
                    });
                }
                // Redirect về danh sách gallery sau khi sửa thành công
                res.redirect('/admin/gallery');
            })
            .catch(error => {
                // Xử lý lỗi khi có lỗi trong quá trình cập nhật
                res.status(500).send({
                    message: 'Có lỗi khi cập nhật mục trong bộ sưu tập',
                    error
                });
            });
    }

    // Xóa một mục trong gallery
    deleteGalleryItem(req, res) {
        console.log(`Xóa item với ID: ${req.params.id}`);
        const { id } = req.params;

        Gallery.findByIdAndDelete(id)
            .then(deletedItem => {
                if (!deletedItem) {
                    return res.status(404).render('admin/gallery', {
                        message: 'Không tìm thấy mục trong bộ sưu tập để xóa'
                    });
                }
                console.log('Xóa thành công');
                res.redirect('/admin/gallery'); // Redirect về danh sách gallery sau khi xóa
            })
            .catch(error => {
                console.error('Lỗi khi xóa mục:', error);
                res.status(500).send({ message: 'Có lỗi khi xóa mục trong bộ sưu tập', error });
            });
    }
}

module.exports = new GalleryController();
