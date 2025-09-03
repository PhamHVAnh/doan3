import React from "react";
import { useParams, Link } from "react-router-dom";
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


   const articles = [
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


function ChiTietBaiViet1() {
  const { id } = useParams();
  const allArticles = [...articles, ...recentPosts, ...mostViewedPosts];

  const article = allArticles.find((item) => item.id.toString() === id.toString());

  if (!article)
    return (
      <div className="container py-5">
        <h2 className="text-danger">Bài viết không tồn tại.</h2>
      </div>
    );

  // Lọc bài viết liên quan
  const relatedArticles = allArticles
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  return (
    <div className="container py-5">
      {/* Tiêu đề và ngày */}
      <div className="mb-4 border-bottom pb-3">
        <h1 className="fw-bold">{article.title}</h1>
        <p className="text-muted">Ngày đăng: {article.date}</p>
      </div>

      {/* Hình ảnh chính */}
      {article.img && ( 
        <img
          src={article.img}
          alt={article.alt}
          className="img-fluid rounded mb-4 shadow-sm
        ?"style={{ height: "800px", objectFit: "cover" ,margin:"0 auto",display:"block"}}
        />
      )}

      {/* Nội dung mô tả chi tiết */}
      <div className="mb-5">
        <h4 className="mb-3">Nội dung bài viết</h4>
        <p style={{ lineHeight: "1.8", textAlign: "justify" }}>
          Đây là nội dung chi tiết cho bài viết <strong>{article.title}</strong>. Bạn có thể cập nhật nội dung thật phong phú ở đây, ví dụ:
        </p>
        <ul>
          <li>Giới thiệu về thương hiệu đồng hồ hoặc chủ đề chính.</li>
          <li>Phân tích đặc điểm nổi bật, thiết kế, bộ máy, độ bền.</li>
          <li>So sánh với các dòng đồng hồ khác.</li>
          <li>Đề xuất lựa chọn, phân khúc người dùng phù hợp.</li>
        </ul>
        <p>
          Bài viết này giúp bạn hiểu rõ hơn về <em>{article.title}</em>, từ đó chọn lựa mẫu đồng hồ phù hợp nhất cho phong cách và nhu cầu của bạn.
        </p>
      </div>

      {/* Bài viết liên quan */}
      <div className="border-top pt-4">
        <h5 className="mb-4">Bài viết liên quan</h5>
        <div className="row">
          {relatedArticles.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <Link to={`/tin-tuc/${item.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.img}
                    className="card-img-top"
                    alt={item.alt}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{item.title}</h6>
                    <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
                      {item.date}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChiTietBaiViet1;
