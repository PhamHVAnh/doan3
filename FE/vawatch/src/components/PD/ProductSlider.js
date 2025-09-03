// ProductSlider.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/sanPhamService";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";

function ProductSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllProduct = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    fetchAllProduct();
  }, []);

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3002${imageArray[0]}`;
    }
    return null;
  };

  const formatCurrency = (value) => value.toLocaleString("vi-VN");

  return (
    <div className="container my-5">
      <h4 className="mb-4">Sản phẩm liên quan</h4>
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={30}
        slidesPerView={5}
        navigation
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
      >
        {products.map((product) => {
          const imageUrl = getProductImage(product.anhSP);
          if (!imageUrl) return null;

          const discountPercent = product.giamGia || 0;
            const salePrice = Math.floor(product.giaTien * (1 - discountPercent / 100));
          return (
            <SwiperSlide key={product.maSP}>
              <Link
                to={`/chi-tiet/${product.maSP}`}
                className="text-decoration-none text-dark"
                onClick={() => {
                  window.location.href = `/chi-tiet/${product.maSP}`;
                }}
              >
                <div className="card h-100 position-relative text-center">
                  {discountPercent > 0 && (
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

                  <img
                    src={imageUrl}
                    alt={product.tenSP}
                    className="card-img-top p-3"
                    style={{ height: "280px", objectFit: "contain" }}
                  />
                  <div className="card-body p-2">
                    <h6 className="mb-1">{product.tenSP}</h6>
                    {(product.Loaimay || product.Duongkinh) && (
                      <p className="text-muted small">
                        {product.Loaimay}
                        {product.Loaimay && product.Duongkinh && " | "}
                        {product.Duongkinh}
                      </p>
                    )}
                    <p className="text-muted mb-1">
                      Giá gốc: <del>{formatCurrency(product.giaTien)}₫</del>
                    </p>
                    <p className="text-danger fw-bold">
                      Giá KM: {formatCurrency(salePrice)}₫
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default ProductSlider;
