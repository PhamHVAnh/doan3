import { Link } from "react-router-dom";

function ProductList({ products }) {
  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3002${imageArray[0]}`;
    }
    return null;
  };

  const formatCurrency = (value) => value.toLocaleString("vi-VN");

  return (
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
      {products.map((product) => {
        const imageUrl = getProductImage(product.anhSP);
        if (!imageUrl) return null;

        const discountPercent = product.giamGia || 0;
         const salePrice = Math.floor(product.giaTien * (1 - discountPercent / 100));

        return (
          <div key={product.maSP} className="col">
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
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
