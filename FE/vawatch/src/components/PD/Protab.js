import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../services/sanPhamService";

function Protab() {
  const [productsByType, setProductsByType] = useState({
    nam: [],
    nu: [],
    doi: [],
  });
  const [activeTab, setActiveTab] = useState("nam");

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const data = await getAllProducts();

        const categorized = {
          nam: [],
          nu: [],
          doi: [],
        };

        data.forEach((product) => {
          const name = product.tenSP?.toLowerCase() || "";
          if (name.includes("đôi")) categorized.doi.push(product);
          else if (name.includes("nữ")) categorized.nu.push(product);
          else if (name.includes("nam")) categorized.nam.push(product);
        });

        setProductsByType(categorized);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchAllProduct();
  }, []);

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3002${imageArray[0]}`;
    }
    return "/default-image.jpg";
  };

  const formatCurrency = (value) => value.toLocaleString("vi-VN");

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h3 className="text-uppercase">BÁN CHẠY NHẤT</h3>
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-dark mx-1 ${
              activeTab === "nam" ? "active" : ""
            }`}
            onClick={() => setActiveTab("nam")}
          >
            Đồng hồ nam
          </button>
          <button
            className={`btn btn-outline-dark mx-1 ${
              activeTab === "nu" ? "active" : ""
            }`}
            onClick={() => setActiveTab("nu")}
          >
            Đồng hồ nữ
          </button>
          <button
            className={`btn btn-outline-dark mx-1 ${
              activeTab === "doi" ? "active" : ""
            }`}
            onClick={() => setActiveTab("doi")}
          >
            Đồng hồ đôi
          </button>
        </div>
      </div>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
        {(productsByType[activeTab] || []).slice(0, 10).map((product) => {
          const imageUrl = getProductImage(product.anhSP);
          const discountPercent = product.giamGia || 0;
          const salePrice = Math.floor(product.giaTien * (1 - discountPercent / 100));

          return (
            <div key={product.maSP} className="col">
              <Link
                to={`/chi-tiet/${product.maSP}`}
                className="text-decoration-none text-dark"
                onClick={() => {
                  window.location.href = `/chi-tiet/${product.maSP}`;
                }}
              >
                <div className="card h-100 text-center position-relative">
                  {product.giamGia && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        zIndex: 1,
                      }}
                    >
                      -{discountPercent}%
                    </div>
                  )}
                  <div className="card-body p-2">
                    <img
                      src={imageUrl}
                      className="card-img-bottom p-3"
                      alt={product.tenSP}
                      style={{ height: "300px", objectFit: "contain" }}
                    />
                    <h6 className="mb-1">{product.tenSP}</h6>
                    {(product.Loaimay || product.Duongkinh) && (
                      <p>
                        {product.Loaimay}
                        {product.Loaimay && product.Duongkinh && " | "}
                        {product.Duongkinh}
                      </p>
                    )}
                    <p className="text-muted mb-1">
                      Giá gốc: <del>{formatCurrency(product.giaTien)}₫</del>
                    </p>
                    <p className="text-danger fw-bold fs-5">
                      Giá KM: {formatCurrency(salePrice)}₫
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="see-more-container my-5 d-flex align-items-center justify-content-center">
        <div className="line" style={{ borderTop: "1px solid #aaa" }}></div>
        <Link
          to={`/san-pham/${activeTab}`}
          className="btn btn-outline-dark mx-2"
          onClick={() => {
            window.location.href = `/san-pham/${activeTab}`;
          }}
        >
          XEM THÊM
        </Link>
        <div className="line" style={{ borderTop: "1px solid #aaa" }}></div>
      </div>
    </div>
  );
}

export default Protab;
