const Order = require('../models/Order');
const History = require('../models/History');
const Tour = require('../models/Tour');
const RevenueReport = require('../models/RevenueReport');
const cron = require('node-cron');
class ManagerOrderController {

    // 1. Lấy danh sách đơn hàng "Chờ thanh toán"
    async getOrdersPendingPayment(req, res) {
        try {
            const orders = await Order.find({ status: 'Chờ thanh toán' });
            res.render('admin/pending-payment', { orders });
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi lấy danh sách đơn hàng chờ thanh toán.');
        }
    }

    // 2.1 Xóa các đơn hàng "Chờ thanh toán" quá 24 giờ
    async deleteExpiredOrders() {
        try {
            const currentTime = new Date();
            const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000);

            const result = await Order.deleteMany({
                status: 'Chờ thanh toán',
                createdAt: { $lte: twentyFourHoursAgo },
            });

            console.log(`Đã xóa ${result.deletedCount} đơn hàng "Chờ thanh toán" quá 24 giờ.`);
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng hết hạn:', error);
        }
    }

    // 2.2 Xóa đơn hàng chưa thanh toán
    async deletePendingOrder(req, res) {
        const { orderId } = req.params;
        try {
            await Order.findByIdAndDelete(orderId);
            res.redirect('/admin/manager-order/pending-payment');
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi xóa đơn hàng chưa thanh toán.');
        }
    }


    // 3. Lấy danh sách đơn hàng "Đã thanh toán và chờ xác nhận"
    async getOrdersToConfirm(req, res) {
        try {
            const orders = await Order.find({ status: 'Đã thanh toán và chờ xác nhận' });
            res.render('admin/to-confirm', { orders });
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi lấy danh sách đơn hàng chờ xác nhận.');
        }
    }


    // 4. Xác nhận đơn hàng và chuyển sang trạng thái "Hoàn tất"
    async confirmOrder(req, res) {
        const { orderId } = req.params;
        try {
            const order = await Order.findById(orderId);

            // Kiểm tra trạng thái của đơn hàng
            if (order.status !== 'Đã thanh toán và chờ xác nhận') {
                return res.status(400).send('Đơn hàng không hợp lệ để xác nhận');
            }

            // Lấy thông tin tour từ đơn hàng
            const tour = await Tour.findOne({ slug: order.items[0].slug });
            if (!tour) {
                return res.status(404).send('Không tìm thấy tour tương ứng.');
            }

            // Cập nhật trạng thái của đơn hàng thành "Hoàn tất"
            order.status = 'Hoàn tất';
            await order.save(); // Lưu lại trạng thái mới

            res.redirect('/admin/manager-order/to-confirm');
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi xác nhận đơn hàng');
        }
    }


    // 5. Di chuyển đơn hàng đã hết hạn vào lịch sử
    async moveOrderToHistory(orderId) {
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return { message: 'Không tìm thấy đơn hàng.' };
            }

            // Lấy thông tin tour từ đơn hàng
            const tour = await Tour.findOne({ slug: order.items[0].slug });

            if (!tour) {
                return { message: 'Không tìm thấy tour tương ứng.' };
            }

            // Kiểm tra nếu tour đã kết thúc
            if (new Date() >= new Date(tour.endDate)) {
                // Tạo bản ghi trong lịch sử đơn hàng
                const historyItems = order.items.map(item => ({
                    name: item.name,      // Lấy tên tour từ item
                    price: item.price,    // Lấy giá tour từ item
                    image: item.image,    // Lấy hình ảnh tour từ item
                }));
                const history = new History({
                    userId: order.userId,
                    orderId: order._id,
                    completedAt: new Date(),
                    endDate: tour.endDate,
                    items: historyItems, 
                });

                // Lưu vào OrderHistory
                await history.save();

                // Tính toán doanh thu từ đơn hàng và cập nhật vào RevenueReport
                const completedAt = history.completedAt;
                const month = completedAt.getMonth() + 1; // Tháng (1 - 12)
                const year = completedAt.getFullYear();  // Năm

                const revenueKey = `${month}-${year}`;

                // Cập nhật doanh thu cho tháng, năm
                let revenueReport = await RevenueReport.findOne({ month, year });

                if (!revenueReport) {
                    revenueReport = new RevenueReport({
                        month,
                        year,
                        totalRevenue: 0,
                        totalOrders: 0
                    });
                }

                // Cộng doanh thu từ các item vào tổng doanh thu
                order.items.forEach(item => {
                    revenueReport.totalRevenue += item.price;
                });

                revenueReport.totalOrders += 1;

                // Lưu lại báo cáo doanh thu
                await revenueReport.save();

                // Xóa đơn hàng khỏi hệ thống sau khi đã chuyển vào lịch sử
                await Order.findByIdAndDelete(order._id); // Xóa đơn hàng

                return { message: 'Đơn hàng đã được chuyển vào lịch sử và trạng thái đã cập nhật.' };
            } else {
                return { message: 'Tour chưa kết thúc, không thể chuyển đơn hàng vào lịch sử.' };
            }
        } catch (error) {
            console.error('Lỗi khi chuyển đơn hàng vào lịch sử:', error);
            return { message: 'Có lỗi xảy ra trong quá trình chuyển đơn hàng vào lịch sử.' };
        }
    }
    // 6. Lấy danh sách các đơn hàng "Hoàn tất"
    async getOrdersCompleted(req, res) {
        try {
            // Lấy danh sách đơn hàng có trạng thái "Hoàn tất"
            const orders = await Order.find({ status: 'Hoàn tất' });

            // Hiển thị danh sách các đơn hàng trong trang admin/completed.hbs
            res.render('admin/completed', { orders });
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi lấy danh sách đơn hàng.');
        }
    }
    // 7. Admin xác nhận đơn hàng đã kết thúc
    async confirmExpiredOrder(req, res) {
        const { orderId } = req.params;
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).send('Không tìm thấy đơn hàng.');
            }

            // Lấy thông tin tour từ đơn hàng
            const tour = await Tour.findOne({ slug: order.items[0].slug });

            if (!tour) {
                return res.status(404).send('Không tìm thấy tour tương ứng.');
            }

            // Tạo bản ghi trong lịch sử đơn hàng
            const historyItems = order.items.map(item => ({
                name: item.name,      // Tên tour
                price: item.price,    // Giá tour
                image: item.image,    // Hình ảnh tour
            })); 
            
            const history = new History({
                userId: order.userId,
                orderId: order._id,
                completedAt: new Date(),  // Đánh dấu thời gian hoàn tất
                endDate: tour.endDate,
                items: historyItems, 
            });

            await history.save();

            // Cập nhật doanh thu từ đơn hàng vào báo cáo doanh thu
            const completedAt = history.completedAt;
            const month = completedAt.getMonth() + 1;  // Tháng (1 - 12)
            const year = completedAt.getFullYear();   // Năm

            const revenueKey = `${month}-${year}`;

            let revenueReport = await RevenueReport.findOne({ month, year });

            if (!revenueReport) {
                revenueReport = new RevenueReport({
                    month,
                    year,
                    totalRevenue: 0,
                    totalOrders: 0
                });
            }

            // Cộng doanh thu từ các item vào tổng doanh thu
            order.items.forEach(item => {
                revenueReport.totalRevenue += item.price;
            });

            revenueReport.totalOrders += 1;

            // Lưu lại báo cáo doanh thu
            await revenueReport.save();

            // Xóa đơn hàng khỏi collection Order
            await Order.findByIdAndDelete(orderId);

            res.redirect('/admin/manager-order/completed'); // Quay lại trang quản lý đơn hàng hoàn tất
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi xác nhận hết hạn.');
        }
    }


    // 10. Lấy báo cáo doanh thu từ RevenueReport
    async getRevenueReport(req, res) {
        try {
            // Lấy tất cả các báo cáo doanh thu từ RevenueReport
            const revenueReports = await RevenueReport.find().sort({ year: -1, month: -1 });
            console.log(revenueReports);
            // Kiểm tra xem có báo cáo doanh thu hay không
            if (!revenueReports.length) {
                return res.status(404).send('Không có báo cáo doanh thu nào.');
            }

            res.render('admin/revenue-report', { revenueReports });
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi lấy báo cáo doanh thu.');
        }
    }

}

module.exports = new ManagerOrderController();
