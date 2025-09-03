// ChiTietBaiViet.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import './tintuc.css'

     const articles = [
            {
        id: 0,
        img: "https://donghoduyanh.com/images/news/2025/05/27/resized/untitled_1748333762.jpg.webp",
        alt: "Group of three Rolex watches with gold, rose gold, and silver metal bands",
        title: "4 thương hiệu đồng hồ chất lượng cao có giá cả phải chăng dành cho nam giới",
        date: "27/05/2025",
        desc: "Việc cân nhắc giá cả trở thành một yếu tố quan trọng khi quyết định mua một chiếc đồng hồ.",
      },
      {
        id: 1,
        img: "https://donghoduyanh.com/images/news/2025/05/27/resized/rt_1748321931.jpg.webp",
        alt: "Group of three Rolex watches with gold, rose gold, and silver metal bands",
        title: "LOẠT MẪU ĐỒNG HỒ ROLEX MỚI NHẤT NĂM 2025",
        date: "27/05/2025",
        desc: "Rolex gây chấn động tại sự kiện Watches and Wonders 2025, biến Geneva trở thành tâm điểm sôi động của thế giới đồng hồ. Như...",
      },
      {
        id: 2,
        img: "https://donghoduyanh.com/images/news/2025/05/20/resized/untitled_1747712656.jpg.webp",
        alt: "Closeup image of watch mechanism with gears and tools",
        title: "THỤY SĨ VÀ NHẬT BẢN - CUỘC ĐỐI ĐẦU CỦA NGÀNH ĐỒNG HỒ TRÊN TOÀN THẾ GIỚI",
        date: "19/05/2025",
        desc: "Trong lịch sử ngành công nghiệp đồng hồ, cuộc cạnh tranh giữa Nhật Bản và Thụy Sĩ không chỉ là câu chuyện về công nghệ...",
      },
      {
        id: 3,
        img: "https://donghoduyanh.com/images/news/2025/05/20/resized/untitled_1747708894.jpg.webp",
        alt: "Back view of a watch showing intricate mechanical parts",
        title: "MỌI THỨ BẠN CẦN BIẾT VỀ ĐỒNG HỒ BẤM GIỜ: ĐỒNG HỒ BẤM GIỜ MÔ-ĐUN SO VỚI ĐỒNG HỒ BẤM GIỜ TÍCH HỢP",
        date: "19/05/2025",
        desc: "Dù hai chiếc đồng hồ bấm giờ có thể trông giống nhau về mặt thẩm mỹ, nhưng những gì bên trong lại có thể khác...",
      },
      {
        id: 4,
        img: "https://donghoduyanh.com/images/news/2025/05/19/resized/untitled_1747642664.jpg.webp",
        alt: "Back view of a watch showing golden rotor and mechanical parts",
        title: "MỌI THỨ BẠN CẦN BIẾT VỀ ĐỒNG HỒ BẤM GIỜ: ĐỒNG HỒ BẤM GIỜ HOẠT ĐỘNG NHƯ THẾ NÀO?",
        date: "19/05/2025",
        desc: "Đồng hồ bấm giờ hoạt động như thế nào và cách đọc của chúng được diễn giải một cách cụ thể và chi tiết nhất...",
      },
      {
        id: 5,
        img: "https://donghoduyanh.com/images/news/2025/05/19/resized/untitled_1747629294.jpg.webp",
        alt: "Group of vintage watches with black leather straps and white dials",
        title: "MỌI THỨ BẠN CẦN BIẾT VỀ ĐỒNG HỒ BẤM GIỜ: 1816 - SỰ RA ĐỜI CỦA CƠ CHẾ BẤM GIỜ ĐẦU TIÊN TRÊN THẾ GIỚI",
        date: "19/05/2025",
        desc: "Đồng hồ bấm giờ là một lĩnh vực cực kỳ rộng lớn, vượt xa định nghĩa đơn giản của nó và đi sâu vào lịch...",
      },
      {
        id: 6,
        img: "https://donghoduyanh.com/images/news/2025/05/15/resized/untitled_1747280298.jpg.webp",
        alt: "Seiko Presage Classic Series 36mm watch on wrist with silver metal band",
        title: 'CÁC MẪU SEIKO PRESAGE CLASSIC SERIES 36MM "EDO SILK" MỚI',
        date: "15/05/2025",
        desc: 'Seiko Presage, từ một viên ngọc án độc quyền tại Nhật Bản, đã vươn mình ra thế giới với bộ sưu tập Classic Series "Edo...',
      },
      {
        id: 7,
        img: "https://donghoduyanh.com/images/news/2025/05/14/resized/so-sanh-dong-ho-treo-tuong-co-va-pin_1747207443.jpg.webp",
        alt: "Image showing comparison of pendulum wall clock and battery wall clock with VS text",
        title: "SO SÁNH ĐỒNG HỒ TREO TƯỜNG CƠ VÀ PIN, NÊN CHỌN LOẠI NÀO?",
        date: "14/05/2025",
        desc: "Bạn đang phân vân không biết nên chọn đồng hồ treo tường cơ hay đồng hồ treo tường pin để trang trí không gian sống?...",
      },
      {
        id: 8,
        img: "https://donghoduyanh.com/images/news/2025/05/14/resized/untitled_1747192896.jpg.webp",
        alt: "Frederique Constant Classic Tourbillon watch with green dial and leather strap",
        title: "FREDERIQUE CONSTANT CLASSIC TOURBILLON MANUFACTURE GREEN: SẮC XANH THỜI THƯỢNG TRONG TẦM TAY",
        date: "14/05/2025",
        desc: "Chiếc đồng hồ tourbillon phiên bản giới hạn tinh tế bằng thép với một số màu xanh lá cây là lời khẳng định hứng hồn...",
      },
      {
        
        id: 9,
         img: "https://donghoduyanh.com/images/news/2025/05/14/resized/untitled_1747190947.jpg.webp",
        title: "HAMILTON CHRONO-MATIC 50 PHIÊN BẢN GIỚI HẠN: TÔN VINH THẬP NIÊN 1970 VÀ LỊCH SỬ CHẾ TÁC ĐỒNG HỒ",
        date: "14/05/2025",
        desc: "Trong thế giới đồng hồ cao cấp, Hamilton Chrono-Matic 50 Phiên Bản Giới Hạn là một tuyệt phẩm tôn vinh thập niên 1970 sôi động,...",
      },
      {
                id: 10,
        img: "https://donghoduyanh.com/images/news/2025/05/14/resized/untitled_1747189612.jpg.webp",

        title: "THEO DẤU DI SẢN ĐỒNG HỒ CỦA LONGINES - MỘT TRONG NHỮNG THƯƠNG HIỆU THỤY SĨ LÂU ĐỜI NHẤT THẾ GIỚI",
        date: "14/05/2025",
        desc: "Longines, không chỉ là biểu tượng của sự thanh lịch và chất lượng mà còn là câu chuyện về sự kiện định và đổi mới,...",
      },
       {
                id: 11,
        img: "https://donghoduyanh.com/images/news/2025/05/15/resized/untitled_1747279461.jpg.webp",

        title: "Frederique Constant Classic Tourbillon Manufacture Green: Sắc Xanh Thời Thượng Trong Tầm Tay",
        date: "14/05/2025",
        desc: "Chiếc đồng hồ tourbillon phiên bản giới hạn tinh tế bằng thép với mặt số màu xanh lá cây là lời khẳng định hùng hồn....",
      },
    ];

function ChiTietBaiViet() {
  const { id } = useParams();
  const article = articles.find(item => item.id === parseInt(id));

  if (!article) {
    return <div className="container py-5"><h2>Không tìm thấy bài viết</h2></div>;
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-3">{article.title}</h1>
          <p className="text-muted">{article.date}</p>
          <img
            src={article.img}
            alt={article.alt}
            className="img-fluid mb-4"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
          <div className="content">
            {/* Nội dung giả định, bạn có thể thay bằng bài viết chi tiết thực sự nếu có */}
            <p>{article.desc}</p>
            <   >
              Đây là phần nội dung mở rộng của bài viết: "{article.title}". Bạn có thể thay đoạn này bằng HTML hoặc định dạng markdown tùy vào dữ liệu thật sự.
            </>
            <p>
              Đồng hồ luôn là biểu tượng của sự chính xác và phong cách. Trong bài viết này, chúng ta cùng khám phá sâu hơn về chủ đề: <strong>{article.title}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChiTietBaiViet;
