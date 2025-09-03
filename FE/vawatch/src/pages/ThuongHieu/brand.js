import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { brand } from "../../components/data/brand";

const findBrandByNameOrSlug = (brandName) => {
  if (!brandName) return null;
  const lowered = brandName.toLowerCase();
  return (
    brand.find(
      (b) =>
        b.name.toLowerCase() === lowered || b.slug.toLowerCase() === lowered
    ) || null
  );
};

const BrandProducts = () => {
  const { brand: brandParam } = useParams();

  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
const [sortOption, setSortOption] = useState("Sắp xếp theo");
  const [activeFilter, setActiveFilter] = useState(null);
  const productsPerPage = 8;

const handleSort = (option) => {
  setSortOption(option);
  setActiveFilter(null); 
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3002/api/sanpham/getall");
        const allProducts = res.data || [];
        const filtered = allProducts.filter(
          (sp) =>
            sp.Thuonghieu &&
            sp.Thuonghieu.toLowerCase() === brandParam.toLowerCase()
        );
        setProducts(filtered);
        setSortedProducts(filtered);
        setCurrentPage(1);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setProducts([]);
        setSortedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandParam]);
  useEffect(() => {
  if (sortOption) {
    sortProducts(sortOption, products);
  }
}, [sortOption, products]);


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
    setCurrentPage(1);
  };

  useEffect(() => {
    sortProducts(sortOption, products);
  }, [sortOption, products]);

  const brandObj = findBrandByNameOrSlug(brandParam);
  const brandBackground = brandObj?.background || "/images/bg-thuonghieu.jpg";

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return imageArray[0].startsWith("http")
        ? imageArray[0]
        : `http://localhost:3002${imageArray[0]}`;
    }
    return null;
  };
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);

  const formatCurrency = (value) => value.toLocaleString("vi-VN");

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Đang tải sản phẩm...
      </div>
    );
  }
  

  return (
    <div
      className="brand-products-page"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div
        style={{
          backgroundImage: `url(${brandBackground})`,
          padding: "60px 20px",
          textAlign: "center",
          color: "#fff",
          height: "400px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: "0.9rem",
              marginTop: "-40px",
              textAlign: "left",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#eee",
                textDecoration: "none",
                textAlign: "left",
              }}
            >
              Trang chủ
            </Link>{" "}
            {" / "}
            <span style={{ textTransform: "capitalize" }}>{brandParam}</span>
          </div>
        </div>
        {/* Đã bỏ div overlay nền đen mờ */}
      </div>

      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="sorting-container" style={{ marginBottom: "24px" }}>
          <div
            className="title"
            style={{
              fontWeight: "700",
              fontSize: "1.2rem",
              marginBottom: "12px",
            }}
          >
            ĐỒNG HỒ {brandParam.toUpperCase()}
          </div>
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

        <div
          className="row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {currentProducts.length === 0 ? (
            <p>Không có sản phẩm phù hợp.</p>
          ) : (
            currentProducts.map((product) => {
              const imageUrl = getProductImage(product.anhSP);
              if (!imageUrl) return null;
              const discountPercent = product.giamGia || 0;
              const salePrice = Math.floor(product.giaTien * (1 - discountPercent / 100));

              return (
                   <Link to={`/chi-tiet/${product.maSP}`} className="text-decoration-none text-dark"
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
              );
            })
          )}
        </div>

        <div className="d-flex justify-content-center mt-5">
          <ul
            className="pagination"
            style={{
              display: "flex",
              listStyle: "none",
              padding: 0,
              gap: "4px",
            }}
          >
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                 
                }}
              >
                &laquo;
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(page)}
                    style={{
                      fontWeight: currentPage === page ? "700" : "normal",
                      cursor: "pointer",
                     
                    }}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                 
                }}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;
