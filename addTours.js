const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Tour = require('./src/app/models/Tour');  // Import model Tour
const { connect } = require('./src/config/db'); // Import hàm kết nối DB

// Kết nối MongoDB
connect();
// Danh sách tên tour cố định
const tourNames = [
    "Hà Nội 2 ngày 1 đêm",
    "Sapa 3 ngày 2 đêm",
    "Nha Trang 4 ngày 3 đêm",
    "Đà Nẵng 3 ngày 2 đêm",
    "Phú Quốc 4 ngày 3 đêm",
    "Huế 2 ngày 1 đêm",
    "Cát Bà 3 ngày 2 đêm",
    "Mũi Né 3 ngày 2 đêm",
    "Bình Ba 2 ngày 1 đêm",
    "Hạ Long 1 ngày",
    "Ninh Bình 2 ngày 1 đêm",
    "Quảng Bình 3 ngày 2 đêm",
    "Tây Nguyên 4 ngày 3 đêm",
    "Phú Yên 3 ngày 2 đêm",
    "Cần Thơ 3 ngày 2 đêm",
    "Hà Giang 4 ngày 3 đêm",
    "Quảng Ninh 2 ngày 1 đêm",
    "Vũng Tàu 2 ngày 1 đêm",
    "Quy Nhơn 3 ngày 2 đêm",
    "Cao Bằng 3 ngày 2 đêm",
    "Phong Nha 2 ngày 1 đêm",
    "Côn Đảo 4 ngày 3 đêm",
    "Vinh 3 ngày 2 đêm",
    "Thanh Hóa 2 ngày 1 đêm",
    "Sơn La 3 ngày 2 đêm",
    "Bắc Giang 3 ngày 2 đêm",
    "Quảng Nam 2 ngày 1 đêm",
    "Vân Đồn 2 ngày 1 đêm",
    "Lào Cai 4 ngày 3 đêm",
    "Ninh Thuận 3 ngày 2 đêm",
    "Bắc Ninh 1 ngày",
    "Tam Đảo 2 ngày 1 đêm",
    "Bến Tre 1 ngày",
    "Bà Nà Hills 1 ngày",
    "Long Hải 2 ngày 1 đêm",
    "Đà Lạt 3 ngày 2 đêm",
    "Vĩnh Long 2 ngày 1 đêm",
    "Sài Gòn 1 ngày",
    "Vinpearl Nha Trang 3 ngày 2 đêm",
    "Hồ Tuyền Lâm 3 ngày 2 đêm",
    "Mỹ Tho 1 ngày",
    "Châu Đốc 3 ngày 2 đêm",
    "Động Thiên Đường 2 ngày 1 đêm",
    "Đồ Sơn 2 ngày 1 đêm",
    "Bái Đính 2 ngày 1 đêm",
    "Thái Bình 1 ngày",
    "Phan Thiết 2 ngày 1 đêm",
    "Lạng Sơn 3 ngày 2 đêm",
    "Đắk Lắk 3 ngày 2 đêm",
    "Động Tam Giang 3 ngày 2 đêm",
    "Bảo Lộc 2 ngày 1 đêm",
    "Quảng Trị 3 ngày 2 đêm",
    "Mù Cang Chải 3 ngày 2 đêm",
    "Tả Lèng 3 ngày 2 đêm",
    "Côn Sơn 2 ngày 1 đêm",
    "Bình Phước 3 ngày 2 đêm",
    "Lâm Đồng 4 ngày 3 đêm",
    "Quảng Ngãi 3 ngày 2 đêm",
    "Bãi Sao 2 ngày 1 đêm",
    "Cát Tiên 3 ngày 2 đêm",
    "Cà Mau 3 ngày 2 đêm",
    "Gành Đá Đĩa 3 ngày 2 đêm",
    "Vườn Quốc Gia Pù Mát 3 ngày 2 đêm",
    "Lai Châu 4 ngày 3 đêm",
    "Tây Bắc 3 ngày 2 đêm",
    "Pù Luông 3 ngày 2 đêm",
    "Củ Chi Tunnels 1 ngày",
    "Lạch Tray 2 ngày 1 đêm",
    "Bản Áng 3 ngày 2 đêm",
    "Cầu Đất Farm 2 ngày 1 đêm",
    "Hồ Núi Cốc 2 ngày 1 đêm",
    "Mộc Châu 2 ngày 1 đêm",
    "Ba Na 3 ngày 2 đêm",
    "Vườn Quốc Gia Cát Tiên 3 ngày 2 đêm",
    "Cảng Sa Kỳ 1 ngày",
    "Phú Quốc 3 ngày 2 đêm",
    "Vinpearl Phú Quốc 3 ngày 2 đêm",
    "Vạn Chài 2 ngày 1 đêm",
    "Thác Pongour 1 ngày",
    "Cáp Treo Bà Nà 2 ngày 1 đêm",
    "Đà Nẵng – Hội An 3 ngày 2 đêm",
    "Huế – Cố đô 2 ngày 1 đêm",
    "Mũi Né – Phan Thiết 3 ngày 2 đêm",
];

const tourPrices = [
    "2500000", // Hà Nội 2 ngày 1 đêm
    "3800000", // Sapa 3 ngày 2 đêm
    "6500000", // Nha Trang 4 ngày 3 đêm
    "4800000", // Đà Nẵng 3 ngày 2 đêm
    "7500000", // Phú Quốc 4 ngày 3 đêm
    "2400000", // Huế 2 ngày 1 đêm
    "3200000", // Cát Bà 3 ngày 2 đêm
    "3500000", // Mũi Né 3 ngày 2 đêm
    "2200000", // Bình Ba 2 ngày 1 đêm
    "1200000", // Hạ Long 1 ngày
    "2300000", // Ninh Bình 2 ngày 1 đêm
    "3800000", // Quảng Bình 3 ngày 2 đêm
    "6000000", // Tây Nguyên 4 ngày 3 đêm
    "3500000", // Phú Yên 3 ngày 2 đêm
    "3200000", // Cần Thơ 3 ngày 2 đêm
    "6200000", // Hà Giang 4 ngày 3 đêm
    "2600000", // Quảng Ninh 2 ngày 1 đêm
    "2800000", // Vũng Tàu 2 ngày 1 đêm
    "3600000", // Quy Nhơn 3 ngày 2 đêm
    "3500000", // Cao Bằng 3 ngày 2 đêm
    "2500000", // Phong Nha 2 ngày 1 đêm
    "7200000", // Côn Đảo 4 ngày 3 đêm
    "3200000", // Vinh 3 ngày 2 đêm
    "2400000", // Thanh Hóa 2 ngày 1 đêm
    "3800000", // Sơn La 3 ngày 2 đêm
    "3600000", // Bắc Giang 3 ngày 2 đêm
    "2400000", // Quảng Nam 2 ngày 1 đêm
    "2300000", // Vân Đồn 2 ngày 1 đêm
    "6200000", // Lào Cai 4 ngày 3 đêm
    "3500000", // Ninh Thuận 3 ngày 2 đêm
    "1000000", // Bắc Ninh 1 ngày
    "2400000", // Tam Đảo 2 ngày 1 đêm
    "1200000", // Bến Tre 1 ngày
    "1500000", // Bà Nà Hills 1 ngày
    "2500000", // Long Hải 2 ngày 1 đêm
    "4200000", // Đà Lạt 3 ngày 2 đêm
    "2400000", // Vĩnh Long 2 ngày 1 đêm
    "1000000", // Sài Gòn 1 ngày
    "5200000", // Vinpearl Nha Trang 3 ngày 2 đêm
    "4000000", // Hồ Tuyền Lâm 3 ngày 2 đêm
    "1200000", // Mỹ Tho 1 ngày
    "3600000", // Châu Đốc 3 ngày 2 đêm
    "2300000", // Động Thiên Đường 2 ngày 1 đêm
    "2300000", // Đồ Sơn 2 ngày 1 đêm
    "2400000", // Bái Đính 2 ngày 1 đêm
    "1000000", // Thái Bình 1 ngày
    "2400000", // Phan Thiết 2 ngày 1 đêm
    "3500000", // Lạng Sơn 3 ngày 2 đêm
    "3600000", // Đắk Lắk 3 ngày 2 đêm
    "3600000", // Động Tam Giang 3 ngày 2 đêm
    "2400000", // Bảo Lộc 2 ngày 1 đêm
    "3600000", // Quảng Trị 3 ngày 2 đêm
    "3600000", // Mù Cang Chải 3 ngày 2 đêm
    "3600000", // Tả Lèng 3 ngày 2 đêm
    "2400000", // Côn Sơn 2 ngày 1 đêm
    "3500000", // Bình Phước 3 ngày 2 đêm
    "6000000", // Lâm Đồng 4 ngày 3 đêm
    "3500000", // Quảng Ngãi 3 ngày 2 đêm
    "2200000", // Bãi Sao 2 ngày 1 đêm
    "3600000", // Cát Tiên 3 ngày 2 đêm
    "3600000", // Cà Mau 3 ngày 2 đêm
    "3500000", // Gành Đá Đĩa 3 ngày 2 đêm
    "3600000", // Vườn Quốc Gia Pù Mát 3 ngày 2 đêm
    "6200000", // Lai Châu 4 ngày 3 đêm
    "3600000", // Tây Bắc 3 ngày 2 đêm
    "3600000", // Pù Luông 3 ngày 2 đêm
    "1000000", // Củ Chi Tunnels 1 ngày
    "2400000", // Lạch Tray 2 ngày 1 đêm
    "3500000", // Bản Áng 3 ngày 2 đêm
    "2400000", // Cầu Đất Farm 2 ngày 1 đêm
    "2400000", // Hồ Núi Cốc 2 ngày 1 đêm
    "2400000", // Mộc Châu 2 ngày 1 đêm
    "3500000", // Ba Na 3 ngày 2 đêm
    "3600000", // Vườn Quốc Gia Cát Tiên 3 ngày 2 đêm
    "1000000", // Cảng Sa Kỳ 1 ngày
    "6000000", // Phú Quốc 3 ngày 2 đêm
    "7500000", // Vinpearl Phú Quốc 3 ngày 2 đêm
    "2400000", // Vạn Chài 2 ngày 1 đêm
    "1000000", // Thác Pongour 1 ngày
    "2300000", // Cáp Treo Bà Nà 2 ngày 1 đêm
    "4800000", // Đà Nẵng – Hội An 3 ngày 2 đêm
    "2400000", // Huế – Cố đô 2 ngày 1 đêm
    "3500000"  // Mũi Né – Phan Thiết 3 ngày 2 đêm
];

const fakeYouTubeLinks = [
    "FClS4ni4zfo",
    "2_86KFKD1wE",
    "wiXL60wHv9U",
    "PzC4_zNcSSM",
    "__5mr_Xtb30",
    "H9jnHww5fEs",
    "RW399aWprpA",
    "XMWxvKWst3o",
    "aFyEqdFvdLg",
    "vt9OL_sJ5gA",
    "JKpHPKY0_Vw",
    "ABGZj11HsPU",
    "G_Lo50efCFc",
    "praSuRn1Eog",
    "ffgtLwwRSwM",
    "XzEBYQpJaZI",
    "hqzs0IUGZzA",
    "bB_mm7cI-6k",
    "CPIcHYPhL9M",
    "9hhu0Jspays",
    "KNlB_Ps8voc",
    "Gmvd6D0x8QU",
    "OUf-GhCkQMg",
    "dhjfdZoKMs8",
    "93YTjPu9v6c",
    "XA7oCKayWuc",
    "JmqtbFAtSHY",
    "AQ8X8mpJO7E",
    "-AREhw2Ot3o",
    "pbDeLxxrnOs",
    "VfkQ4jMt5QU",
    "GAeBmeYnOIQ",
    "AELdXndq0Ao",
     "Ggq5UVbKlPE",
    "wBoc3KTSiq0",
    "MQKGiewMGi0",
    "I9x-LqccIa0",
     "X4MxLi96fZ0",
    "XefN1YQZQ4I", 
     "7egWe_NUt9M",
     "3-URUlnAjV0", 
   "cUnqJNrOiHg",
     "czBbA6N8nFc",
    "bt_7UKYgBcs", 
     "vcHobtIGoro",
    "XFyyJdvKmUI",
    "xAH9vuxeOUQ",
     "DLRWjJQNoIs",
     "CjmAawSGBM0",
     "1hdh55Ysqow",
    "Wbs9-RixX04",
     "gm0iCGdQ9bM",
     "ttT4YpsauVw",
     "zLflzQ9l-jI",
    "1oGmVrYg5xo",
    "dhZaAIy1-7E",
    "aI4SlPuvgsA",  
     "2uJObQOHp2w",
     "kROLFoXBdk0",
     "TQmbH4ibtMk",
     "FG3xRslqd1A",
     "GDv5fmdSr5Q",
    "xjHD5uCSl-g",
     "H-In64ci7Ss",
     "ks0mOYXeMJk",
     "Xi8o__ui8TU",
     "sVHVAfWyf1o",
    "8UPhA8mbPg8",
     "hWY9uxj-oZ4",
     "G9BzWW38BOA",
    "SQmfn8tODbE",
     "OlZLB61StwA",
    "qVlHG8BNpyg",
     "--6RNepiuzs",
     "1Movp6jqiWA",
     "CscJkiPuU-M",
     "zx2iQF_1J_0",
     "nir17WYWl5g",
     "-GtPcwzl_-c",
     "a-BVtpTi8aM",
     "LWnoKBSD-aI",
     "K1ie-Vgss-Q",
    "baJCHsIsOSo",
];
//des
const tourDescriptions = [
    "Chuyến đi trải nghiệm Hà Nội, nơi bạn có thể khám phá vẻ đẹp của thủ đô nghìn năm văn hiến, với những di tích lịch sử nổi tiếng như Văn Miếu, Hồ Gươm và những con phố cổ đầy màu sắc. Bạn cũng sẽ có cơ hội thưởng thức các món ăn đặc sản như phở, bún chả, và trà đá vỉa hè.", 
    "Sapa, nơi bạn có thể tận hưởng không khí mát mẻ của vùng núi Tây Bắc. Khám phá những bản làng người Mông, Tày, H'mông với những thửa ruộng bậc thang tuyệt đẹp và tham gia vào các hoạt động trekking, chinh phục đỉnh Fansipan – nóc nhà Đông Dương.", 
    "Nha Trang là một thiên đường biển đảo với bãi cát trắng trải dài và làn nước trong xanh. Bạn sẽ được tham quan các hòn đảo xung quanh, tắm biển, tham gia các hoạt động thể thao dưới nước và thưởng thức hải sản tươi ngon.", 
    "Đà Nẵng nổi bật với những bãi biển tuyệt đẹp, các danh lam thắng cảnh nổi tiếng như Bà Nà Hills với cáp treo dài nhất thế giới, Ngũ Hành Sơn, và phố cổ Hội An gần đó. Đây là nơi lý tưởng để thư giãn và khám phá vẻ đẹp của miền Trung Việt Nam.", 
    "Phú Quốc là một hòn đảo xinh đẹp với bãi biển hoang sơ, làn nước trong vắt, và những khu rừng nguyên sinh. Bạn có thể thư giãn trên các bãi biển nổi tiếng, tham quan các khu bảo tồn thiên nhiên và tham gia vào các hoạt động lặn biển khám phá hệ sinh thái biển.", 
    "Huế, với nền văn hóa và lịch sử phong phú, là điểm đến lý tưởng cho những ai yêu thích khám phá các di tích cổ kính. Bạn sẽ được tham quan Đại Nội, chùa Thiên Mụ, và thưởng thức những món ăn đặc sản như bún bò Huế, cơm hến.", 
    "Cát Bà là một hòn đảo xinh đẹp nằm trong vịnh Lan Hạ, nổi tiếng với cảnh quan thiên nhiên hoang sơ, các bãi biển yên bình và những khu rừng nguyên sinh. Bạn sẽ có cơ hội tham gia các chuyến du thuyền, thám hiểm hang động và đạp xe qua những con đường mòn.", 
    "Mũi Né là điểm đến lý tưởng cho những ai yêu thích biển, cát và các hoạt động thể thao dưới nước. Bạn sẽ được tham gia các hoạt động như lướt ván, lái mô tô nước và tham quan các cồn cát trắng, những vách đá đỏ, và làng chài địa phương.", 
    "Bình Ba là hòn đảo nổi tiếng với vẻ đẹp hoang sơ và những bãi biển sạch, nước trong xanh. Bạn sẽ có cơ hội tham gia các hoạt động tắm biển, lặn biển ngắm san hô và thưởng thức các món hải sản tươi ngon tại đây.", 
    "Vịnh Hạ Long là một trong những kỳ quan thiên nhiên của thế giới với hàng nghìn đảo đá vôi và cảnh sắc tuyệt đẹp. Bạn sẽ được tham gia chuyến tham quan bằng tàu, khám phá các hang động, và thưởng thức hải sản tươi ngon trên thuyền", 
    "Ninh Bình, với những danh lam thắng cảnh nổi tiếng như Tràng An, Tam Cốc, và chùa Bái Đính, là nơi lý tưởng để khám phá thiên nhiên hoang sơ và tận hưởng không gian yên bình. Bạn có thể đi thuyền trên sông, thăm các hang động và chiêm ngưỡng các dãy núi đá vôi hùng vĩ.", 
    "Quảng Bình nổi tiếng với những hang động huyền bí và bãi biển tuyệt đẹp. Bạn sẽ có cơ hội tham quan động Phong Nha, động Thiên Đường, và các địa danh thiên nhiên nổi bật khác, đồng thời thưởng thức những món ăn đặc sản vùng đất này.", 
    "Tây Nguyên là vùng đất của các dân tộc thiểu số, với những cánh rừng bạt ngàn, hồ nước xanh mát và các thác nước hùng vĩ. Bạn sẽ tham gia các chuyến thám hiểm, tìm hiểu văn hóa địa phương và thưởng thức những món ăn đặc trưng của vùng cao nguyên.", 
    "Phú Yên là nơi có cảnh biển tuyệt đẹp, với những bãi biển hoang sơ, các vịnh nhỏ và những món hải sản đặc sắc. Bạn sẽ được tham gia các hoạt động tắm biển, khám phá các đảo và thưởng thức hải sản tươi sống.", 
    "Cần Thơ, trung tâm của vùng Đồng bằng sông Cửu Long, là điểm đến nổi bật với các chợ nổi trên sông, những cánh đồng lúa bạt ngàn và các làng nghề truyền thống. Bạn sẽ được tham gia các chuyến thuyền trên sông, tham quan các vườn trái cây và tìm hiểu văn hóa miền Tây Nam Bộ.", 
    "Hà Giang, một trong những vùng đất đẹp nhất miền Bắc, là nơi lý tưởng để khám phá vẻ đẹp hùng vĩ của núi non, các thửa ruộng bậc thang và các bản làng của người dân tộc. Bạn sẽ có cơ hội tham gia vào các chuyến trekking và khám phá những cung đường đèo nổi tiếng.", 
    "Quảng Ninh nổi tiếng với Vịnh Hạ Long và những bãi biển tuyệt đẹp. Ngoài ra, bạn cũng có thể tham quan các địa danh nổi bật khác như Yên Tử, đảo Cô Tô và các khu nghỉ dưỡng cao cấp, cùng những món ăn đặc sản của vùng biển.", 
    "Vũng Tàu là một trong những điểm du lịch biển nổi bật ở miền Nam. Bạn sẽ được tận hưởng không khí biển trong lành, tham gia các hoạt động thể thao dưới nước và thưởng thức hải sản tươi ngon, đồng thời khám phá các danh lam thắng cảnh như Tượng Chúa Ki-tô, Ngọn Hải Đăng.", 
    "Quy Nhơn là một thành phố biển thơ mộng với những bãi cát trắng và làn nước trong xanh. Bạn sẽ được tham gia các hoạt động lặn biển, khám phá các đảo và thưởng thức các món ăn đặc sản của vùng biển này.", 
    "Cao Bằng nổi tiếng với các thác nước tuyệt đẹp như Thác Bản Giốc và các khu vực đồi núi hùng vĩ. Bạn sẽ được tham gia các chuyến thăm các làng bản và khám phá vẻ đẹp hoang sơ của thiên nhiên.", 
    "Phong Nha, nơi nổi tiếng với hệ thống hang động kỳ vĩ, đặc biệt là động Phong Nha và động Thiên Đường, là điểm đến lý tưởng cho những ai yêu thích khám phá thiên nhiên. Bạn sẽ được tham gia các chuyến thám hiểm hang động, thưởng ngoạn phong cảnh hùng vĩ và tìm hiểu hệ sinh thái độc đáo của khu vực này.", 
    "Côn Đảo, hòn đảo nổi tiếng với vẻ đẹp hoang sơ và lịch sử bi tráng, là nơi lý tưởng để thư giãn và khám phá. Bạn sẽ được tham quan các bãi biển yên bình, thăm di tích lịch sử Côn Đảo và khám phá các khu bảo tồn thiên nhiên độc đáo, đồng thời tận hưởng không gian yên tĩnh, thư giãn.", 
    "Vinh là thành phố lịch sử của miền Trung, nơi bạn có thể tham quan các di tích như quê hương Chủ tịch Hồ Chí Minh, các ngôi chùa cổ và những danh lam thắng cảnh như biển Cửa Lò, rừng quốc gia Pù Mát, nơi bạn có thể thư giãn và khám phá vẻ đẹp tự nhiên.", 
    "Thanh Hóa, với những bãi biển đẹp như Sầm Sơn và các di tích lịch sử quan trọng, là điểm đến lý tưởng cho những ai muốn kết hợp nghỉ dưỡng và khám phá. Bạn có thể tham quan các đền, chùa, và thư giãn trên các bãi biển trong xanh, thưởng thức các món ăn đặc sản nổi tiếng.", 
    "Sơn La, với khí hậu mát mẻ và thiên nhiên tươi đẹp, là điểm đến lý tưởng để khám phá các bản làng dân tộc, các thửa ruộng bậc thang và những khu vực rừng nguyên sinh. Bạn sẽ có cơ hội tham gia các chuyến trekking, tìm hiểu văn hóa của các dân tộc thiểu số và thưởng thức món ăn đặc sản của vùng cao.", 
    "Bắc Giang, vùng đất với nhiều di tích lịch sử và thắng cảnh đẹp, là nơi bạn có thể tham quan các đền, chùa cổ, và những khu du lịch sinh thái. Bạn sẽ được tham gia các chuyến tham quan, khám phá vẻ đẹp của thiên nhiên và tìm hiểu về các lễ hội truyền thống.", 
    "Quảng Nam nổi tiếng với phố cổ Hội An và các di tích văn hóa thế giới như Mỹ Sơn. Bạn sẽ được tham quan các khu di tích lịch sử, khám phá phố cổ Hội An với các ngôi nhà cổ kính và tham gia vào các hoạt động thú vị như làm đèn lồng, thử các món ăn đặc sản.", 
    "Vân Đồn, với cảnh biển tuyệt đẹp và các hòn đảo hoang sơ, là điểm đến lý tưởng cho những ai yêu thích sự yên tĩnh và thiên nhiên hoang dã. Bạn sẽ được tham gia các chuyến thăm các hòn đảo, tắm biển và thưởng thức các món hải sản tươi ngon.", 
    "Lào Cai, nơi bạn có thể khám phá các bản làng dân tộc thiểu số, tận hưởng vẻ đẹp hùng vĩ của núi non và tham gia vào các chuyến trekking. Ngoài ra, bạn còn có cơ hội ghé thăm Sapa và chinh phục đỉnh Fansipan, tận hưởng không khí trong lành của vùng núi cao.", 
    "Ninh Thuận là một điểm đến không thể bỏ qua với các bãi biển hoang sơ, các làng chài yên bình và những cánh đồng nho bạt ngàn. Bạn sẽ được tham gia các chuyến thăm các vườn nho, tắm biển, và khám phá các di tích lịch sử của vùng đất này.", 
    "Bắc Ninh nổi tiếng với những lễ hội truyền thống và các di tích lịch sử. Bạn sẽ được tham quan chùa Dâu, chùa Phật Tích và tham gia vào các hoạt động văn hóa dân gian độc đáo, thưởng thức những món ăn đặc sản vùng đất Kinh Bắc.", 
    "Tam Đảo là điểm đến lý tưởng cho những ai yêu thích thiên nhiên và khí hậu mát mẻ. Bạn có thể tham gia các hoạt động leo núi, thăm các thác nước và khám phá các khu nghỉ dưỡng tại đây, đồng thời thưởng thức các món ăn đặc sản của vùng núi.", 
    "Bến Tre là nơi lý tưởng để khám phá cuộc sống bình dị của người dân miền Tây. Bạn sẽ được tham gia các chuyến thăm các vườn trái cây, tham quan các làng nghề truyền thống và trải nghiệm những giây phút thư giãn trên các chuyến thuyền đi dọc sông Cửu Long.", 
    "Bà Nà Hills nổi tiếng với cáp treo dài nhất thế giới, mang đến cho bạn trải nghiệm ngoạn mục với tầm nhìn tuyệt đẹp về cảnh quan thiên nhiên. Bạn sẽ được tham quan khu vui chơi giải trí Fantasy Park, thăm cây cầu vàng nổi tiếng và thưởng thức không khí trong lành.", 
    "Long Hải là điểm đến lý tưởng cho những ai yêu thích biển và sự yên bình. Bạn sẽ được tham gia các hoạt động tắm biển, thăm các di tích lịch sử và khám phá vẻ đẹp tự nhiên của các bãi biển tại đây.", 
    "Đà Lạt, thành phố ngàn hoa, nổi tiếng với khí hậu mát mẻ, những vườn hoa tươi đẹp và các hồ nước tuyệt đẹp. Bạn sẽ được tham quan các điểm du lịch nổi tiếng như Thung Lũng Tình Yêu, Hồ Xuân Hương, và khám phá các địa điểm cà phê đẹp.", 
    "Vĩnh Long là điểm đến lý tưởng để khám phá cuộc sống miền Tây sông nước. Bạn sẽ được tham gia các chuyến du thuyền trên sông, tham quan các vườn trái cây và tìm hiểu về các làng nghề truyền thống của địa phương.", 
    "Sài Gòn, trung tâm kinh tế của Việt Nam, là nơi bạn có thể tham quan các địa danh nổi bật như Dinh Độc Lập, Nhà Thờ Đức Bà và chợ Bến Thành. Bạn cũng sẽ được trải nghiệm nhịp sống sôi động, thưởng thức các món ăn đặc trưng và tham gia vào các hoạt động mua sắm.", 
    "Vinpearl Nha Trang là một khu nghỉ dưỡng cao cấp với các dịch vụ tiện nghi và các hoạt động giải trí hấp dẫn. Bạn sẽ được tham gia các hoạt động thể thao dưới nước, tham quan khu vui chơi giải trí và thư giãn trên bãi biển tuyệt đẹp.", 
    "Hồ Tuyền Lâm là một trong những địa điểm tuyệt vời để thư giãn và tận hưởng không khí trong lành của Đà Lạt. Bạn có thể tham gia các hoạt động như đi thuyền, leo núi và khám phá các khu vực xung quanh hồ, cùng với những cảnh sắc thiên nhiên tuyệt đẹp.", 
    "Mỹ Tho là điểm đến lý tưởng cho những ai yêu thích miền Tây sông nước. Bạn sẽ được tham quan các cù lao, tham gia chuyến thuyền trên sông Tiền, thưởng thức đặc sản miền Tây như hủ tiếu Mỹ Tho và tìm hiểu cuộc sống giản dị của người dân địa phương", 
    "Châu Đốc nổi tiếng với các cảnh đẹp tự nhiên và những ngôi chùa linh thiêng. Bạn sẽ tham quan chùa Bà Chúa Xứ, rừng tràm Trà Sư, tham gia vào các hoạt động vãn cảnh, khám phá các làng nghề truyền thống và thưởng thức đặc sản như cá basa nướng.", 
    "Động Thiên Đường là một trong những hang động đẹp nhất Việt Nam với hệ thống thạch nhũ kỳ vĩ. Bạn sẽ được tham gia chuyến tham quan hang động, khám phá vẻ đẹp huyền bí của những khối đá vôi và thạch nhũ, đồng thời tham gia các hoạt động thám hiểm thú vị.", 
    "Đồ Sơn là một khu nghỉ dưỡng nổi tiếng của Hải Phòng, với những bãi biển đẹp và không khí trong lành. Bạn sẽ được thư giãn trên bãi biển, tham quan các di tích lịch sử và thưởng thức đặc sản hải sản tươi ngon.", 
    "Bái Đính là một trong những khu quần thể chùa lớn nhất Việt Nam, nổi tiếng với tượng Phật khổng lồ và không gian tĩnh lặng. Bạn sẽ tham quan chùa Bái Đính, leo lên đỉnh núi Bái Đính để chiêm ngưỡng toàn cảnh, tìm hiểu về văn hóa Phật giáo và thư giãn trong không gian thiên nhiên.", 
    "Thái Bình, với các cánh đồng lúa rộng lớn và các ngôi chùa cổ, là điểm đến lý tưởng để tìm hiểu về văn hóa truyền thống. Bạn sẽ tham quan chùa Keo, thăm các làng nghề và thưởng thức các món ăn đặc sản như bánh cáy, canh cá chép.", 
    "Phan Thiết nổi tiếng với những bãi biển đẹp và cảnh quan thiên nhiên tuyệt vời. Bạn sẽ được tham gia các hoạt động thể thao dưới nước, thăm đồi cát Mũi Né, tham quan tháp Chàm và thưởng thức các món hải sản tươi ngon.", 
    "Lạng Sơn là một vùng đất miền núi với nhiều phong cảnh thiên nhiên hùng vĩ và các di tích lịch sử. Bạn sẽ tham quan động Tam Thanh, đền Mẫu, chợ Đông Kinh, cùng với việc khám phá những nét đặc trưng của vùng cao Lạng Sơn.", 
    "Đắk Lắk là điểm đến thú vị cho những ai yêu thích khám phá các bản làng dân tộc và thưởng thức không khí mát mẻ của Tây Nguyên. Bạn sẽ tham quan các thác nước nổi tiếng như thác Dray Sap, tìm hiểu văn hóa Tây Nguyên và thưởng thức cà phê đặc sản.", 
    "Động Tam Giang, với vẻ đẹp hoang sơ và kỳ vĩ, là điểm đến lý tưởng cho những ai yêu thích khám phá thiên nhiên. Bạn sẽ tham gia vào các chuyến thám hiểm động, tìm hiểu về hệ sinh thái đặc biệt của khu vực này và thư giãn trong không gian tĩnh lặng.", 
    "Bảo Lộc là nơi lý tưởng để thư giãn và tận hưởng không khí trong lành của vùng cao nguyên. Bạn sẽ tham quan các đồn điền trà, thưởng thức cà phê Bảo Lộc nổi tiếng và khám phá các thác nước đẹp như thác Damb’ri.", 
    "Quảng Trị, với những di tích lịch sử chiến tranh và các danh lam thắng cảnh, là điểm đến cho những ai yêu thích tìm hiểu lịch sử và thiên nhiên. Bạn sẽ tham quan các khu di tích chiến tranh, thăm các bãi biển thơ mộng và thưởng thức các món ăn đặc sản.", 
    "Mù Cang Chải, nổi tiếng với những ruộng bậc thang tuyệt đẹp, là điểm đến lý tưởng cho những ai yêu thích khám phá thiên nhiên và văn hóa. Bạn sẽ tham quan các bản làng dân tộc, trải nghiệm cuộc sống của người dân địa phương và ngắm nhìn vẻ đẹp kỳ vĩ của các thửa ruộng bậc thang.", 
    "Tả Lèng, nơi có vẻ đẹp hoang sơ và tĩnh lặng, là điểm đến lý tưởng cho những ai yêu thích trekking và khám phá. Bạn sẽ được đi bộ qua các cánh rừng nguyên sinh, thăm các thửa ruộng bậc thang và trải nghiệm cuộc sống của người dân tộc Mông.", 
    "Côn Sơn là một khu du lịch nổi tiếng với không gian tĩnh lặng và các cảnh quan thiên nhiên đẹp mắt. Bạn sẽ tham quan các chùa, thăm các đền thờ, khám phá các bãi biển và thưởng thức các món ăn đặc sản.", 
    "Bình Phước là nơi lý tưởng để khám phá thiên nhiên, các khu rừng nguyên sinh và các vườn cao su. Bạn sẽ tham gia các chuyến tham quan vườn cây, thăm các khu bảo tồn thiên nhiên và tìm hiểu về cuộc sống của người dân địa phương.", 
    "Lâm Đồng, với các thác nước tuyệt đẹp, các khu vườn hoa tươi thắm và không khí trong lành, là điểm đến lý tưởng để thư giãn và khám phá. Bạn sẽ tham quan các địa danh như Thung Lũng Tình Yêu, Hồ Xuân Hương, và các vườn hoa.", 
    "Quảng Ngãi là nơi bạn có thể khám phá các di tích lịch sử như Đài tưởng niệm Liệt sĩ, các bãi biển đẹp và thưởng thức các món ăn đặc sản miền Trung. Bạn cũng có thể thăm các khu du lịch sinh thái và thưởng ngoạn phong cảnh thiên nhiên.", 
    "Bãi Sao nổi tiếng với bãi biển đẹp và làn nước trong xanh. Đây là nơi lý tưởng để tắm biển, thư giãn và tham gia các hoạt động thể thao dưới nước. Bạn cũng có thể khám phá các hòn đảo xung quanh và thưởng thức các món ăn hải sản tươi ngon.", 
    "Cát Tiên là nơi bạn có thể khám phá khu rừng nguyên sinh và hệ động thực vật phong phú. Bạn sẽ tham gia các chuyến tham quan, thăm các đền thờ và tìm hiểu về các loài động vật hoang dã trong khu vực.", 
    "Cà Mau là vùng đất miền Tây nổi tiếng với các hệ sinh thái rừng ngập mặn và các cảnh quan tự nhiên tuyệt đẹp. Bạn sẽ tham gia các chuyến tham quan trên sông, thăm khu rừng U Minh Hạ, khám phá đời sống của người dân miền Tây và thưởng thức hải sản tươi ngon.", 
    "Gành Đá Đĩa là một kỳ quan thiên nhiên với các khối đá xếp chồng độc đáo, tạo nên một cảnh quan hùng vĩ. Bạn sẽ tham gia các chuyến thăm quan, khám phá vẻ đẹp của thiên nhiên và thưởng thức những món ăn đặc sản của vùng đất Phú Yên.", 
    "Vườn Quốc Gia Pù Mát là điểm đến lý tưởng cho những ai yêu thích khám phá thiên nhiên hoang dã với hệ sinh thái đa dạng. Bạn sẽ được đi bộ trong rừng, thăm các thác nước đẹp và tham gia các hoạt động trekking khám phá động thực vật.", 
    "Lai Châu là điểm đến tuyệt vời cho những ai yêu thích du lịch vùng cao, nơi bạn có thể tìm hiểu về văn hóa các dân tộc thiểu số và thưởng ngoạn cảnh sắc thiên nhiên hùng vĩ. Bạn sẽ thăm các bản làng, tham gia các chuyến đi bộ xuyên núi và khám phá các phong tục tập quán độc đáo.", 
    "Tây Bắc nổi tiếng với những thửa ruộng bậc thang tuyệt đẹp và các bản làng dân tộc sống giữa những ngọn núi hùng vĩ. Bạn sẽ được thăm các bản làng của người Mông, người Thái, tham gia các hoạt động leo núi và tìm hiểu về các nền văn hóa đặc sắc của người dân nơi đây.", 
    "Pù Luông là một khu vực nằm trong khu bảo tồn thiên nhiên với phong cảnh thiên nhiên hoang sơ và những ngọn núi xanh ngắt. Bạn sẽ tham gia các chuyến đi bộ xuyên rừng, thăm các bản làng dân tộc và thưởng ngoạn những thửa ruộng bậc thang tuyệt đẹp.", 
    "Địa đạo Củ Chi là một trong những di tích lịch sử nổi tiếng của Việt Nam, đặc biệt với những chứng tích về cuộc kháng chiến chống Mỹ. Bạn sẽ khám phá hệ thống địa đạo, tìm hiểu về cuộc sống của bộ đội Việt Nam trong chiến tranh, tham gia các hoạt động trải nghiệm và xem các mô hình chiến tranh.", 
    "Lạch Tray là một vùng đất nằm gần trung tâm Hải Phòng, nổi bật với những cảnh quan thiên nhiên và các khu nghỉ dưỡng nổi tiếng. Bạn sẽ tham quan các khu du lịch sinh thái, tham gia các hoạt động dã ngoại và thưởng thức các món ăn đặc sản Hải Phòng.", 
    "Bản Áng, nằm ở tỉnh Sơn La, là nơi sinh sống của người H'mông với cảnh sắc thiên nhiên tuyệt đẹp. Bạn sẽ tham quan các thửa ruộng bậc thang, tham gia các hoạt động khám phá cuộc sống của người dân bản địa và thưởng thức các món ăn truyền thống.", 
    "Cầu Đất Farm, nằm ở Đà Lạt, nổi tiếng với các vườn hoa và không khí trong lành. Bạn sẽ tham quan các đồn điền trà, tham gia vào các hoạt động nông nghiệp và thưởng thức trà Cầu Đất nổi tiếng.", 
    "Hồ Núi Cốc, nằm ở Thái Nguyên, là một khu du lịch sinh thái với phong cảnh hữu tình. Bạn sẽ tham gia các chuyến tham quan, khám phá hồ nước rộng lớn và thư giãn trong không gian thiên nhiên tĩnh lặng.", 
    "Mộc Châu, với những cánh đồng hoa cải trắng tuyệt đẹp và không khí mát mẻ, là một điểm đến lý tưởng cho những ai yêu thích thiên nhiên. Bạn sẽ tham quan các đồi chè, thăm các bản làng dân tộc và tham gia các hoạt động ngoài trời.", 
    "Ba Na Hills, với hệ thống cáp treo dài nhất thế giới và khung cảnh thiên nhiên tuyệt đẹp, là điểm đến lý tưởng để thư giãn. Bạn sẽ tham quan các khu du lịch, ngắm nhìn toàn cảnh Đà Nẵng từ trên cao và tham gia các hoạt động giải trí tại khu vui chơi.", 
    "Vườn Quốc Gia Cát Tiên, nổi bật với hệ động thực vật phong phú, là điểm đến tuyệt vời cho những ai yêu thích du lịch sinh thái. Bạn sẽ tham gia các chuyến tham quan trong rừng, tìm hiểu về các loài động vật hoang dã và thư giãn trong không gian thiên nhiên.", 
    "Cảng Sa Kỳ là điểm xuất phát cho các chuyến đi đến các hòn đảo thuộc quần đảo Lý Sơn. Bạn sẽ tham gia các chuyến thuyền ra đảo, khám phá các bãi biển đẹp và thưởng thức hải sản tươi ngon.", 
    "Phú Quốc là thiên đường du lịch biển nổi tiếng với những bãi cát trắng mịn và làn nước trong xanh. Bạn sẽ tham gia các hoạt động thể thao dưới nước, tham quan các đảo nhỏ xung quanh và thưởng thức các món hải sản tươi ngon.", 
    "Vinpearl Phú Quốc là khu nghỉ dưỡng cao cấp với các tiện ích hiện đại và nhiều hoạt động giải trí. Bạn sẽ tham gia vào các trò chơi tại công viên nước, thưởng thức các món ăn đặc sản và thư giãn tại các bãi biển tuyệt đẹp.", 
    "Vạn Chài là một địa điểm du lịch nằm ven biển với cảnh quan hoang sơ và không khí trong lành. Bạn sẽ tham gia các chuyến tham quan đảo, tắm biển và thưởng thức các món ăn đặc sản từ hải sản.", 
    "Thác Pongour, nằm ở Lâm Đồng, là một trong những thác nước đẹp nhất Việt Nam. Bạn sẽ được tham gia các chuyến tham quan, khám phá cảnh quan tuyệt vời của thác và tham gia các hoạt động ngoài trời như leo núi, tắm thác.", 
    "Cáp treo Bà Nà Hills là một trong những trải nghiệm thú vị khi đến Đà Nẵng. Bạn sẽ đi cáp treo lên đỉnh núi Bà Nà, tham quan khu du lịch và thưởng thức cảnh đẹp từ trên cao, khám phá các ngôi chùa và tận hưởng không khí trong lành.", 
    "Đà Nẵng và Hội An là những thành phố nổi tiếng với vẻ đẹp cổ kính và hiện đại. Bạn sẽ tham quan các địa danh nổi tiếng ở Đà Nẵng như Bà Nà Hills, Ngũ Hành Sơn, và khám phá phố cổ Hội An với những con phố đầy màu sắc.", 
    "Huế, với vẻ đẹp cổ kính và lịch sử hào hùng, là một điểm đến không thể bỏ qua khi du lịch miền Trung. Bạn sẽ tham quan Đại Nội, chùa Thiên Mụ, các lăng tẩm vua chúa và thưởng thức những món ăn đặc sản của vùng đất này.", 
    "Mũi Né và Phan Thiết nổi tiếng với các bãi biển đẹp và những đồi cát rộng lớn. Bạn sẽ tham gia các hoạt động thể thao dưới nước, thăm tháp Chàm và thưởng thức các món hải sản tươi ngon, thư giãn trên những bãi biển thơ mộng."];

const toursItineraries = tourNames.map((tour) => {
    let itinerary;
    if (tour.includes("3 ngày 2 đêm")) {
        itinerary = `
Ngày 1:
\\n06:00: Đón khách tại điểm hẹn, khởi hành đến điểm du lịch.
\\n12:00: Ăn trưa tại nhà hàng địa phương.
\\n14:00: Tham quan các điểm nổi bật tại địa phương.
\\n18:30: Ăn tối, tự do khám phá khu vực về đêm.
\\nNgày 2:
\\n07:00: Ăn sáng tại khách sạn.
\\n08:00: Tham quan các làng văn hóa, danh lam thắng cảnh nổi bật.
\\n12:00: Ăn trưa tại nhà hàng địa phương.
\\n14:00: Tham quan địa danh nổi tiếng, mua sắm quà lưu niệm.
\\n18:30: Ăn tối, thưởng thức đặc sản địa phương.
\\nNgày 3:
\\n07:00: Ăn sáng, trả phòng khách sạn.
\\n08:00: Khám phá các điểm du lịch thiên nhiên.
\\n11:30: Ăn trưa tại nhà hàng.
\\n13:30: Khởi hành về điểm hẹn ban đầu.
\\n19:00: Kết thúc hành trình.
        `;
    } else if (tour.includes("2 ngày 1 đêm")) {
        itinerary = `
Ngày 1:
\\n06:00: Đón khách tại điểm hẹn, khởi hành đến điểm du lịch.
\\n12:00: Ăn trưa tại nhà hàng địa phương.
\\n14:00: Tham quan các điểm nổi bật tại địa phương.
\\n18:30: Ăn tối, tự do khám phá khu vực về đêm.
\\nNgày 2:
\\n07:00: Ăn sáng tại khách sạn.
\\n08:00: Tham quan các điểm du lịch thiên nhiên.
\\n11:30: Ăn trưa, nghỉ ngơi.
\\n13:30: Khởi hành về điểm hẹn ban đầu.
\\n19:00: Kết thúc hành trình.
        `;
    } else if (tour.includes("1 ngày")) {
        itinerary = `
Ngày 1:
\\n06:00: Đón khách tại điểm hẹn, khởi hành đến điểm du lịch.
\\n09:00: Tham quan các điểm nổi bật tại địa phương.
\\n12:00: Ăn trưa tại nhà hàng địa phương.
\\n14:00: Tham quan thêm một số địa danh nổi bật.
\\n17:30: Khởi hành về điểm hẹn ban đầu.
\\n20:00: Kết thúc hành trình.
        `;
    } else if (tour.includes("4 ngày 3 đêm")) {
        itinerary = `
Ngày 1:
\\n06:00: Đón khách tại điểm hẹn, khởi hành đến điểm du lịch.
\\n12:00: Ăn trưa tại nhà hàng địa phương.
\\n14:00: Tham quan các địa danh nổi tiếng.
\\n18:30: Ăn tối, tự do khám phá khu vực về đêm.
\\nNgày 2:
\\n07:00: Ăn sáng tại khách sạn.
\\n08:00: Khám phá văn hóa, phong tục tại các làng địa phương.
\\n12:00: Ăn trưa tại nhà hàng địa phương.
\\n14:00: Tham quan thiên nhiên và các hoạt động giải trí.
\\n18:30: Thưởng thức bữa tối đặc sản.
\\nNgày 3:
\\n07:00: Ăn sáng tại khách sạn.
\\n08:00: Tham quan thêm các khu vực di sản.
\\n12:00: Ăn trưa tại nhà hàng.
\\n14:00: Khám phá các khu chợ hoặc mua sắm lưu niệm.
\\n18:30: Thưởng thức tiệc tối tại địa phương.
\\nNgày 4:
\\n07:00: Ăn sáng, trả phòng khách sạn.
\\n08:00: Điểm đến cuối cùng trước khi về.
\\n12:00: Ăn trưa, nghỉ ngơi.
\\n14:00: Khởi hành về điểm hẹn ban đầu.
\\n20:00: Kết thúc hành trình.
        `;
    }
    return { tour, itinerary };
});
// Hàm tạo một tour giả lập
const generateTour = (name, videoId, price, description) => {
    const daysMatch = name.match(/(\d+)\s+ngày/); // Trích xuất số ngày từ tên tour
    const days = daysMatch ? parseInt(daysMatch[1]) : 1; // Mặc định 1 ngày nếu không tìm thấy
    const startDate = faker.date.future(); // Ngẫu nhiên ngày bắt đầu
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1); // Cộng số ngày (trừ 1 vì đã tính ngày đầu)

    const image = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : null; // Tạo thumbnail từ videoId

    // Xác định mức độ (level) dựa trên giá
    const level = price < 3000000 ? "Easy" : price < 5000000 ? "Medium" : "Hard";

    // Tìm lịch trình tương ứng với tour
    const itinerary = toursItineraries.find(tourItinerary => name.includes(tourItinerary.tour))?.itinerary || '';

    return {
        name: name,
        description: description,
        image, 
        videoId, 
        level, 
        startDate: startDate,
        endDate: endDate,
        itinerary: itinerary, // Lịch trình tour ngẫu nhiên
        price: price, 
        slug: faker.helpers.slugify(name) // Tạo slug từ tên tour
    };
};



// Hàm thêm dữ liệu vào MongoDB
const addTours = async () => {
    try {
        const tours = [];
        for (let i = 0; i < tourNames.length; i++) {
            // Lấy video URL từ danh sách fakeYouTubeLinks
            const videoUrl = fakeYouTubeLinks[i % fakeYouTubeLinks.length]; // Sử dụng URL tuần hoàn nếu số tên tour > số link
            
            // Lấy giá từ tourPrices theo thứ tự
            const price = parseInt(tourPrices[i]); // Chuyển giá sang số nguyên
            
            // Lấy mô tả tour từ tourDescriptions
            const description = tourDescriptions[i % tourDescriptions.length];

            const newTour = generateTour(tourNames[i], videoUrl, price, description); // Tạo một tour mới với video URL
            tours.push(newTour);
        }

        await Tour.insertMany(tours); // Chèn tất cả tour vào MongoDB
        console.log('Thêm tour thành công!');
        process.exit(); // Thoát sau khi hoàn tất
    } catch (error) {
        console.error('Lỗi khi thêm tour:', error);
        process.exit(1); // Thoát với mã lỗi
    }
};

// Gọi hàm thêm tour
addTours();
