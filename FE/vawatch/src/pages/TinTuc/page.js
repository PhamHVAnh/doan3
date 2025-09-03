
    import React from "react";
import { Link } from "react-router-dom";
function TinTuc() {
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

    const recentPosts = [
      {
        id: 1,
        img: "https://storage.googleapis.com/a1aa/image/b032c3f3-6552-491a-0af2-97b0efbf7931.jpg",
        alt: "Closeup of Bulova watch with black dial and leather strap",
        title: "Đồng hồ Bulova: Thương hiệu đồng hồ Mỹ lâu đời và...",
        date: "10/11/2025",
      },
      {
        id: 2,
        img: "https://donghoduyanh.com/images/news/2024/11/12/resized/d_1731402126.jpg.webp",
        alt: "Colorful Casio watches for kids",
        title: "Những mẫu đồng hồ Casio mới nhất ra mắt năm 2025",
        date: "04/10/2025",
      },
      {
        id: 3,
        img: "https://donghoduyanh.com/images/news/2023/10/14/resized/dong-ho-nu-fossil_1697249622.jpg.webp",
        alt: "Sale banner with red text and discount numbers",
        title: "KHUYẾN MÃI TƯNG BỪNG, MỪNG ĐẠI LỄ",
        date: "13/04/2025",
      },
      {
        id: 4,
        img: "https://donghoduyanh.com/images/news/2023/02/26/resized/dong-ho-orient-star-re-ay0103l00b-mechanical-moon-phase-classic-2_1654069669jpg_1677424490.jpg.webp",
        alt: "Pink colored watch with decorative elements",
        title: "HƯỚNG DẪN CHO NGƯỜI MỚI BẮT ĐẦU: DÂY ĐEO ĐỒNG HỒ TỐT NHẤT CHO MỌI HOẠT ĐỘNG",
        date: "07/12/2025",
      },
      {
        id: 5,
        img: "https://donghoduyanh.com/images/news/2022/03/14/resized/fc-980v4sz9_1647231548.jpg.webp",
        alt: "Brown dial Dresswatch Mido watch",
        title: "Tourbillon nâng giá trị của một chiếc đồng hồ theo cấp số nhânTourbillon nâng giá trị của một chiếc đồng hồ theo...",
        date: "29/08/2018",
      },
    ];

    const mostViewedPosts = [
      {
        id: 1,
        img: "https://donghoduyanh.com/images/news/2025/05/27/resized/untitled_1748333762.jpg.webp",
        alt: "Group of three Rolex watches with gold, rose gold, and silver metal bands",
        title: "Loạt mẫu đồng hồ Rolex mới nhất năm 2025",
        date: "27/05/2025",
      },
      {
        id: 2,
        img: "https://storage.googleapis.com/a1aa/image/2d44a23d-b1bf-4636-1613-9e825c75a148.jpg",
        alt: "Closeup image of watch mechanism with gears and tools",
        title: "Thụy Sĩ và Nhật Bản - Cuộc đối đầu của ngành đồng...",
        date: "19/05/2025",
      },
      {
        id: 3,
        img: "https://donghoduyanh.com/images/news/2025/05/20/resized/untitled_1747712656.jpg.webp",
        alt: "Group of vintage watches with black leather straps and white dials",
        title: "Mọi thứ bạn cần biết về đồng hồ bấm giờ: Đồng hồ...",
        date: "19/05/2025",
      },
      {
        id: 4,
        img: "https://donghoduyanh.com/images/news/2025/05/20/resized/untitled_1747708894.jpg.webp",
        alt: "Group of vintage watches with black leather straps and white dials",
        title: "Mọi thứ bạn cần biết về đồng hồ bấm giờ: Đồng hồ...",
        date: "19/05/2025",
      },
      {
        id: 5,
        img: "https://donghoduyanh.com/images/news/2025/05/19/resized/untitled_1747642664.jpg.webp",
        alt: "Group of vintage watches with black leather straps and white dials",
        title: "Mọi thứ bạn cần biết về đồng hồ bấm giờ: 1816 - Sự...",
        date: "19/05/2025",
      },
    ];
// src/data/categories.js
 const categories = [
  {
    id: "tin-tuc-su-kien",
    name: "Tin tức sự kiện"
  },
  {
    id: "giay-chung-nhan",
    name: "Giấy chứng nhận"
  },
  {
    id: "tin-khuyen-mai",
    name: "Tin khuyến mại"
  },
  {
    id: "tu-van-giai-dap",
    name: "Tư vấn giải đáp"
  },
  {
    id: "the-gioi-dong-ho",
    name: "Thế giới đồng hồ"
  },
  {
    id: "danh-gia-dong-ho",
    name: "Đánh giá đồng hồ"
  },
  {
    id: "huong-dan-su-dung",
    name: "Hướng dẫn sử dụng đồng hồ"
  },
  {
    id: "tuyen-dung",
    name: "Tuyển dụng"
  },
  {
    id: "cau-chuyen-thoi-gian",
    name: "Câu chuyện thời gian"
  },
  {
    id: "su-kien",
    name: "Sự kiện"
  },
  {
    id: "phong-cach-thoi-trang",
    name: "Phong cách thời trang"
  }
];

    function Article({ article }) {
      return (
 <article className="border border-secondary p-2">
      {article.img && (
        <div className="zoom-wrapper mb-2">
          <Link to={`/tin-tuc/${article.id}`}onClick={() => window.scrollTo(0, 0)}>
            <img
              src={article.img}
              alt={article.alt}
              className="img-fluid zoom-image"
              width="600"
              height="300"
              style={{ objectFit: "cover", cursor: "pointer" }}
            />
          </Link>
        </div>
      )}
      <h2 className="article-title">
        <Link to={`/tin-tuc/${article.id}`} className="text-decoration-none text-dark">
          {article.title}
        </Link>
      </h2>
      <p className="date">{article.date}</p>
      {article.desc && <p className="description">{article.desc}</p>}
    </article>

      );
    }

function PostItem({ post }) {
  return (
    <li>
      <Link to={`/bai-viet/${post.id}`} className="text-decoration-none text-dark"onClick={() => window.scrollTo(0, 0)}>
        <div className="d-flex gap-2 mb-3">
          <img
            src={post.img}
            alt={post.alt}
            width="80"
            height="80"
            className="flex-shrink-0"
            style={{ objectFit: "cover" }}
          />
          <div>
            <p className="title">{post.title}</p>
            <p className="date">{post.date}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}

    function Sidebar() {
      return (
<aside className="col-lg-4">
  <section className="sidebar-section border border-secondary rounded p-3 mb-4 bg-light">
    <h5 className="fw-bold mb-3"> Tìm kiếm</h5>
    <form className="position-relative">
<div className="position-relative" style={{ maxWidth: "300px" }}>
  <input
    type="text"
    placeholder="Nhập nội dung muốn tìm kiếm..."
    className="form-control form-control-sm text-secondary rounded-pill px-3 pe-5"
    style={{ fontSize: "12px" }}
  />
  
  {/* Gạch dọc phân cách */}
  <div
    className="position-absolute top-50 translate-middle-y"
    style={{
      right: "38px", // canh đúng vị trí trước icon
      height: "80%",
      width: "1px",
      backgroundColor: "#ccc"
    }}
  ></div>

  {/* Nút tìm kiếm */}
  <button
    type="submit"
    aria-label="Search"
    className="btn position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary"
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      left : "135px",
    }}
  >
    <i className="fas fa-search"></i>
  </button>
</div>


    </form>
  </section>

;

<section className="sidebar-section border border-secondary rounded p-3 mb-4 bg-light">
  <h5 className="fw-bold mb-3">Danh mục tin</h5>

  <ul className="list-unstyled ps-2" style={{ cursor: "pointer" }}>
    {categories.map((item) => (
      <li key={item.id} className="mb-2">
        <Link
          to={`/danh-muc/${item.id}`}
          className="text-decoration-none text-dark"
          onClick={() => window.scrollTo(0, 0)}
        >
          <i className="fas fa-angle-right me-2 text-secondary"></i> {item.name}
        </Link>
      </li>
    ))}
  </ul>

  <p className="fw-semibold mt-3 mb-1 text-primary">Lịch sử thương hiệu</p>
  <p className="small text-muted">
    CÁC CHÍNH SÁCH VÀ HƯỚNG DẪN CỦA DONGHOVIETANH.COM
  </p>
</section>

  <section className="sidebar-section border border-secondary rounded p-3 mb-4 bg-light">
    <h5 className="fw-bold mb-3">🕒 Bài viết gần đây</h5>
    <ul className="list-unstyled m-0" style={{ cursor: "pointer" }}>
      {recentPosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  </section>

  <section className="sidebar-section border border-secondary rounded p-3 bg-light">
    <h5 className="fw-bold mb-3">🔥 Bài viết xem nhiều nhất</h5>
    <ul className="list-unstyled m-0" style={{ cursor: "pointer" }}>
      {mostViewedPosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  </section>
</aside>

      );
    }

    function Pagination() {
      return (
        <nav aria-label="Pagination" className="d-flex pagination-custom">
          <ul className="pagination">
            <li className="page-item active" aria-current="page">
              <button className="page-link">1</button>
            </li>
            <li className="page-item">
              <button className="page-link">2</button>
            </li>
            <li className="page-item">
              <button className="page-link">3</button>
            </li>
            <li className="page-item">
              <button className="page-link">4</button>
            </li>
            <li className="page-item">
              <button className="page-link">...</button>
            </li>
            <li className="page-item">
              <button className="page-link">›</button>
            </li>
            <li className="page-item">
              <button className="page-link">»</button>
            </li>
          </ul>
        </nav>
      );
    }

  return (
    <div className="tin-tuc-page">
      <header className="bg-light py-3">
         <div className="breadcrumb-nav">
          <Link to="/">TRANG CHỦ</Link>
          <i className="fas fa-chevron-right"></i>
          <span className="active">TIN TỨC</span>
        </div>
      </header>
      <div className="container py-4">

        <h1>Tin tức</h1>
        <div className="row gx-4 gy-4">
          <div className="col-lg-8 row gx-3 gy-3">
            {articles.map((article) => (
              <div key={article.id} className="col-sm-6">
                <Article article={article} />
              </div>
            ))}
          </div>
          <Sidebar />
        </div>
        <Pagination />
      </div>
    </div>
  );
}

export default TinTuc;