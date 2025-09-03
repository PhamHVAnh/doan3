import React, { useEffect, useState } from "react";
import "./gioHang.scss";
import { useNavigate } from "react-router-dom";

function GioHang() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();

  const taiKhoan = localStorage.getItem("taiKhoan");
  const cartKey = taiKhoan ? `gioHang_${taiKhoan}` : "gioHang_tam";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedCart);
    setIsLoading(false);
  }, [cartKey]);

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3002${imageArray[0]}`;
    }
    return "/image/default.jpg";
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.maSP === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.giaTien * item.quantity,
    0
  );

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.maSP !== id);
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    Navigate("/thanh-toan", { state: { cartItems } });
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 empty-cart-container">
        <div className="text-center empty-cart-content">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-bag fa-4x"></i>
          </div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <button
            className="btn btn-primary shop-now-btn"
            onClick={() => Navigate("/")}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container py-5">
        <div className="cart-header mb-4">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <p className="cart-count">{cartItems.length} sản phẩm</p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.maSP} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={getProductImage(item.anhSP)}
                      alt={item.tenSP}
                      className="img-fluid"
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.tenSP}</h3>
                    <p className="cart-item-variant">{item.mauSP}</p>
                    <div className="cart-item-price-mobile d-block d-md-none">
                      {item.giaTien.toLocaleString()}đ
                    </div>
                  </div>
                  <div className="cart-item-price d-none d-md-block">
                    {item.giaTien.toLocaleString()}đ
                  </div>
                  <div className="cart-item-quantity">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.maSP, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        readOnly
                        className="quantity-input"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.maSP, item.quantity + 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-subtotal">
                    {(item.giaTien * item.quantity).toLocaleString()}đ
                  </div>
                  <div className="cart-item-remove">
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.maSP)}
                      aria-label="Xóa sản phẩm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-actions mt-4">
              <button
                className="btn btn-outline-primary continue-shopping"
                onClick={() => Navigate("/")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="cart-summary">
              <h2 className="summary-title">Tổng giỏ hàng</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span className="total-amount">{total.toLocaleString()}đ</span>
              </div>

              <button
                className="btn btn-primary checkout-btn w-100"
                onClick={handleCheckout}
              >
                <i className="fas fa-credit-card me-2"></i>
                Thanh toán ngay
              </button>

              <div className="shipping-note mt-4">
                <div className="note-header">
                  <i className="fas fa-info-circle me-2"></i>
                  <span>Thông tin vận chuyển</span>
                </div>
                <ul className="note-content">
                  <li>Đơn hàng trên website được xử lý trong giờ hành chính</li>
                  <li>Đơn hàng không đồng kiểm khi giao hàng</li>
                  <li>
                    Khách hàng vui lòng quay video khi bóc hàng để được hỗ trợ tốt nhất nếu xảy ra vấn đề
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GioHang;
