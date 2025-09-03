// src/components/DanhMucBaiViet.jsx
import React from "react";
import { useParams } from "react-router-dom";

// Dữ liệu danh mục bài viết (categoryArticles)
 const categoryArticles = {
  "tin-tuc-su-kien": [
    {
      id: "sk01",
      title: "Sự kiện ra mắt BST đồng hồ mới 2025",
      date: "01/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=S%E1%BB%B1+ki%E1%BB%87n+ra+m%E1%BA%A1t+BST+%C4%91%E1%BB%93ng+h%E1%BB%93",
      alt: "Hình ảnh sự kiện ra mắt đồng hồ",
      desc: "Hãng đồng hồ XYZ đã giới thiệu bộ sưu tập mới nhất tại TP.HCM với sự góp mặt của nhiều nghệ sĩ nổi tiếng."
    },
    {
      id: "sk02",
      title: "Tri ân khách hàng toàn quốc",
      date: "15/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=Tri+ân+kh%C3%A1ch+h%C3%A0ng",
      alt: "Khách hàng tham gia sự kiện",
      desc: "Chương trình tri ân với nhiều ưu đãi hấp dẫn dành cho khách hàng thân thiết diễn ra tại 5 thành phố lớn."
    }
  ],

  "giay-chung-nhan": [
    {
      id: "gcn01",
      title: "Giấy chứng nhận chính hãng cho đồng hồ XYZ",
      date: "12/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=Gi%E1%BA%A3y+ch%E1%BB%9Fng+h%C3%A0ng",
      alt: "Giấy chứng nhận chính hãng",
      desc: "Tất cả đồng hồ XYZ đều được cấp giấy chứng nhận đảm bảo nguồn gốc và chất lượng."
    },
    {
      id: "gcn02",
      title: "Cách kiểm tra giấy chứng nhận thật giả",
      date: "18/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=Ki%E1%BB%83m+tra+gi%E1%BA%A3y+ch%E1%BB%9Fng",
      alt: "Kiểm tra giấy chứng nhận",
      desc: "Hướng dẫn chi tiết giúp bạn nhận biết giấy chứng nhận thật giả khi mua đồng hồ."
    }
  ],

  "tin-khuyen-mai": [
    {
      id: "km01",
      title: "Khuyến mại lớn mừng khai trương cửa hàng mới",
      date: "05/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=Khuy%E1%BB%81n+m%E1%BA%A1i+khai+tr%C6%B0%C6%A1ng",
      alt: "Khuyến mại khai trương",
      desc: "Giảm giá lên đến 30% cho toàn bộ sản phẩm trong tuần lễ khai trương."
    },
    {
      id: "km02",
      title: "Ưu đãi đặc biệt cho khách hàng thân thiết tháng 6",
      date: "01/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=%C6%A6u+%C4%91%C3%A1i+kh%C3%A1ch+h%C3%A0ng+th%C3%A2n+thi%E1%BA%BFt",
      alt: "Ưu đãi khách hàng thân thiết",
      desc: "Tặng voucher mua hàng và quà tặng hấp dẫn cho khách hàng thân thiết."
    }
  ],

  "tu-van-giai-dap": [
    {
      id: "tv01",
      title: "Cách chỉnh ngày giờ trên đồng hồ cơ đúng cách",
      date: "10/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=Ch%E1%BB%8Bnh+ng%C3%A0y+gi%E1%BB%9D+%C4%91%E1%BB%93ng+h%E1%BB%93",
      alt: "Chỉnh ngày giờ đồng hồ cơ",
      desc: "Hướng dẫn chi tiết cách chỉnh ngày giờ cho đồng hồ cơ không bị hư hại."
    },
    {
      id: "tv02",
      title: "Làm sao để đồng hồ quartz hoạt động lâu bền?",
      date: "20/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=B%E1%BA%A3o+d%C6%B0%E1%BB%9Dng+%C4%91%E1%BB%93ng+h%E1%BB%93+quartz",
      alt: "Bảo dưỡng đồng hồ quartz",
      desc: "Những lưu ý quan trọng giúp đồng hồ quartz của bạn luôn hoạt động ổn định."
    }
  ],

  "the-gioi-dong-ho": [
    {
      id: "tgdh01",
      title: "Lịch sử phát triển đồng hồ Thụy Sỹ",
      date: "15/04/2025",
      img: "https://via.placeholder.com/400x300.png?text=L%E1%BB%8Bch+s%E1%BB%9F+ph%C3%A1t+tri%E1%BB%83n+%C4%91%E1%BB%93ng+h%E1%BB%93+Th%E1%BB%A7y+S%C3%BD",
      alt: "Đồng hồ Thụy Sỹ",
      desc: "Tìm hiểu lịch sử và những cột mốc quan trọng của ngành đồng hồ Thụy Sỹ."
    },
    {
      id: "tgdh02",
      title: "Xu hướng đồng hồ thông minh 2025",
      date: "25/04/2025",
      img: "https://via.placeholder.com/400x300.png?text=Xu+h%C6%B0%E1%BB%9Bng+%C4%91%E1%BB%93ng+hồ+th%C3%B4ng+minh",
      alt: "Đồng hồ thông minh",
      desc: "Các xu hướng công nghệ nổi bật trong đồng hồ thông minh năm 2025."
    }
  ],

  "danh-gia-dong-ho": [
    {
      id: "dg01",
      title: "Đánh giá Seiko Presage 'Edo Silk' phiên bản mới",
      date: "20/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=%C4%90%C3%A1nh+gi%C3%A1+Seiko+Presage",
      alt: "Seiko Edo Silk",
      desc: "Vẻ đẹp truyền thống kết hợp cùng bộ máy hiện đại – lựa chọn lý tưởng cho người yêu đồng hồ Nhật."
    },
    {
      id: "dg02",
      title: "Đánh giá đồng hồ Citizen Eco-Drive mới 2025",
      date: "22/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=%C4%90%C3%A1nh+gi%C3%A1+Citizen+Eco-Drive",
      alt: "Citizen Eco-Drive",
      desc: "Citizen Eco-Drive với công nghệ năng lượng ánh sáng, thiết kế hiện đại và độ bền cao."
    }
  ],

  "huong-dan-su-dung-dong-ho": [
    {
      id: "hd01",
      title: "Hướng dẫn sử dụng đồng hồ cơ cho người mới",
      date: "01/04/2025",
      img: "https://via.placeholder.com/400x300.png?text=H%C6%B0%E1%BB%9Bng+d%E1%BA%ABn+s%E1%BB%AD+d%E1%BB%95ng+%C4%91%E1%BB%93ng+h%E1%BB%93+c%C6%A1",
      alt: "Hướng dẫn đồng hồ cơ",
      desc: "Những điều cần biết khi bắt đầu sử dụng đồng hồ cơ."
    },
    {
      id: "hd02",
      title: "Cách bảo dưỡng đồng hồ quartz tại nhà",
      date: "15/04/2025",
      img: "https://via.placeholder.com/400x300.png?text=C%C3%A1ch+b%E1%BA%A3o+d%C6%B1%E1%BB%9Dng+%C4%91%E1%BB%93ng+h%E1%BB%93+quartz",
      alt: "Bảo dưỡng đồng hồ quartz",
      desc: "Các bước đơn giản giúp duy trì tuổi thọ đồng hồ quartz."
    }
  ],

  "tuyen-dung": [
    {
      id: "td01",
      title: "Công ty đồng hồ XYZ tuyển dụng nhân viên kinh doanh",
      date: "05/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=Tuy%E1%BB%83n+d%E1%BB%A5ng+nh%C3%A2n+vi%C3%AAn+kinhdoanh",
      alt: "Tuyển dụng kinh doanh",
      desc: "Mở rộng đội ngũ kinh doanh, tìm kiếm nhân viên năng động, nhiệt huyết."
    },
    {
      id: "td02",
      title: "Vị trí kỹ thuật viên bảo trì đồng hồ",
      date: "15/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=Tuy%E1%BB%83n+d%E1%BB%A5ng+kỹ+thu%E1%BA%BFt+vi%C3%AAn",
      alt: "Tuyển dụng kỹ thuật viên",
      desc: "Cần tuyển kỹ thuật viên bảo trì đồng hồ với kinh nghiệm trên 2 năm."
    }
  ],

  "cau-chuyen-thoi-gian": [
    {
      id: "cttg01",
      title: "Câu chuyện về chiếc đồng hồ cổ của gia đình",
      date: "10/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=C%C3%A2u+chuy%E1%BB%87n+v%E1%BB%81+chi%E1%BA%BFc+%C4%91%E1%BB%93ng+h%E1%BB%93+c%E1%BB%95",
      alt: "Đồng hồ cổ",
      desc: "Một chiếc đồng hồ cổ đã theo chân gia đình qua nhiều thế hệ."
    },
    {
      id: "cttg02",
      title: "Hành trình tạo ra chiếc đồng hồ độc bản",
      date: "25/05/2025",
      img: "https://via.placeholder.com/400x300.png?text=H%C3%A0nh+tr%C3%ACnh+t%E1%BA%A1o+ra+chi%E1%BA%BFc+%C4%91%E1%BB%93ng+h%E1%BB%93+%C4%91%E1%BB%8Fc+b%E1%BA%A3n",
      alt: "Đồng hồ độc bản",
      desc: "Câu chuyện thú vị về chiếc đồng hồ duy nhất trên thế giới."
    }
  ],

  "su-kien": [
    {
      id: "sk01",
      title: "Sự kiện tri ân khách hàng VIP năm 2025",
      date: "18/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=S%E1%BB%B1+ki%E1%BB%87n+tri+â+n+kh%C3%A1ch+h%C3%A0ng+VIP",
      alt: "Sự kiện VIP",
      desc: "Dành riêng cho khách hàng VIP với nhiều ưu đãi và trải nghiệm đặc biệt."
    },
    {
      id: "sk02",
      title: "Giới thiệu bộ sưu tập đồng hồ thể thao mới",
      date: "22/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=Gi%E1%BB%9Bi+thi%E1%BB%87u+b%E1%BB%93+s%C3%BAu+t%E1%BB%99p+%C4%91%E1%BB%93ng+h%E1%BB%93+th%E1%BB%83+thao",
      alt: "Đồng hồ thể thao",
      desc: "Sự kiện ra mắt bộ sưu tập đồng hồ thể thao dành cho giới trẻ năng động."
    }
  ],

  "phong-cach-thoi-trang": [
    {
      id: "pctt01",
      title: "Kết hợp đồng hồ với trang phục công sở",
      date: "12/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=K%E1%BA%BFt+h%E1%BB%8Dp+%C4%91%E1%BB%93ng+h%E1%BB%93+v%E1%BB%9Bi+trang+ph%E1%BB%A5c+c%C3%B4ng+s%E1%BB%9F",
      alt: "Đồng hồ công sở",
      desc: "Mẹo chọn đồng hồ phù hợp với trang phục đi làm."
    },
    {
      id: "pctt02",
      title: "Xu hướng đồng hồ thời trang 2025",
      date: "20/06/2025",
      img: "https://via.placeholder.com/400x300.png?text=Xu+h%C6%B0%E1%BB%9Bng+%C4%91%E1%BB%93ng+hồ+th%E1%BB%9Di+trang",
      alt: "Đồng hồ thời trang",
      desc: "Các mẫu đồng hồ thời trang đang được yêu thích năm 2025."
    }
  ]
};

// ✅ Dữ liệu metadata danh mục
const categories = [
  {
    id: "tin-tuc-su-kien",
    name: "Tin tức sự kiện",
    description: "Cập nhật các sự kiện mới nhất trong ngành đồng hồ, tri ân khách hàng và ra mắt sản phẩm."
  },
  {
    id: "giay-chung-nhan",
    name: "Giấy chứng nhận",
    description: "Tổng hợp giấy chứng nhận chính hãng và xác thực từ các thương hiệu đồng hồ uy tín."
  },
  {
    id: "tin-khuyen-mai",
    name: "Tin khuyến mại",
    description: "Ưu đãi, giảm giá, quà tặng đặc biệt trong các chương trình khuyến mãi."
  },
  {
    id: "tu-van-giai-dap",
    name: "Tư vấn giải đáp",
    description: "Hướng dẫn, mẹo sử dụng đồng hồ và giải đáp các câu hỏi phổ biến."
  },
  {
    id: "the-gioi-dong-ho",
    name: "Thế giới đồng hồ",
    description: "Khám phá xu hướng, thương hiệu và câu chuyện thú vị về đồng hồ."
  },
  {
    id: "danh-gia-dong-ho",
    name: "Đánh giá đồng hồ",
    description: "Đánh giá chi tiết các dòng đồng hồ nổi bật trên thị trường."
  },
  {
    id: "huong-dan-su-dung-dong-ho",
    name: "Hướng dẫn sử dụng đồng hồ",
    description: "Các bước sử dụng, chỉnh giờ, bảo quản đồng hồ đúng cách."
  },
  {
    id: "tuyen-dung",
    name: "Tuyển dụng",
    description: "Cơ hội nghề nghiệp hấp dẫn trong ngành đồng hồ tại XYZ Watch."
  },
  {
    id: "cau-chuyen-thoi-gian",
    name: "Câu chuyện thời gian",
    description: "Những câu chuyện truyền cảm hứng gắn liền với chiếc đồng hồ."
  },
  {
    id: "su-kien",
    name: "Sự kiện",
    description: "Tổng hợp các sự kiện lớn của công ty, ra mắt sản phẩm mới."
  },
  {
    id: "phong-cach-thoi-trang",
    name: "Phong cách thời trang",
    description: "Gợi ý phối đồ, xu hướng thời trang với đồng hồ."
  }
];



function DanhMucBaiViet() {
  const { category } = useParams();

  // Tìm thông tin metadata theo id category
  const categoryMeta = categories.find(cat => cat.id === category);
  const displayName = categoryMeta?.name || decodeURIComponent(category);
  const description = categoryMeta?.description || "";
  const articles = categoryArticles[category] || [];

  return (
    <div className="container py-4">
      <header className="mb-4"
      style={{
          backgroundColor: "#f8f9fa",
      }}
      >
        <h1 className="text-uppercase fw-bold">{displayName}</h1>
        {description && <p className="text-muted">{description}</p>}
      </header>

      {articles.length > 0 ? (
        <div className="row gx-4 gy-4">
          {articles.map((article) => (
            <div key={article.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border border-secondary">
                <img
                  src={article.img}
                  alt={article.alt}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                    🗓 {article.date}
                  </p>
                  <p className="card-text" style={{ fontSize: "0.95rem" }}>
                    {article.desc}
                  </p>
                  {/* Nếu có trang chi tiết riêng cho từng bài, có thể thêm <Link> ở đây */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning mt-4">
          Không có bài viết nào trong danh mục <strong>{displayName}</strong>.
        </div>
      )}
    </div>
  );
}

export default DanhMucBaiViet;
