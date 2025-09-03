import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sanPham.scss";
import ProductList from "../../components/PD/ProductList";
import filterOptions from "./data/option";
import {
  Container,
  Row,
  Col,
  Badge,
  ListGroup,
  Image,
  Button,
} from "react-bootstrap";
import { getAllProductsdoi } from "../../services/sanPhamService";

function SanPhamDoi() {
   const location = useLocation();
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); //
  const toggleContentStyle = {
    maxHeight: expanded ? "100000px" : "0",
    overflow: "hidden",
    transition: "max-height 0.5s ease",
  };
  const [activeFilterLabels, setActiveFilterLabels] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {};
    const labels = [];

    // Các filter đã có của bạn: thuonghieu, loaimay, chatlieu, mucgia, minPrice, maxPrice
    if (params.get("thuonghieu")) {
      const values = params.get("thuonghieu").split(",");
      newFilters.thuonghieu = values;
      labels.push(...values.map((val) => `Thương hiệu: ${val}`));
    }

    if (params.get("loaimay")) {
      const values = params.get("loaimay").split(",");
      newFilters.loaimay = values;
      labels.push(...values.map((val) => `Loại máy: ${val}`));
    }

    if (params.get("chatlieu")) {
      const values = params.get("chatlieu").split(",");
      newFilters.chatlieu = values;
      labels.push(...values.map((val) => `Chất liệu: ${val}`));
    }

    // Mức giá
    const mucgia = params.get("mucgia");
    if (mucgia) {
      const val = mucgia.toLowerCase();
      switch (val) {
        case "duoi2trieu":
          newFilters.minPrice = 0;
          newFilters.maxPrice = 2000000;
          labels.push("Mức giá: Dưới 2 triệu");
          break;
        case "tu2trieuden5trieu":
          newFilters.minPrice = 2000000;
          newFilters.maxPrice = 5000000;
          labels.push("Mức giá: Từ 2 triệu đến 5 triệu");
          break;
        case "tu5trieuden10trieu":
          newFilters.minPrice = 5000000;
          newFilters.maxPrice = 10000000;
          labels.push("Mức giá: Từ 5 triệu đến 10 triệu");
          break;
        case "tu10trieuden20trieu":
          newFilters.minPrice = 10000000;
          newFilters.maxPrice = 20000000;
          labels.push("Mức giá: Từ 10 triệu đến 20 triệu");
          break;
        case "tu20trieuden30trieu":
          newFilters.minPrice = 20000000;
          newFilters.maxPrice = 30000000;
          labels.push("Mức giá: Từ 20 triệu đến 30 triệu");
          break;
        case "tu30trieuden50trieu":
          newFilters.minPrice = 30000000;
          newFilters.maxPrice = 50000000;
          labels.push("Mức giá: Từ 30 triệu đến 50 triệu");
          break;
        case "tu50trieuden100trieu":
          newFilters.minPrice = 50000000;
          newFilters.maxPrice = 100000000;
          labels.push("Mức giá: Từ 50 triệu đến 100 triệu");
          break;
        case "tren100trieu":
          newFilters.minPrice = 100000000;
          labels.push("Mức giá: Trên 100 triệu");
          break;
        default:
          break;
      }
    } else {
      if (params.get("minPrice")) {
        newFilters.minPrice = Number(params.get("minPrice"));
      }
      if (params.get("maxPrice")) {
        newFilters.maxPrice = Number(params.get("maxPrice"));
      }

      if (newFilters.minPrice && newFilters.maxPrice) {
        labels.push(
          `Mức giá: Từ ${newFilters.minPrice.toLocaleString()} đến ${newFilters.maxPrice.toLocaleString()} đ`
        );
      } else if (newFilters.minPrice) {
        labels.push(
          `Mức giá: Từ ${newFilters.minPrice.toLocaleString()} đ trở lên`
        );
      } else if (newFilters.maxPrice) {
        labels.push(`Mức giá: Dưới ${newFilters.maxPrice.toLocaleString()} đ`);
      }
    }

    // Bổ sung filter giảm giá (giamgia)
    if (params.get("giamgia")) {
      const val = params.get("giamgia").toLowerCase();
      newFilters.giamgia = val;
      switch (val) {
        case "duoi10":
        case "dưới 10%":
          labels.push("Giảm giá: Dưới 10%");
          break;
        case "10den20":
        case "10% - 20%":
          labels.push("Giảm giá: 10% - 20%");
          break;
        case "21den30":
        case "21% - 30%":
          labels.push("Giảm giá: 21% - 30%");
          break;
        case "31den50":
        case "31% - 50%":
          labels.push("Giảm giá: 31% - 50%");
          break;
        case "tren50":
        case "trên 50%":
          labels.push("Giảm giá: Trên 50%");
          break;
        default:
          break;
      }
    }

    // Các filter dạng danh sách
    if (params.get("chongnuoc")) {
      const values = params.get("chongnuoc").split(",");
      newFilters.chongnuoc = values;
      labels.push(...values.map((val) => `Chống nước: ${val}`));
    }

    if (params.get("xuatxu")) {
      const values = params.get("xuatxu").split(",");
      newFilters.xuatxu = values;
      labels.push(...values.map((val) => `Xuất xứ: ${val}`));
    }

    if (params.get("kieudang")) {
      const values = params.get("kieudang").split(",");
      newFilters.kieudang = values;
      labels.push(...values.map((val) => `Kiểu dáng: ${val}`));
    }

    if (params.get("duongkinh")) {
      const values = params.get("duongkinh").split(",");
      newFilters.duongkinh = values;
      labels.push(...values.map((val) => `Đường kính: ${val}`));
    }

    if (params.get("sizeday")) {
      const values = params.get("sizeday").split(",");
      newFilters.sizeday = values;
      labels.push(...values.map((val) => `Size dây: ${val}`));
    }

    setFilters(newFilters);
    setActiveFilterLabels(labels);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProductsdoi(filters);
        setProducts(data);

        if (sortOption) {
          sortProducts(sortOption, data);
        } else {
          setSortedProducts(data);
        }
        setPage(1);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setProducts([]);
        setSortedProducts([]);
      }
    };
    fetchData();
  }, [filters, sortOption]);
  const total = Math.ceil(sortedProducts.length / limit);
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [page]);

  const current = sortedProducts.slice((page - 1) * limit, page * limit);




  // Sắp xếp sản phẩm theo tùy chọn
  const sortProducts = (option, list) => {
    let sorted = [...list];
    switch (option) {
      case "Mới nhất":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Giá thấp đến cao":
        sorted.sort((a, b) => a.giaTien - b.giaTien);
        break;
      case "Giá cao đến thấp":
        sorted.sort((a, b) => b.giaTien - a.giaTien);
        break;
      case "Bán chạy":
        sorted.sort((a, b) => b.soLuongBan - a.soLuongBan);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
    setPage(1);
  };

  // Khi đổi tùy chọn sắp xếp
  const handleSort = (option) => {
    setSortOption(option);
    setActiveFilter(null);
    sortProducts(option, products);
  };
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d");
  };

  const toQueryValue = (label, option) => {
    const keepAccentLabels = ["CHẤT LIỆU VỎ", "XUẤT XỨ", "KIỂU DÁNG"];
    let value = option.replace(/\([^)]*\)/g, "").trim();
    if (keepAccentLabels.includes(label)) {
      return value;
    }
    return removeVietnameseTones(value)
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w-]/g, "");
  };

const handleOptionSelect = (filterLabel, selectedValue) => {
  const queryKeyMap = {
    "GIỚI TÍNH": "gioitinh",       // Sẽ bỏ qua xử lý nếu là giới tính vì đã nằm trong path
    "THƯƠNG HIỆU": "thuonghieu",
    "MỨC GIÁ": "mucgia",
    "GIẢM GIÁ": "giamgia",
    "LOẠI MÁY": "loaimay",
    "CHẤT LIỆU VỎ": "chatlieu",
    "SIZE DÂY (cm)": "sizeday",
    "KIỂU DÁNG": "kieudang",
    "XUẤT XỨ": "xuatxu",
    "ĐƯỜNG KÍNH MẶT SỐ (mm)": "duongkinh",
    "CHỐNG NƯỚC (m)": "chongnuoc",
  };

  const key = queryKeyMap[filterLabel];
  if (!key) return;

  const params = new URLSearchParams(location.search);

  if (key !== "gioitinh") {
    // Không set query nếu key là 'gioitinh', vì nó nằm trong pathname
    if (selectedValue) {
      params.set(key, selectedValue);
    } else {
      params.delete(key);
    }
  }

  const gioitinh = 
    filterLabel === "GIỚI TÍNH" && selectedValue
      ? selectedValue.toLowerCase()
      : location.pathname.split("/")[2] || "doi";

  const queryString = params.toString();
  navigate(`/san-pham/${gioitinh}${queryString ? `?${queryString}` : ""}`);
  setActiveFilter(null);
};


  const renderPageNumbers = () =>
    Array.from({ length: total }, (_, i) => i + 1).map((num) => (
      <li key={num} className={`page-item ${page === num ? "active" : ""}`}>
        <button className="page-link" onClick={() => setPage(num)}>
          {num}
        </button>
      </li>
    ));

  const handleFilterClick = (label) => {
    setActiveFilter((prev) => (prev === label ? null : label));
  };

  return (
    <div className="sanpham-container">
      <div className="sanpham-banner" style={{ backgroundImage: `url(https://donghoduyanh.com/images/products/cat/large/couple_watches_header_1743822897.jpg)` }}>
        <div className="breadcrumb-nav">
          <Link to="/">TRANG CHỦ</Link>
          <i className="fas fa-chevron-right"></i>
          <Link to="/dong-ho">ĐỒNG HỒ</Link>
          <i className="fas fa-chevron-right"></i>
          <span className="active">ĐỒNG HỒ ĐÔI</span>
        </div>
      </div>

      <div className="content">
        <p className="italic text-sm text-gray-700 max-w-7xl mx-auto leading-relaxed">
        Tình yêu luôn là thứ cảm xúc đặc biệt hơn bao giờ hết. Đó là sự gắn kết hai trái tim nếm trải mọi cung bậc cảm xúc: đau khổ, buồn, vui, hạnh phúc để có một cái kết viên mãn. Đồng hành trên chặng đường yêu không thể thiếu đi đồng <strong>đồng hồ đôi</strong> - vật chứng tình yêu vừa thiết thực vừa ý nghĩa.<strong style={{ color: "#18AAFF" }}>Đồng hồ đôi</strong>(<strong>đồng hồ cặp</strong>) với đầy đủ kiểu dáng từ đồng hồ cặp thiết kế mỏng nhẹ, thanh lịch, sang trọng hoặc cá tính, thời trang…sẽ đáp ứng mọi sở thích của một đôi tình nhân.
        </p>
{activeFilterLabels.length > 0 && (
  <div style={{ background: "#f0f0f0", padding: "10px", borderRadius: "8px", marginBottom: "1rem", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
    <strong style={{ marginRight: "10px" }}>Đã lọc:</strong>
    {activeFilterLabels.map((label, index) => (
      <span key={index} style={{ background: "#007bff", color: "white", padding: "4px 8px", borderRadius: "12px", fontSize: "0.875rem" }}>{label}</span>
    ))}
    <button onClick={() => { setFilters({}); setActiveFilterLabels([]); setPage(1); navigate(location.pathname); }} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "1rem" }} title="Xóa tất cả bộ lọc">✕</button>
  </div>
)}

        <hr className="my-6 border-t border-gray-300" />

    
        <nav className="filters-nav">
          {filterOptions.map((filter) => (
            <div
              key={filter.label}
              className="filter-wrapper"
              style={{ position: "relative" }}
            >
              <button
                className="filter-button"
                onClick={() => handleFilterClick(filter.label)}
              >
                {filter.label} <i className="fas fa-caret-down text-[10px]"></i>
              </button>

              {activeFilter === filter.label && (
                <div
                  className="dropdown"
                  style={{
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 10,
                  }}
                >
                  <ul>
                    {filter.options.map((opt) => {
                      const queryValue = toQueryValue(filter.label, opt);
                      return (
                        <li
                          key={opt}
                          style={{ cursor: "pointer", padding: "5px 10px" }}
                          onClick={() =>
                            handleOptionSelect(filter.label, queryValue)
                          }
                        >
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <hr className="my-6 border-t border-gray-200" />

        <div className="sorting-container">
          <div className="title">ĐỒNG HỒ ĐÔI</div>
          <div className="sort-wrapper" style={{ position: "relative" }}>
            <button
              className="sort-button"
              onClick={() =>
                setActiveFilter((prev) =>
                  prev === "SẮP XẾP THEO" ? null : "SẮP XẾP THEO"
                )
              }
            >
              {sortOption||"Sắp xếp theo"} <i className="fas fa-caret-down text-[10px]"></i>
            </button>

            {activeFilter === "SẮP XẾP THEO" && (
              <div className="dropdown">
                <ul>
                  <li onClick={() => handleSort("Mới nhất")}>Mới nhất</li>
                  <li onClick={() => handleSort("Giá thấp đến cao")}>
                    Giá thấp đến cao
                  </li>
                  <li onClick={() => handleSort("Giá cao đến thấp")}>
                    Giá cao đến thấp
                  </li>
                  <li onClick={() => handleSort("Bán chạy")}>Bán chạy</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* code tiếp theo ở đây */}
        <div className="container">
          <h3>Danh sách sản phẩm</h3>
          <ProductList products={current} />

          {/* Phân trang */}
          {total > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${page === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => page > 1 && setPage(page - 1)}
                  >
                    &laquo;
                  </button>
                </li>

                {renderPageNumbers()}

                <li className={`page-item ${page === total && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => page < total && setPage(page + 1)}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        <Container className="py-4">
          <div className="star-rating d-flex align-items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <i
                key={value}
                className={`bi ${
                  value <= rating ? "bi-star-fill" : "bi-star"
                } star-icon`}
                onClick={() => setRating(value)}
              ></i>
            ))}
            <div className="rating-label">
              <div className="arrow-left"></div>
              Nhấn vào đây để đánh giá
            </div>
          </div>

          {/* Title */}
          <h1 className="h5 fw-semibold mb-3">
          Đồng Hồ Đôi – Biểu Tượng Của Tình Yêu Và Sự Kết Nối
          </h1>
          {/* Paragraph */}
          <p className="small lh-sm mb-4">
     Bạn đang tìm kiếm một món quà ý nghĩa để dành tặng người thương hoặc muốn cùng "nửa kia" thể hiện sự gắn bó? Đồng hồ cặp đôi chính là lựa chọn hoàn hảo! Không chỉ là thiết bị đo thời gian, đồng hồ đôi còn mang ý nghĩa sâu sắc, tượng trưng cho tình yêu bền vững và sự đồng điệu giữa hai trái tim.
          </p>
          {/* Image 1 */}
          <div className="mb-4">
            <Image
              alt="Đồng hồ đeo trong vòng tay Longines, nam giới mặc áo len xanh đậm, tay đeo đồng hồ mặt tròn dây da đen"
              src="https://donghoduyanh.com/upload_images/images/2025/04/05/calvin-klein_1666777005.jpg"
              fluid
              rounded
            />
            <p className="text-center small mt-1 mb-4">
           Tại Việt Anh Watch, chúng tôi tự hào giới thiệu bộ sưu tập đồng hồ đôi đẹp mắt, chất lượng cao, đáp ứng mọi phong cách và sở thích của các cặp đôi.
            </p>
          </div>
          {/* Paragraph with link */}

          {/* Toggle button and content */}

          <div style={toggleContentStyle} className="small lh-sm text-justify">
            <p className="small lh-sm mb-4">
              Trái Viet Anh Watch, chúng tôi tự hào mang đến bộ sưu tập đồng hồ
              đôi đa dạng, chất lượng cao, được thiết kế để đáp ứng mọi nhu cầu,
              của quý khách hàng hiện đại. Bây giờ, đồng
              hồ đôi chính là sản phẩm công nghệ hoàn hảo nhất thể hiện tình yêu bạn!{" "}
              <Link to="/" className="text-primary" href="#">
                Viet Anh Watch
              </Link>
              .
            </p>
            {/* Tag and highlight */}
           
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Đồng Hồ Đôi – Tại sao là phụ kiện quan trọng?
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
            Dù là kỷ niệm ngày cưới, sinh nhật hay Valentine, đồng hồ đôi luôn là món quà được yêu thích. Một cặp đồng hồ không chỉ thể hiện tình cảm mà còn là lời nhắc nhở về những giây phút quý giá bên nhau. Tại Duy Anh Watch, chúng tôi cam kết mang đến sản phẩm chính hãng, giá cả hợp lý và dịch vụ tận tâm để bạn dễ dàng chọn được cặp đồng hồ ưng ý nhất.
            </p>
            {/* List */}
            {/* Image 2 */}
            <div className="mb-4 position-relative">
              <Image
                alt="Đồng hồ đeo trong vòng tay Tissot đồng hồ nam thép không gỉ, tay người mặc áo sơ mi trắng"
                src="https://donghoduyanh.com/upload_images/images/2025/04/05/category_banner-couple.jpg"
                fluid
                rounded
              />

              <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 text-white small px-2 py-1 rounded-end">
                donghovietanh.com
              </div>
              <div
                className="position-absolute bottom-0 start-25 bg-dark bg-opacity-50 text-white small px-2 py-1 rounded-end"
                style={{ left: "6rem" }}
              >
                Viet ANH WATCH
              </div>
            </div>
       
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
    Việt Anh Watch là địa chỉ đáng tin cậy để bạn khám phá những mẫu đồng hồ đôi đẹp nhất. Với đa dạng thiết kế, chất lượng đảm bảo và chính sách bảo hành rõ ràng, chúng tôi luôn sẵn sàng đồng hành cùng bạn trong việc tìm kiếm món quà hoàn hảo. Hãy ghé thăm danh mục đồng hồ đôi của chúng tôi ngay hôm nay!
            </p>
            {/* Tag and highlight */}
            
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Bộ sưu tập Đồng Hồ Đôi tại Viet Anh Watch
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Tại Viet Anh Watch, chúng tôi luôn mang đến những mẫu đồng hồ đôi
              chất lượng tốt nhất, đa dạng về thiết kế và chủng loại. Ví dụ, bộ
              sưu tập đồng hồ đôi của chúng tôi được thiết kế để đáp ứng mọi sở
              thích từ cổ điển, trẻ trung, đến hiện đại, với nhiều mức giá phù
              hợp.
            </p>
            <p className="small lh-sm mb-4">
              Đồng hồ đôi dây da: Đây là dòng sản phẩm được chú trọng với chất
              lượng quai da thật 100% từ các thương hiệu uy tín hàng đầu. Dây da
              cao cấp, mềm mại và có độ bền lâu năm theo thời gian, tạo nên sự
              sang trọng và lịch lãm cho người đeo. Đây là lựa chọn hoàn hảo cho
              những ai yêu thích phong cách cổ điển, thanh lịch và sang trọng.
            </p>
            <p className="small lh-sm mb-4">
              Đồng hồ đôi dây kim loại: Với thiết kế mạnh mẽ và độ bền vượt
              trội, đồng hồ đôi dây kim loại là lựa chọn lý tưởng cho những
              chàng trai thích phong cách cá tính và năng động. Chất liệu thép
              không gỉ sáng bóng và bền bỉ, kết hợp với các kiểu khóa chắc chắn
              và thiết kế sang trọng, mang đến sự đẳng cấp cho người đeo. Bạn có
              thể đeo đồng hồ dây kim loại này khi đi làm hay đi chơi đều rất
              phù hợp.
            </p>
            {/* Image 3 */}
            <div className="mb-4 position-relative">
              <Image
              style={{width:"100%"}}
                alt="Đồng hồ đeo trong vòng tay đồng hồ nam dây kim loại trên sách bìa da nâu và cốc cafe trắng"
                src="https://donghoduyanh.com/upload_images/images/2025/04/05/header_1_6.jpg"
                fluid
                rounded
              />
              <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 text-white small px-2 py-1 rounded-end">
                donghovietanh.com
              </div>
              <div
                className="position-absolute bottom-0 start-25 bg-dark bg-opacity-50 text-white small px-2 py-1 rounded-end"
                style={{ left: "6rem" }}
              >
                Viet ANH WATCH
              </div>
            </div>
   
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Hướng Dẫn Chọn Đồng hồ đôi Phù Hợp Với Bạn
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Việc chọn đồng hồ phù hợp không chỉ giúp bạn thể hiện cá tính mà
              còn tạo sự thuận tiện khi sử dụng. Dưới đây là những gợi ý rất hữu
              ích giúp bạn chọn ra chiếc đồng hồ đôi phù hợp:
            </p>
            {/* List */}

            {/* Tag and highlight */}
          
            {/* Image 4 */}
            <div className="mb-4">
              <Image
               style={{margin : "0 auto", display: "block", width: "100%"}}
                alt="Đồng hồ đeo trong vòng tay đồng hồ nam dây da đen trên tay người đàn ông mặc áo len xám"
                src="https://donghoduyanh.com/upload_images/images/2025/04/05/Ernest-Borel-Heritage-LE-Banner.jpg"
                fluid
                rounded
              />
  
            </div>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
             Đồng hồ đôi không chỉ là phụ kiện, mà còn là sợi dây gắn kết tình yêu và phong cách của bạn với người ấy. Với bộ sưu tập đa dạng tại Việt Anh Watch, bạn sẽ dễ dàng tìm thấy cặp đồng hồ lý tưởng để cùng nhau viết tiếp câu chuyện đẹp. Đừng chần chừ, hãy chọn ngay một cặp đồng hồ đôi để làm mới tình yêu của bạn!
            </p>
           
            </div>
         
        </Container>
      </div>
      <div className="d-flex justify-content-center mb-5">
        <Button
          style={{ backgroundColor: "#7a664c", border: "none" }}
          className="text-white small px-4"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Mở rộng"}
        </Button>
      </div>
    </div>
  );
}

export default SanPhamDoi;
