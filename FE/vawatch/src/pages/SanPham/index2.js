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
import { getAllProductsnu } from "../../services/sanPhamService";

function SanPhamNu() {
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
        const data = await getAllProductsnu(filters);
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
      : location.pathname.split("/")[2] || "nu";

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
      <div
        className="sanpham-banner"
        style={{
          backgroundImage: `url(https://donghoduyanh.com/images/products/cat/large/dong-ho-nu-chinh-hang_1743823848.jpg)`,
        }}
      >
        <div className="breadcrumb-nav">
          <Link to="/">TRANG CHỦ</Link>
          <i className="fas fa-chevron-right"></i>
          <Link to="/dong-ho">ĐỒNG HỒ</Link>
          <i className="fas fa-chevron-right"></i>
          <span className="active">ĐỒNG HỒ NỮ</span>
        </div>
      </div>

      <div className="content">
        <p className="italic text-sm text-gray-700 max-w-7xl mx-auto leading-relaxed">
          Thế giới đồng hồ nữ chính hãng thời trang đa dạng tại Việt Anh Watch
          sẽ luôn đáp ứng được mọi nhu cầu của phái đẹp. Với những thương hiệu
          đồng hồ Thụy Sỹ nổi tiếng như Longines, Tissot, Mido, Hamilton,
          Frederique Constant, Maurice Lacroix, cùng các thương hiệu đồng hồ
          Nhật bản đã có chỗ đứng vững chắc trên thị trường đồng hồ đeo tay như
          Seiko, Citizen, Orient, Casio...và nhiều thương hiệu uy tín khác, bạn
          sẽ tìm thấy chiếc đồng hồ đeo tay nữ hoàn hảo và phù hợp để tôn lên vẻ
          đẹp của mình
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
          <div className="title">ĐỒNG HỒ NỮ</div>
          <div className="sort-wrapper" style={{ position: "relative" }}>
            <button
              className="sort-button"
              onClick={() =>
                setActiveFilter((prev) =>
                  prev === "SẮP XẾP THEO" ? null : "SẮP XẾP THEO"
                )
              }
            >
              {sortOption|| "Sắp xếp theo"} <i className="fas fa-caret-down text-[10px]"></i>
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
            Các tiêu chí bạn cần biết khi Mua Đồng hồ Nữ
          </h1>
          {/* Paragraph */}
          <p className="small lh-sm mb-4">
            Trong giới phụ kiện dành cho nữ giới, đồng hồ đeo tay nữ không chỉ
            là một phụ kiện thời trang mà còn có thể tạo nên sự khác biệt trong
            phong cách, đồng thời cũng là một biểu tượng của cá tính. Một chiếc
            đồng hồ nữ phù hợp có thể thay đổi hoàn toàn diện mạo của bạn, từ vẻ
            ngoài lịch lãm trong môi trường công sở đến sự mạnh mẽ, năng động
            trong cuộc sống hàng ngày.
          </p>
          {/* Image 1 */}
          <div className="mb-4">
            <Image
              alt="Đồng hồ đeo trong vòng tay Longines, nữ giới mặc áo len xanh đậm, tay đeo đồng hồ mặt tròn dây da đen"
              src="	https://donghoduyanh.com/upload_images/images/2025/04/05/citizen_ew2299-50a_2.jpg"
              fluid
              rounded
            />
            <p className="text-center small mt-1 mb-4">
              Đồng hồ đeo trong vòng tay Longines
            </p>
          </div>
          {/* Paragraph with link */}

          {/* Toggle button and content */}

          <div style={toggleContentStyle} className="small lh-sm text-justify">
            <p className="small lh-sm mb-4">
              Trái Viet Anh Watch, chúng tôi tự hào mang đến bộ sưu tập đồng hồ
              nam đa dạng, chất lượng cao, được thiết kế để đáp ứng mọi nhu cầu,
              sở thích và tính cách của quý khách hàng hiện đại. Bây giờ, đồng
              hồ nam chính là sản phẩm công nghệ hoàn hảo nhất thể hiện cá tính
              và phong cách riêng của bạn!{" "}
              <Link to="/" className="text-primary" href="#">
                Viet Anh Watch
              </Link>
              .
            </p>
            {/* Tag and highlight */}
            <Row className="mb-4 g-2">
              <Col xs="auto">
                <Badge bg="warning" text="dark" className="small px-2 py-1">
                  mẫu mới
                </Badge>
              </Col>
              <Col xs="auto">
                <Badge bg="danger" className="small px-2 py-1">
                  Top 20 hãng đồng hồ nữ nổi tiếng, đáng cấp dành cho phái mạnh
                </Badge>
              </Col>
            </Row>
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Đồng hồ nữ – Tại sao là phụ kiện quan trọng?
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Đối với phái mạnh, đồng hồ nữ không chỉ là một món đồ trang sức
              thể hiện cá tính mà còn là cách để thể hiện bản thân trong mọi
              hoàn cảnh. Dưới đây là những lý do khiến đồng hồ nữ trở thành một
              món phụ kiện thời trang không thể thiếu:
            </p>
            {/* List */}
            <ListGroup as="ul" numbered className="small mb-4">
              <ListGroup.Item as="li">
                Tôn vinh đẳng cấp và sự tinh tế: Một chiếc đồng hồ nữ được chế
                tác tinh xảo, với chất liệu sang trọng sẽ giúp bạn tỏa sáng hơn
                ở bất kỳ nơi nào bạn đến, từ văn phòng công sở đến bữa tiệc sang
                trọng hay những buổi gặp gỡ bạn bè.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Độ bền vượt trội theo thời gian: Đồng hồ tốt có thể đồng hành
                cùng bạn suốt nhiều năm, giữ được vẻ đẹp và độ chính xác trong
                mọi điều kiện.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Thể hiện cá tính riêng: Dù là người yêu thích sự đơn giản hay
                phong cách cá tính, đồng hồ nữ sẽ là điểm nhấn hoàn hảo cho bộ
                trang phục của bạn.
              </ListGroup.Item>
            </ListGroup>
            {/* Image 2 */}
            <div className="mb-4 position-relative">
              <Image
                alt="Đồng hồ đeo trong vòng tay Tissot đồng hồ thép không gỉ, tay người mặc áo sơ mi trắng"
                src="https://donghoduyanh.com/upload_images/images/2025/02/25/tissot-brand-banner.jpg"
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
            <p className="text-center small mb-4">
              Đồng hồ nữ Tissot chính hãng
            </p>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Hơn nữa, đồng hồ nữ còn là cách để bạn hoàn thiện phong cách cá
              nhân. Một bộ vest kín kẽ làm bạn trở nên hoàn hảo hơn khi kết hợp
              với đồng hồ dây da sang trọng và một chiếc túi đựng thẻ đơn giản
              bên trong túi áo khoác sẽ giúp bạn tự tin hơn mỗi ngày.
            </p>
            {/* Tag and highlight */}
            <Row className="mb-4 g-2">
              <Col xs="auto">
                <Badge bg="warning" text="dark" className="small px-2 py-1">
                  mẫu mới
                </Badge>
              </Col>
              <Col xs="auto">
                <Badge bg="danger" className="small px-2 py-1">
                  Top 10 mẫu đồng hồ nữ bán chạy nhất năm 2024
                </Badge>
              </Col>
            </Row>
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Bộ sưu tập Đồng hồ nữ tại Viet Anh Watch
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Tại Viet Anh Watch, chúng tôi luôn mang đến những mẫu đồng hồ nữ
              chất lượng tốt nhất, đa dạng về thiết kế và chủng loại. Ví dụ, bộ
              sưu tập đồng hồ nữ của chúng tôi được thiết kế để đáp ứng mọi sở
              thích từ cổ điển, trẻ trung, đến hiện đại, với nhiều mức giá phù
              hợp.
            </p>
            <p className="small lh-sm mb-4">
              Đồng hồ nữ dây da: Đây là dòng sản phẩm được chú trọng với chất
              lượng quai da thật 100% từ các thương hiệu uy tín hàng đầu. Dây da
              cao cấp, mềm mại và có độ bền lâu năm theo thời gian, tạo nên sự
              sang trọng và lịch lãm cho người đeo. Đây là lựa chọn hoàn hảo cho
              những ai yêu thích phong cách cổ điển, thanh lịch và sang trọng.
            </p>
            <p className="small lh-sm mb-4">
              Đồng hồ nữ dây kim loại: Với thiết kế mạnh mẽ và độ bền vượt trội,
              đồng hồ nữ dây kim loại là lựa chọn lý tưởng cho những chàng trai
              thích phong cách cá tính và năng động. Chất liệu thép không gỉ
              sáng bóng và bền bỉ, kết hợp với các kiểu khóa chắc chắn và thiết
              kế sang trọng, mang đến sự đẳng cấp cho người đeo. Bạn có thể đeo
              đồng hồ dây kim loại này khi đi làm hay đi chơi đều rất phù hợp.
            </p>
            {/* Image 3 */}
            <div className="mb-4 position-relative">
              <Image
                alt="Đồng hồ đeo trong vòng tay đồng hồ nam dây kim loại trên sách bìa da nâu và cốc cafe trắng"
                src="https://donghoduyanh.com/upload_images/images/2025/02/25/Faberge_watches_banner.jpg"
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
            <p className="text-center small mb-4">
              Đồng hồ nữ Tissot chính hãng
            </p>
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Hướng Dẫn Chọn Đồng hồ nữ Phù Hợp Với Bạn
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Việc chọn đồng hồ phù hợp không chỉ giúp bạn thể hiện cá tính mà
              còn tạo sự thuận tiện khi sử dụng. Dưới đây là những gợi ý rất hữu
              ích giúp bạn chọn ra chiếc đồng hồ nữ phù hợp:
            </p>
            {/* List */}
            <ListGroup as="ul" numbered className="small mb-4">
              <ListGroup.Item as="li">
                Kích thước mặt số: Kích thước mặt đồng hồ nữ thường dao động từ
                38–46mm, phù hợp với dây đeo của đa số nữ giới. Nếu bạn có cổ
                tay nhỏ, hãy chọn mặt số 38-42mm để tạo cảm giác cân đối. Ngược
                lại, cổ tay to, lớn hơn 42-44mm sẽ là lựa chọn hoàn hảo hơn để
                nổi bật.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Phong cách cá nhân: Bạn là người yêu thích sự đơn giản hay có gu
                thời trang mạnh mẽ? Đồng hồ dây da sẽ phù hợp với sự trẻ trung,
                tinh tế và cổ điển hơn, trong khi đồng hồ dây kim loại lại mang
                đến sự sang trọng và hiện đại.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Chất liệu và tính năng: Nếu bạn thường xuyên làm việc ngoài trời
                hoặc cần một chiếc đồng hồ có khả năng chống nước tốt, hãy ưu
                tiên chọn đồng hồ có chất liệu bền bỉ và tính năng chống nước
                cao.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Màu sắc: Các tông màu trung tính như đen, xanh biển, vàng hoặc
                nâu thường dễ phối đồ và phù hợp với nhiều hoàn cảnh. Tuy nhiên,
                nếu bạn muốn tạo điểm nhấn, màu sắc nổi bật cũng là một lựa chọn
                thú vị.
              </ListGroup.Item>
            </ListGroup>
            {/* Tag and highlight */}
            <Row className="mb-4 g-2">
              <Col xs="auto">
                <Badge bg="warning" text="dark" className="small px-2 py-1">
                  mẫu mới
                </Badge>
              </Col>
              <Col xs="auto">
                <Badge bg="danger" className="small px-2 py-1">
                  Top 20 mẫu đồng hồ cơ nam đẹp và cao cấp tại Đồng hồ Viet Anh
                </Badge>
              </Col>
            </Row>
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3">
              Đồng hồ nữ – món quà ý nghĩa cho phái mạnh
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Đồng hồ nữ không chỉ là món đồ trang sức thể hiện cá tính mà còn
              là món quà tuyệt vời để dành tặng bạn bè, người thân, đồng nghiệp
              hay đối tác. Với chất lượng và chính hãng từ Viet Anh Watch, không
              chỉ là vẻ ngoài mà còn giúp thể hiện sự quan tâm và tôn trọng về
              phong cách.
            </p>
            {/* Highlight */}
            <p className="small text-center text-danger fw-semibold mb-4">
              Top 10+ những mẫu đồng hồ nữ đẹp trẻ trung cho các chàng nhận dịp
              sinh nhật
            </p>
            {/* Section Title */}
            <h2 className="h6 fw-semibold mb-3 text-center">
              Tại Sao nên chọn mua Đồng hồ nữ tại Viet Anh Watch?
            </h2>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Viet Anh Watch không chỉ cung cấp đồng hồ nữ chính hãng với giá
              tốt mà còn mang đến trải nghiệm mua sắm tiện lợi và đáng tin cậy
              nhất trên thị trường hiện nay. Chúng tôi cam kết:
            </p>
            {/* List */}
            <ListGroup as="ul" numbered className="small mb-4">
              <ListGroup.Item as="li">
                Sản phẩm chính hãng 100%. Mỗi chiếc đồng hồ nữ đều có nguồn gốc
                rõ ràng, đảm bảo chất lượng và chứng nhận về tính bảo hành chính
                hãng.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Giá cả cạnh tranh. Chúng tôi mang đến mức giá hợp lý, phù hợp
                với nhiều phân khúc khách hàng.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Chính sách bảo hành rõ ràng. Đảm bảo thời gian dịch vụ và hỗ trợ
                khách hàng tận tâm khi cần sử dụng.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Đội ngũ tư vấn chuyên nghiệp. Sẵn sàng hỗ trợ bạn chọn mẫu đồng
                hồ nam phù hợp nhất với phong cách và sở thích cá nhân.
              </ListGroup.Item>
            </ListGroup>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Với thiết kế đồng hồ nữ cao cấp sang trọng và chất lượng vượt
              trội, bạn hoàn toàn có thể yên tâm khi mua tại Viet Anh Watch. Đội
              ngũ bán hàng tận tâm, chuyên nghiệp sẽ giúp bạn chọn được chiếc
              đồng hồ phù hợp nhất với phong cách, cá tính hay tặng quà tặng.
              Đồng hồ Viet Anh Auto là lựa chọn hoàn hảo cho các chàng trai.
            </p>
            {/* Image 4 */}
            <div className="mb-4">
              <Image
                alt="Đồng hồ đeo trong vòng tay đồng hồ nam dây da đen trên tay người đàn ông mặc áo len xám"
                src="https://donghoduyanh.com/upload_images/images/2025/02/25/he-thong-cua-hang-donghoduyanh.jpg"
                fluid
                rounded
              />
              <p className="text-center small mt-1 mb-4">
                Đồng hồ đeo tay nữ chính hãng
              </p>
            </div>
            {/* Paragraph */}
            <p className="small lh-sm mb-4">
              Đồng hồ nữ không chỉ là một phụ kiện, mà còn là người bạn đồng
              hành giúp bạn tỏa sáng trong các tình huống, phong cách và sự kiện
              từ trong môi trường làm việc đến cuộc sống đời thường. Với sự đa
              dạng về mẫu mã và chất lượng từ Viet Anh Watch, bạn có thể dễ dàng
              tìm thấy chiếc đồng hồ phù hợp với mọi sở thích và nhu cầu của
              mình một cách dễ dàng.
            </p>
            <p className="small lh-sm mb-4">
              Đồng thời, hãy lựa chọn phụ kiện phù hợp để đồng hồ nữ của bạn trở
              nên cá tính và nổi bật nhất. Đó là lý do tại sao Viet Anh Watch
              luôn cập nhật những mẫu đồng hồ đa dạng, phù hợp với mọi phong
              cách và sở thích của khách hàng.
            </p>
            {/* Related links */}
            <div className="small text-primary mb-4">
              <Link to="/8-quy-tac-deo-dong-ho-nam" className="d-block mb-1">
                8 quy tắc quan trọng nhất khi đeo đồng hồ nữ
              </Link>
              <Link
                to="/top-20-dong-ho-nam-hang-sang-2023"
                className="d-block mb-1"
              >
                Top 20 mẫu đồng hồ nữ hạng sang đắt giá nhất 2023 bán chạy thị
                trường
              </Link>
              <Link
                to="/huong-dan-lua-chon-dong-ho-nam"
                className="d-block mb-1"
              >
                Hướng dẫn lựa chọn đồng hồ nữ chính hãng, phù hợp với mọi phong
                cách
              </Link>
              <Link
                to="/top-15-hang-dong-ho-nam-ban-chay"
                className="d-block mb-1"
              >
                Top 15 hãng đồng hồ nữ bán chạy nhất hiện đại và được yêu thích
                nhất hiện nay
              </Link>
              <Link to="/top-15-dong-ho-the-thao-nam" className="d-block">
                Top 15+ mẫu đồng hồ thể thao nam chất lượng, bền bỉ, giá tốt
                nhất hiện đại và được yêu thích nhất hiện nay
              </Link>
            </div>
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

export default SanPhamNu;
