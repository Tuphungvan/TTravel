const mongoose = require('mongoose');
const Gallery = require('./src/app/models/Gallery'); // Đảm bảo đường dẫn đúng với nơi bạn lưu model Gallery
const { connect } = require('./src/config/db'); // Import hàm kết nối DB

// Kết nối MongoDB
connect();

// Các URL bừa
const mediaUrls = [
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151517362443.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151527430384.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151530060419.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151532278358.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151533216530.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151534332020.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151535196715.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151536072060.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151537132191.jpg',
    'https://cdn.tgdd.vn/Files/2021/11/15/1398115/10-hon-dao-o-viet-nam-dep-me-hon-ma-bat-cu-du-khach-nao-cung-muon-ghe-tham-202111151538078567.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021237484992.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021238248677.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021239020121.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021239320533.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021241002458.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021241413378.jpg',

    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021242045466.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021242263205.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021242511893.jpg',
    'https://cdn.tgdd.vn/Files/2022/07/02/1444077/10-bai-bien-dep-nhat-viet-nam-ban-nen-den-thu-mot-lan-202207021243161348.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn1.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-1.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn2.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-2.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn3.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-3.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn4.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-4.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn5.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-5.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn6.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-6.jpg',
    'https://bizweb.dktcdn.net/100/006/093/files/den-tran-nam-dinh-6.jpg?v=1706322521071',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-7.jpg',
    'https://tripmap.vn/wp-content/uploads/2023/08/chua-pho-minh-chua-thap-169130694589-jpeg-webp-webp.webp',
    'https://file3.qdnd.vn/data/images/0/2024/05/13/upload_2073/lehoigiong1.jpg?dpi=150&quality=100&w=870',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-yody-vn9.jpg',
    'https://m.yodycdn.com/blog/di-tich-lich-su-viet-nam-9.jpg',
    'https://tse1.mm.bing.net/th?id=OIP.H4cFL0sWV6t5lwE0TFqbtAHaE8&pid=Api&P=0&h=180',
    'https://tse3.mm.bing.net/th?id=OIP.zpBpOJaGchkrW-Em3WJoUQHaFS&pid=Api&P=0&h=180',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-4.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-5.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-6.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-7.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-8.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-9.jpg.webp',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-10.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-11.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-12.jpg.webp',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-13.jpg.webp',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-14.jpg.webp',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-15.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-16.jpg',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-17.jpg.webp',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-17.jpg.webp',
    'https://sinhtour.vn/wp-content/uploads/2022/09/du-lich-nui-mien-bac-18.jpg.webp',
    'https://dulichviet.net.vn/wp-content/uploads/2019/11/cao-nguyen-pleiku.jpg',
    'https://dulichviet.net.vn/wp-content/uploads/2019/11/cao-nguyen-dak-lak.jpg',
    'https://dulichviet.net.vn/wp-content/uploads/2019/11/cao-nguyen-lam-vien.jpg',
    'https://dulichviet.net.vn/wp-content/uploads/2019/11/cao-nguyen-bac-ha.jpg',
    'https://dulichviet.net.vn/wp-content/uploads/2019/11/cao-nguyen-di-linh.jpg',
    'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/11/05/du-lich-an-giang-rung-tram-tra-su-mua-nuoc-noi-2-1005.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu-1.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu11.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu-12.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu22.jpeg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu234.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-tay-ivivu.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu32.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu-9.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu-9.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu3454.jpeg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu244.jpg',
    'https://cdn3.ivivu.com/2023/10/Nh%C3%A0-tr%C6%B0ng-b%C3%A0y-v%C4%83n-ho%C3%A1-Khmer-ivivu.jpeg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu342.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu-678.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu83.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-ivivu89.jpg',
    'https://cdn3.ivivu.com/2023/10/l%C3%A0ng-chi%E1%BA%BFu-%C4%90%E1%BB%8Bnh-Y%C3%AAn-ivivu1.jpg',
    'https://cdn3.ivivu.com/2023/10/du-l%E1%BB%8Bch-mi%E1%BB%81n-t%C3%A2y-980.jpg',
    'https://cdn3.ivivu.com/2023/10/ch%C3%B9a-X%C3%A0-X%C3%ADa-ivivu.jpg',
    'https://cdn3.ivivu.com/2023/10/Ch%C3%B9a-Xi%C3%AAm-C%C3%A1n-%E2%80%93-B%E1%BA%A1c-Li%C3%AAu-ivivu.jpg'
]
const caption = [
    'Đảo Phú Quốc', 'Đảo Côn Sơn', 'Đảo Cô Tô', 'Đảo Nam Du', 'Đảo Cù Lao Chàm', 'Đảo Cát Bà', 'Đảo Lý Sơn', 'Đảo Bình Ba', 'Đảo Diệp Sơn', 'Đảo Phú Quý', 'Bãi Sao', 'Biển Mũi Né', 'Biển Nha Trang', 'Biển Mỹ Khê', 'Biển Cửa Đại', 'Biển Hồ Cốc', 'Biển Côn Đảo', 'Vịnh Hạ Long', 'Biển Dốc Lết', 'Bãi Kỳ Co', 'Đền Hùng', 'Hồ Gươm', 'Cố Đô Hoa Lư', 'Cổ Loa', 'Điện Biên Phủ', 'Đền Đồng Nhân', 'Văn Miếu Quốc Tử Giám', 'Cố Dô Huế', 'Thành nhà Hồ', 'Đền Ngọc Sơn', 'Dinh Độc Lập', 'Thiền Viện Trúc Lâm Yên Tử', 'Đền Trần', 'Chiến Khu Tân Trào', 'Chùa Phổ Minh', 'Đền Phù Đổng', 'Lăng Chủ Tịch Hồ Chí Minh', 'Khu Di tích Kim Liên', 'Chùa Thầy', 'Văn Miếu Trấn Biên', 'Sapa', 'Cao Nguyên Đồng Văn', 'Hoàng Su Phì', 'Mộc Châu', 'Mù Cang Chải', 'Mai Châu', 'Hồ Ba Bể', 'Thác Bản Giốc', 'Thung Nai', 'Y Tý', 'Tà Xùa', 'Điện Biên', 'Động Ngườm Ngao', 'Na Hang', 'Núi yên tử', 'Cao Nguyên Pleiku', 'Cao Nguyên DakLak', 'Cao Nguyên Lâm Viên', 'Cao Nguyên Bắc Hà', 'Cao Nguyên Di Linh',
    'Rùng Tràm Trà sư', 'Cánh đồng điện gió', 'Làng nổi Tân Lập', 'Vườn Quốc Gia Tràn Chim', 'Trại Rắn Đồng Tâm', 'Chợ Nổi Cái Răng', 'Chùa Dơi', 'Đảo Phú Quốc', 'Rùng Ngập Mặn', 'Cù Lao Thới Sương', 'Làng Hoa Sa Đéc', 'Nhà trung bày văn hoá Khmer', 'Ao Bà Om', 'Mộ cụ Nguyễn Đinh Chiểu', 'Nhà cố Bình Thuỷ', 'Khu Du lịch Mũi Cà Mau', 'Làng Chiếu Định Yên', 'Chùa Đất sét', 'Thành phố Hà Tiên', 'chùa Xiêm Cán']

// Các danh mục
const categories = ['Biển đảo', 'Thiên nhiên', 'Văn hóa, lịch sử', 'Miền núi, cao nguyên', 'Miền Tây'];

// Tạo các mục gallery
const generateGalleryItems = async () => {
    try {
        const imagesPerCategory = Math.floor(mediaUrls.length / categories.length); // Số ảnh mỗi danh mục sẽ nhận

        let mediaIndex = 0;  // Biến này dùng để theo dõi vị trí ảnh trong mediaUrls
        let captionIndex = 0;  // Biến này dùng để theo dõi vị trí trong caption

        // Lặp qua các danh mục
        for (const category of categories) {
            // Lặp số ảnh mà mỗi danh mục sẽ có
            for (let i = 0; i < imagesPerCategory; i++) {
                // Nếu hết ảnh hoặc hết chú thích thì báo lỗi
                if (mediaIndex >= mediaUrls.length || captionIndex >= caption.length) {
                    throw new Error('Không đủ ảnh hoặc chú thích để gán cho các danh mục!');
                }

                const newGalleryItem = new Gallery({
                    mediaUrl: mediaUrls[mediaIndex],  // Sử dụng URL từ mảng mediaUrls
                    type: 'image',  // Giả sử tất cả là ảnh
                    category: category,  // Gán danh mục
                    caption: caption[captionIndex],  // Gán chú thích từ mảng caption
                });

                // Lưu vào cơ sở dữ liệu
                await newGalleryItem.save();
                console.log(`Đã tạo mục gallery ${category} - ${i + 1}`);

                mediaIndex++;  // Tăng chỉ số ảnh sau mỗi lần lưu
                captionIndex++;  // Tăng chỉ số chú thích sau mỗi lần lưu
            }
        }

        console.log('Đã tạo xong tất cả gallery items.');
    } catch (error) {
        console.error('Có lỗi xảy ra khi tạo gallery items:', error);
    }
};

generateGalleryItems();