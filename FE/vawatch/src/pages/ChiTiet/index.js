import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../../services/sanPhamService";
import { brand, tinhThanh } from "../../components/data/brand";
import { Link as ScrollLink } from "react-scroll"
import "./chiTiet.scss";
import ProductSlider from "../../components/PD/ProductSlider";
import ThuongHieu from "../ThuongHieu";
import { toast } from 'react-toastify';

function ChiTietSanPham( ) {

const handleAddToCart = () => {
  // Tính giá sau giảm giá
  const salePrice = Math.floor(product.giaTien * (1 - (product.giamGia / 100 || 0)));

  // Lấy tài khoản hiện tại nếu đã đăng nhập
  const taiKhoan = localStorage.getItem("taiKhoan");
  const key = taiKhoan ? `gioHang_${taiKhoan}` : "gioHang_tam";

  // Lấy giỏ hàng từ localStorage theo tài khoản hoặc giỏ tạm
  const cart = JSON.parse(localStorage.getItem(key)) || [];

  // Tìm sản phẩm trong giỏ
  const existingIndex = cart.findIndex((item) => item.maSP === product.maSP);

  const cartItem = {
    maSP: product.maSP,
    tenSP: product.tenSP,
    giaTien: salePrice, // giá sau giảm
    quantity: 1,
    anhSP: product.anhSP || "",
    // thuongHieu: product.Thuonghieu || "",
  };

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  // Lưu lại giỏ hàng
  localStorage.setItem(key, JSON.stringify(cart));

  toast.success("Đã thêm sản phẩm vào giỏ hàng!");
};


  const { id } = useParams(); // Lấy mã sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("mota");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductById(id); // API lấy theo id
      setProduct(data);
    };
    fetchData();
  }, [id]);

  const formatCurrency = (value) => value.toLocaleString("vi-VN");

  const getProductImage = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return `http://localhost:3002${images[0]}`;
    }
    return null;
  };

  if (!product) return <p>Đang tải sản phẩm...</p>;

  const discount = product.giamGia || 0;
  const salePrice = discount
    ? Math.floor(product.giaTien * (1 - discount / 100))
    : product.giaTien;
  function findBrandIconByName(brandName) {
    if (!brandName) return null;
    const brandObj = brand.find(
      (brand) => brand.name.toLowerCase() === brandName.toLowerCase()
    );
    return brandObj ? brandObj.icon : null;
  }

  if (!product) return <p>Đang tải sản phẩm...</p>;

  // Ở đây product đã được khởi tạo, nên an toàn để dùng
  const brandIcon = findBrandIconByName(product.Thuonghieu);
  return (
    <div className="container py-4">
      <div className="row">
        {/* Cột 1: Hình ảnh sản phẩm */}
        <div className="col-md-4 position-relative">

          <img
            src={getProductImage(product.anhSP)}
            alt={product.tenSP}
            className="img-fluid"
          />
          {discount > 0 && <div className="badge-discount">-{discount}%</div>}

          {/* Thông tin - Bảo hành - Chọn size */}
          <div className="d-flex justify-content-center gap-2 p-1 bg-white mt-2" style={{ marginLeft: "-105px" }}>
            <div className="d-flex flex-column align-items-center text-center p-1 border rounded" style={{ width: "90px" }}>
              <ScrollLink
                to="mota-tab"
                smooth={true}
                duration={500}
                onClick={() => setActiveTab("mota")}
              >
                <img
                  src="https://donghoduyanh.com/images/config/note_1726249088.jpg.webp"
                  alt="Thông tin sản phẩm"
                  width="60"
                  height="60"
                  className="mb-1"
                />
                <span className="text-secondary" style={{ fontSize: "11px" }}>Thông tin</span>
              </ScrollLink>
            </div>

            <div className="d-flex flex-column align-items-center text-center p-1 border rounded" style={{ width: "90px" }}>
              <ScrollLink
                to="baohanh-tab"
                smooth={true}
                duration={500}
                onClick={() => setActiveTab("baohanh")}
              >
                <img
                  src="https://donghoduyanh.com/images/config/chinh-hang_1726249088.jpg.webp"
                  alt="Bả"
                  width="60"
                  height="60"
                  className="mb-1"
                />
                <span className="text-secondary" style={{ fontSize: "11px" }}> Bảo hành</span>
              </ScrollLink>
            </div>

            <div className="d-flex flex-column align-items-center text-center p-1 border rounded" style={{ width: "90px" }}>
              <ScrollLink
                to="huongdan-tab"
                smooth={true}
                duration={500}
                onClick={() => setActiveTab("huongdan")}
              >
                <img
                  src="https://donghoduyanh.com/images/config/size_1726249088.jpg.webp"
                  alt="Hướng dẫn chọn size"
                  width="60"
                  height="60"
                  className="mb-1"
                />
                <span className="text-secondary" style={{ fontSize: "11px" }}>Chọn size</span>
              </ScrollLink>
            </div>
          </div>

          {/* Nút Thích và Chia sẻ */}
          <div className="d-flex justify-content-center gap-2 mt-2" style={{ marginLeft: "-105px" }}>
            <button
              type="button"
              className="d-flex align-items-center bg-primary text-white px-2 py-1 rounded"
              style={{ fontSize: "12px" }}
            >
              <i className="fab fa-facebook-f me-1" style={{ fontSize: "12px" }}></i>
              Thích 2
            </button>
            <button
              type="button"
              className="d-flex align-items-center bg-primary text-white px-2 py-1 rounded"
              style={{ fontSize: "12px" }}
            >
              <i className="fab fa-facebook-f me-1" style={{ fontSize: "12px" }}></i>
              Chia sẻ 2
            </button>
          </div>
        </div>

        {/* Cột 2: Khuyến mãi */}
        <div className="col-md-4">
          {brandIcon && <div className="text-center mb-2"><img src={brandIcon} alt={product.Thuonghieu} title={product.Thuonghieu} style={{ width: "80px", height: "auto", objectFit: "contain" }} /></div>}

          <h4>{product.tenSP}</h4>
          <p>
            Mã sản phẩm: <strong>{product.maSP}</strong>
          </p>
          <p>Loại máy: {product.Loaimay}</p>
          <p>
            Đường kính:
            {product.Duongkinh || "N/A"}
          </p>
          <h6 className="text-success fw-bold fs-5 d-flex align-items-center mb-2">
            <span className="me-2" ><i className="fa-light fa-circle-check fa-lg" style={{ color: "#27d33b"}}></i></span> SẴN HÀNG
          </h6>

          <div className="border p-3 rounded shadow-sm bg-white mb-3 ">
            <div className="small lh-base">
              <p className="text-danger fw-bold mb-2">KHUYẾN MÃI</p>
              <ul className="list-disc ps-3 mb-3 text-dark">
                <li>
                  <span className="text-danger fw-bold">Giảm 10%</span> toàn
                  bộ thương hiệu <strong className="text-primary">Longines</strong> từ{" "}
                  <strong className="text-primary">5.5 - 8.6.2025</strong>
                </li>
                <li>
                  <span className="text-success"><i className="fa-regular fa-check" style={{ color: "#27d33b"}}></i></span> Giảm{" "}
                  <strong className="text-primary">40%</strong> khi mua sản phẩm thứ 2 là đồng hồ{" "}
                  <strong className="text-primary">Casio</strong>
                </li>
                <li>
                  <span className="text-success"><i className="fa-regular fa-check" style={{ color: "#27d33b"}}></i></span> Giảm{" "}
                  <strong className="text-primary">25%</strong> khi mua sản phẩm thứ 2 là đồng hồ{" "}
                  <strong className="text-primary">Claude Bernard, Edox, Titoni</strong>
                </li>
                <li>
                  <span className="text-success"><i className="fa-regular fa-check" style={{ color: "#27d33b"}}></i></span> Giảm{" "}
                  <strong className="text-primary">20%</strong> khi mua sản phẩm thứ 2 là đồng hồ{" "}
                  <strong className="text-primary">DW, Olym Pianus, Fossil, Michael Kors</strong>
                </li>
                <li>
                  <span className="text-success"><i className="fa-regular fa-check" style={{ color: "#27d33b"}}></i></span> Giảm{" "}
                  <strong className="text-primary">15%</strong> khi mua sản phẩm thứ 2 là đồng hồ{" "}
                  <strong className="text-primary">
                    Longines, Tissot, Hamilton, Mido, Certina, Seiko
                  </strong>
                </li>
                <li>
                  <span className="text-success"><i className="fa-regular fa-check" style={{ color: "#27d33b"}}></i></span> Giảm{" "}
                  <strong className="text-primary">20%</strong> khi mua sản phẩm thứ 2 là{" "}
                  <strong className="text-primary">Đồng Hồ Treo Tường, Để Bàn</strong> có giá niêm yết
                  từ <span className="text-danger fw-bold">2 triệu</span> trở
                  lên
                </li>
                <li>
                  <span className="text-success"><i className="fa-regular fa-check" style={{ color: "#27d33b"}}></i></span> Ưu đãi{" "}
                  <strong className="text-primary">MUA 1 TẶNG 1</strong> đồng hồ đeo tay dưới{" "}
                  <strong className="text-primary">10 Triệu</strong> (
                  <RouterLink
                    to="/#"
                    className="text-primary text-decoration-underline"
                  >
                    Xem chi tiết tại đây
                  </RouterLink>
                  )
                </li>
              </ul>

              <div className="mt-3">
                <p className="fw-semibold">
                  🎁 Tặng ngay 1 trong 2 phần quà sau khi mua đồng hồ cơ{" "}
                  <strong className="text-primary">Longines</strong> (Số lượng có hạn):
                </p>
                <ol className="ps-3 mt-2">
                  <li>
                    Tặng 01 đồng hồ treo tường <strong className="text-primary">SEIKO</strong> hoặc{" "}
                    <strong className="text-primary">RHYTHM</strong> trị giá lên đến{" "}
                    <strong className="text-primary">1 triệu đồng</strong>
                  </li>
                  <li>
                    Tặng 01 dây <strong className="text-primary">ZRC</strong> thương hiệu Pháp trị giá
                    lên đến <strong className="text-primary">700.000đ</strong>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="row g-2">
            <div className="col-sm-8">
              <input
                type="text"
                placeholder="Để lại số điện thoại..."
                className="form-control"
              />
            </div>
            <div className="col-sm-4">
              <select className="form-select">
                <option>Tỉnh/Thành Phố</option>
                {tinhThanh.map((tinh, index) => (
                  <option key={index} value={tinh}>
                    {tinh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="mt-2 btn btn-dark fw-semibold px-5 py-2 w-100">
            GỬI
          </button>
        </div>

        {/* Cột 3: Nút hành động */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm mb-4">
            <h6 className="text-muted mb-1">
              Giá gốc: <del>{formatCurrency(product.giaTien)}₫</del>
            </h6>
            <h5 className="text-danger mb-3">
              Giá KM: {formatCurrency(salePrice)}₫
            </h5>
            <span className="text-muted mb-1">
              (Giá trên đã bao gồm VAT)
            </span>

            <div className="mb-3 d-flex flex-column gap-2">
              <button className="btn btn-danger" onClick={handleAddToCart}>Giỏ hàng</button>
              <button className="btn btn-primary">Trả góp qua thẻ</button>
              <button className="btn btn-dark">Tư vấn miễn phí</button>
            </div>

            <div className="d-flex align-items-center mt-2 text-muted">
              <i className="bi bi-telephone-fill me-2"></i>
              <span>
                Hoặc mua hàng qua điện thoại:
                <br />
                <strong>024.3991.8668</strong>
              </span>
            </div>
          </div>

          {/* Chứng nhận chính hãng */}
          <div className="w-100" style={{ maxWidth: "320px" }}>
            <h1
              className=" text-white fs-5 fw-normal px-3 py-2 mb-3"
              style={{ backgroundColor: "#7a6247" }}
            >
              CHỨNG NHẬN CHÍNH HÃNG
            </h1>
            <img
              // src="https://dongho24h.com/upload/1_19-TRUST_BRAND.jpg"
              src="/IMG/CNhan.jpg"
              alt="Certificate in a wooden frame with Vietnamese text and logos"
              className="img-fluid"
              style={{ objectFit: "contain" }}
              width="400"
              height="400"
            />
          </div>
        </div>



      </div>
      <div className="row text-center mt-5 bg-light p-4">
        <div className="col-md-3">
          <i class="fa-light fa-award fa-flip fa-2xl"></i> 100% HÀNG CHÍNH HÃNG
        </div>
        <div className="col-md-3">
          <i class="fa-sharp fa-light fa-truck fa-bouncea fa-2xl"></i> MỄN PHÍ
          VẬN CHUYỂN
        </div>
        <div className="col-md-3">
          <i class="fa-solid fa-badge-check fa-beat fa-2xl"></i> BẢO HÀNH 5 NĂM
        </div>
        <div className="col-md-3">
          <i class="fa-regular fa-square-7 fa-flip fa-2xl"></i> Đổi hàng trong 7
          ngày
        </div>
      </div>

      <div className="thongtin-container">
        {/* Tabs */}
        <div className="tab-header">
          <button
            className={`tab-item ${activeTab === "mota" ? "active" : ""}`}
            onClick={() => setActiveTab("mota")}
          >
            MÔ TẢ CHI TIẾT
          </button>
          <button
            className={`tab-item ${activeTab === "baohanh" ? "active" : ""}`}
            onClick={() => setActiveTab("baohanh")}
          >
            CHẾ ĐỘ BẢO HÀNH
          </button>
          <button
            className={`tab-item ${activeTab === "huongdan" ? "active" : ""}`}
            onClick={() => setActiveTab("huongdan")}
          >
            HƯỚNG DẪN SỬ DỤNG
          </button>
        </div>

        {/* Nội dung tab */}
        <div className="tab-content">
          <div id="mota-tab">
            {activeTab === "mota" && (
              <div id="mota-tab">
                <h4 className="section-title">THÔNG TIN SẢN PHẨM</h4>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <th>Loại máy:</th>
                      <td>{product.Loaimay || "N/A"}</td>
                      <th>Kiểu dáng:</th>
                      <td>{product.Kieudang || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Đường kính:</th>
                      <td>{product.Duongkinh || "N/A"}</td>
                      <th>Size dây:</th>
                      <td>{product.Sizeday || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Chất liệu:</th>
                      <td>{product.Chatlieu || "N/A"}</td>
                      <th>Chống nước:</th>
                      <td>{product.Chongnuoc}</td>

                    </tr>
                    <tr>
                      <th>Thương hiệu:</th>
                      <td>{product.Thuonghieu}</td>
                      <th>Bảo hành chính hãng:</th>
                      <td>1 năm quốc tế</td>
                    </tr>
                    <tr>
                      <th>Xuất xứ:</th>
                      <td>{product.Xuatxu}</td>
                      <th>Bảo hành cửa hàng:</th>
                      <td>
                        5 năm (đã bao gồm Bảo hành Quốc tế).
                        <br />
                        Thay pin miễn phí trọn đời.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
          <div id="baohanh-tab">
            {activeTab === "baohanh" && (
              <article class="container">
                <p class="mb-2 text-uppercase fw-bold text-primary">
                  Chi tiết về chế độ bảo hành khi mua đồng hồ tại Duy Anh Watch
                </p>
                <p class="mb-3">
                  Theo chính sách bảo hành của các hãng đồng hồ, tất cả các đồng
                  hồ chính hãng bán ra đều kèm theo 01 thẻ/ sổ/ giấy bảo hành
                  chính hãng (Quốc tế) có giá trị bảo hành theo thời gian qui định
                  của từng hãng đồng hồ khác nhau.
                </p>
                <p class="mb-4">
                  Mỗi thẻ/ sổ/ giấy bảo hành chỉ được phát hành kèm theo mỗi chiếc
                  đồng hồ bán ra một lần duy nhất và không cấp lại dưới bất kỳ
                  hình thức nào
                </p>

                <div class="text-center mb-4">
                  <img
                    src="https://donghoduyanh.com/upload_images/images/2024/12/27/warranty(1).png.jpg"
                    class="img-fluid mb-4"
                    alt="#"
                    width="900"
                    height="300"
                  />
                </div>

                <p class="mb-2 text-uppercase fw-bold text-primary">
                  Bảo hành chính hãng (bảo hành quốc tế)
                </p>
                <p class="mb-3">
                  Bảo hành Chính hãng (hầu hết là Bảo hành quốc tế) là chế độ Bảo
                  hành do nhà sản xuất (hãng đồng hồ) cung cấp cho tất cả sản phẩm
                  do chính họ sản xuất (sản phẩm chính hãng). Khi Quý khách mua
                  đồng hồ chính hãng thì đồng hồ sẽ luôn đi kèm theo chế độ này
                  (biểu thị bằng sổ/thẻ/giấy/... do nhà sản xuất cung cấp).
                </p>
                <p class="fw-bold mb-1">
                  Đồng hồ có Bảo hành chính hãng sẽ được đảm bảo những quyền lợi
                  sau:
                </p>
                <p class="fw-bold mb-1">
                  1. Được tiếp nhận Bảo hành theo quy định của nhà sản xuất tại
                  các Trung tâm Bảo hành chính hãng và hệ thống Đại lý Chính thức
                  nơi Quý khách mua hàng.
                </p>
                <p class="mb-3">
                  Ví dụ: Quý khách mua đồng hồ Tissot tại Duy Anh Watch thì sẽ
                  được tiếp nhận bảo hành tại Duy Anh Watch và các Trung tâm Bảo
                  hành chính hãng của Tissot.
                </p>
                <p class="fw-bold mb-1">
                  2. Được đặt mua các linh kiện, phụ kiện chính hãng (máy, chi
                  tiết máy, dây, khóa, kính,...) theo quy định của từng hãng (ngay
                  cả khi đã hết thời hạn bảo hành).
                </p>
                <p class="mb-3">
                  Các hãng có quyền từ chối bán các linh kiện phụ kiện chính hãng
                  nếu sản phẩm của Quý Khách không có bảo hành chính hãng với mục
                  đích phòng chống hàng giả, hàng nhái, hàng dựng nhằm bảo vệ uy
                  tín chung của thương hiệu và toàn thể khách hàng tin dùng sản
                  phẩm chính của thương hiệu đó.
                </p>
                <p class="fw-bold mb-1">
                  3. Bảo hành chính hãng là minh chứng cho tính chính hãng của sản
                  phẩm.
                </p>
                <p class="mb-3">
                  Hãng không bảo hành cho hàng giả nên sản phẩm có bảo hành chính
                  hãng chắc chắn là sản phẩm chính hãng. Đây là đặc điểm cơ bản,
                  đơn giản nhất và chính xác tuyệt đối để phân biệt đồng hồ chính
                  hãng trong bối cảnh hàng giả ngày càng tinh vi.
                </p>
                <p class="fw-bold mb-1">
                  4. Bảo hành chỉ có giá trị khi đồng hồ có thẻ/ sổ/ giấy bảo hành
                  chính thức đi kèm.
                </p>
                <p class="mb-4">
                  Thẻ/ sổ/ giấy bảo hành phải được ghi đầy đủ và chính xác các
                  thông tin như: Mã số đồng hồ, mã dây đồng hồ (nếu có), địa chỉ
                  bán, ngày mua hàng, ...Thẻ/ sổ/ giấy bảo hành phải được đóng dấu
                  của Đại lý ủy quyền chính thức hoặc của hãng bán ra.
                </p>
                <div class="text-center mb-4">
                  <img
                    src="https://donghoduyanh.com/upload_images/images/2024/12/27/Warranty(1).jpg"
                    class="img-fluid mb-4"
                    alt="#"
                    width="900"
                    height="300"
                  />
                </div>

                <p class="small mb-3 text-dark">
                  <span class="fw-bold">
                    Thời gian bảo hành của đồng hồ được tính kể từ ngày mua ghi
                    trên thẻ/ sổ/ giấy bảo hành và không được gia hạn sau khi hết
                    thời hạn bảo hành. Cụ thể như sau:
                  </span>
                  <br />
                  - Thời hạn bảo hành theo tiêu chuẩn Quốc tế của các hãng đồng hồ
                  Nhật Bản là 1 năm (riêng đối với đồng hồ Orient Star là 2 năm).
                  Bao gồm các thương hiệu: Seiko, Citizen, Orient.
                  <br />
                  - Thời hạn bảo hành theo tiêu chuẩn Quốc tế của các hãng Đồng hồ
                  Thụy Sỹ là 2 năm (riêng đối với dòng máy Chronometer của Tissot,
                  Mido là 3 năm). Bao gồm các thương hiệu: Longines, Mido, Tissot,
                  Calvin Klein, Frederique Constant, Certina, Claude Bernard,
                  Rotary, Charnol, Candino.
                  <br />- Các thương hiệu khác có chế độ bảo hành riêng như sau: 2
                  năm đối với thương hiệu Daniel Wellington, Freelook, Olympia
                  Star, Olym Pianus và bảo hành máy trọn đời đối với thương hiệu
                  Skagen.
                </p>

                <p class="small text-danger fw-bold mb-3">
                  Lưu ý:
                  <br />
                  1. Chỉ bảo hành miễn phí cho trường hợp hư hỏng về máy và các
                  linh kiện bên trong của đồng hồ khi được xác định là do lỗi của
                  nhà sản xuất.
                  <br />
                  2. Chỉ bảo hành, sửa chữa hoặc thay thế mới cho các linh kiện
                  bên trong đồng hồ. Không thay thế hoặc đổi bằng 1 chiếc đồng hồ
                  khác.
                  <br />
                  Đặc thù của đồng hồ là không có kết nối với mạng máy tính bên
                  ngoài nên không thể áp dụng Bảo hành điện tử như điện thoại, máy
                  tính, ... Quý khách vui lòng lưu trữ, bảo quản kỹ lưỡng thẻ/ sổ/
                  giấy bảo hành để được hưởng đầy đủ quyền lợi bảo hành cam kết
                  mua hàng. Duy Anh và các Trung tâm bảo hành Quốc tế của hãng có
                  quyền từ chối bảo hành khi Quý khách không cung cấp được thẻ/
                  sổ/ giấy bảo hành Quốc tế đi kèm sản phẩm.
                </p>

                <p class="mb-2 text-uppercase fw-bold text-primary">
                  Chính sách bảo hành riêng của đồng hồ Duy Anh
                </p>
                <p class="mb-4">
                  Bắt đầu từ ngày 01/09/2018, khi mua đồng hồ tại Duy Anh (trừ
                  đồng hồ treo tường, đồng hồ để bàn, đồng hồ thông minh), Quý
                  khách còn nhận được các chính sách bảo hành khác, cụ thể như
                  sau:
                  <br />
                  - Bảo hành máy đồng hồ trong thời hạn 5 năm kể từ ngày mua hàng:
                  miễn phí công lắp đặt, sửa chữa, kiểm tra chống nước, cân chỉnh
                  nhanh chóng, giao trả đồng hồ bảo hành,...
                  <br />
                  - Miễn phí thay linh kiện lần đầu tiên và giảm 50% cho các lần
                  thay kế tiếp
                  <br />
                  - Miễn phí lau dầu, bảo dưỡng 5 năm đối với đồng hồ cơ (trừ các
                  dòng đồng hồ Kinetic, Auto Quartz, Hybrid - đồng hồ thông minh
                  máy cơ)
                  <br />
                  - Miễn phí thay pin trọn đời đối với đồng hồ pin (ngoại trừ các
                  dòng đồng hồ Eco-Drive, Solar, Kinetic, Auto Quartz, đồng hồ
                  thông minh)
                  <br />
                  - Miễn phí đánh bóng kính cứng đồng hồ trong vòng 06 tháng kể từ
                  ngày mua
                  <br />- Tặng ngay 01 dây ZRC(ROCHET) (trị giá 500.000 VNĐ) nếu
                  dây nguyên bản bị hỏng trong vòng 06 tháng(Áp dụng cho đồng hồ
                  có giá niêm yết từ 5.000.000VNĐ trở lên).
                </p>

                <p class="small text-danger fw-bold mb-3">
                  () Đã áp dụng từ ngày 01/09/2015
                </p>

                <p class="small text-danger mb-4">
                  <span class="fw-bold">Lưu ý :</span>
                  <br />
                  Chế độ bảo hành mở rộng này đi kèm giấy bảo hành do Đồng hồ Duy
                  Anh cấp khi Quý khách mua hàng. Quý khách vui lòng bảo quản các
                  giấy tờ liên quan và cung cấp cho Duy Anh khi có nhu cầu sử dụng
                  ưu đãi. Duy Anh có quyền từ chối cung cấp dịch vụ ưu đãi theo
                  cam kết nếu khách hàng không cung cấp được các giấy tờ liên
                  quan.
                </p>

                <p class="mb-2 text-uppercase fw-bold text-primary">Không</p>
                <p class="mb-5">
                  - Không bảo hành phần bên ngoài của đồng hồ như: vỏ đồng hồ, mặt
                  kính, dây đồng hồ, khóa đồng hồ, trừ trường hợp lỗi kỹ thuật do
                  nhà sản xuất thông báo.
                  <br />
                  - Không bảo hành cho những hư hại gián tiếp của việc sử dụng
                  không đúng cách của người sử dụng như: đeo đồng hồ khi xông hơi,
                  tắm nước nóng, đồng hồ tiếp xúc với các loại nước hoa, mỹ phẩm
                  hay các loại hoá chất, axit, chất tẩy rửa có độ ăn mòn cao....
                  <br />
                  - Không bảo hành cho những đồng hồ đã bị sửa chữa tại những nơi
                  không phải là trung tâm bảo hành được hãng chỉ định chính thức
                  hoặc khách hàng tự ý sửa chữa.
                  <br />- Không bảo hành cho đồng hồ bị hư hỏng do ảnh hưởng của
                  thiên tai, hỏa hoạn, lũ lụt, tai nạn hoặc có tính gây hư hỏng
                  ...
                </p>
              </article>
            )}
          </div>

          <div id="huongdan-tab">
            {activeTab === "huongdan" && (
              <div>
                <h4 className="section-title">HƯỚNG DẪN SỬ DỤNG</h4>
                <article class="container">
                  <p class="mb-2 text-uppercase fw-bold text-primary">
                    I. VIDEO HƯỚNG DẪN CÁCH CHỈNH NGÀY, GIỜ CHO ĐỒNG HỒ ĐEO TAY
                  </p>
                  <p class="mb-3">
                    <strong>
                      - Đối với đồng hồ có 2 kim (giờ/phút) và đồng hồ 3 kim
                      (giờ/phút/giây):
                    </strong>{" "}
                    Bạn kéo nhẹ nút điều chỉnh ra 1 nấc để chỉnh giờ phút.
                    <br />
                    <strong>
                      - Đối với đồng hồ có 2 kim 1 lịch (giờ/phút/lịch ngày) và
                      đồng hồ có 3 kim 1 lịch (giờ/phút/giây/lịch ngày):
                    </strong>{" "}
                    Có 2 nấc chỉnh, bạn kéo nhẹ nút điều chỉnh ra nấc đầu tiên để
                    chỉnh ngày (chỉ có thể chỉnh được 1 chiều, nếu cố vặn chiều
                    còn lại có thể bị gãy lịch) và kéo tiếp ra nấc thứ 2 để chỉnh
                    giờ phút.
                    <br />
                    <strong>- Đối với đồng hồ có 6 kim 1 lịch:</strong> Có 3 nút
                    điều chỉnh bên cạnh, tuy nhiên tùy vào máy của đồng hồ để có
                    cách chỉnh riêng
                  </p>
                  <div class="text-center mb-4">
                    <img
                      src="/IMG/hd1.jpg"
                      class="img-fluid mb-4"
                      alt="#"
                      width="900"
                      height="300"
                    />
                  </div>
                  <p class="mb-3">
                    - Nút điều chỉnh nằm ở giữa có 2 nấc chỉnh, kéo nhẹ nấc đầu
                    tiên ra để chỉnh ngày, tiếp đến nấc thứ 2 để chỉnh giờ và
                    phút.
                    <br />
                    - Nút trên cùng để cho chạy/dừng chức năng bấm giờ thể thao
                    (chronograph).
                    <br />
                    - Khi nút trên đang dừng (chức năng bấm giờ chronograph đang
                    dừng) bấm nút dưới để đưa 2 kim về vị trí ban đầu số 12 giờ và
                    đặt lại từ đầu.
                    <br /> <strong> - Đồng hồ tự động (Automatic):</strong> Thông
                    thường nút điểu chỉnh ở giữa kéo ra để chỉnh ngày và giờ.
                  </p>
                  <div class="text-center mb-4">
                    <img
                      src="/IMG/hd2.jpg"
                      class="img-fluid mb-4"
                      alt="#"
                      width="900"
                      height="300"
                    />
                  </div>

                  <p class="mb-2 text-uppercase fw-bold text-primary">
                    II. HƯỚNG DẪN ĐO KÍCH THƯỚC CỔ TAY VÀ LỰA CHỌN ĐỒNG HỒ PHÙ HỢP
                  </p>
                  <p class="mb-3">
                    <strong>1. Cách đo cổ tay của bạn</strong>
                    <br />
                    Lấy một thước dây hoặc một sợi dây để đo kích thước cổ tay.
                    <br />
                    Để lòng bàn tay hướng lên, mở bàn tay của bạn ra (làm như vậy
                    sẽ đảm bảo bạn có được kích thước thật của cổ tay khi nó lớn
                    nhất).
                    <br />
                    Quấn thước quanh cánh tay của bạn sao cho đó là vị trí mà dây
                    đeo đồng hồ thường đeo ở đó đặt, thường là ngay dưới xương cổ
                    tay.
                    <br />
                    Nếu bạn đang sử dụng đoạn dây, hãy lấy bút và đánh dấu điểm mà
                    đầu cuối gặp nhau sau đó đo lại kích thước đoạn dây trên một
                    cái thước phẳng.
                  </p>

                  <p class="mb-3">
                    <strong>2. Cách lựa chọn đồng hồ phù hợp đối với nam</strong>
                    <br />
                    Sau khi đo chu vi tay, bạn sẽ quy ra được đường kính tối đa có
                    thể đeo với công thức sau:
                    <br />
                    <br />
                    - Đối với những đồng hồ có thiết kế đơn giản, sang trọng: (Chu
                    vi/4) + 1 = chu vi mặt đồng hồ tối đa có thể đeo.
                    <br />
                    Ví dụ: Chu vi cổ tay là 16cm thì (16/4) + 1 = 41 (kích thước
                    mặt đồng hồ tối đa có thể đeo là 41mm)
                    <br />
                    - Đối với những đồng hồ thể thao có nhiều kim: (Chu vi/4) + 4
                    = chu vi mặt đồng hồ tối đa có thể đeo
                    <br />
                    Ví dụ: Chu vi cổ tay là 16cm thì (16/4) + 4 = 44 (kích thước
                    mặt đồng hồ tối đa có thể đeo là 44mm)
                  </p>

                  <p>
                    <strong class="mb-3">
                      3. Cách lựa chọn đồng hồ phù hợp đối với nữ
                    </strong>
                    <br />
                    Đối với đồng hồ nữ thì không dùng công thức trên mà có chuẩn
                    chung: đường kính 28 - 31 là trung bình, trên 31 cm là size
                    lớn, dưới 28 cm là size nhỏ.
                  </p>
                  <p class="mb-2 text-uppercase fw-bold text-primary">
                    III. HIỂU ĐÚNG VỀ MỨC ĐỘ CHỊU NƯỚC CỦA ĐỒNG HỒ
                  </p>
                  <p className="mb-3">
                    - Độ chịu nước (Water Resistant) 3 BAR = 3 ATM = 30m: Có thể
                    đeo đồng hồ khi rửa tay hoặc đi mưa nhẹ
                  </p>
                  <p className="mb-3">
                    - Độ chịu nước (Water Resistant) 5 BAR = 5 ATM = 50m: Có thể
                    đeo đồng hồ khi đi mưa, rửa tay ở mức áp lực nước lớn hơn so
                    với 30m (3 BAR, 3 ATM)
                  </p>
                  <p className="mb-3">
                    - Độ chịu nước (Water Resistant) 10 BAR = 10 ATM = 100m: Có
                    thể đeo đồng hồ khi đi mưa lớn, rửa tay dưới vòi nước có áp
                    lực nước lớn, đi bơi, lướt sóng hoặc kết hợp một số môn thể
                    thao dưới nước nhẹ nhàng
                  </p>
                  <p className="mb-3">
                    - Độ chịu nước (Water Resistant) 20 BAR = 20 ATM = 200m: Có
                    thể đeo đồng hồ khi đi mưa, rửa tay, bơi, lướt sóng, tham gia
                    các môn thể thao dưới nước, lặn bằng ống thở.
                  </p>
                  <p className="mb-3">
                    - Độ chịu nước (Water Resistant) 30 BAR = 30ATM = 300m: Có thể
                    đeo đồng hồ khi đi mưa, rửa tay, bơi, lướt sóng, tham gia các
                    môn thể thao dưới nước, lặn sâu bằng bình dưỡng khí.
                  </p>
                  <p className="mb-3">
                    - Độ chịu nước (Water Resistant) 50 BAR = 50 ATM = 500m: Có
                    thể đeo đồng hồ khi đi mưa, rửa tay, bơi, lướt sóng, tham gia
                    các môn thể thao dưới nước, lặn sâu bằng bình dưỡng khí.
                  </p>

                  <div class="text-center mb-4">
                    <img
                      src="https://donghoduyanh.com/upload_images/images/2024/12/26/Water-resistant-watches-vs-water.jpg"
                      class="img-fluid mb-4"
                      alt="#"
                      width="900"
                      height="300"
                    />
                  </div>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
       <div>
      <ProductSlider />
    </div>
    </div>
  );
}

export default ChiTietSanPham;
