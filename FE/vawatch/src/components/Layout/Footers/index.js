import React, { useState } from "react";
import "./Footer.scss";

const Footer = () => {
  const [activeTab, setActiveTab] = useState("hanoi");

  return (
    <footer>
      {/* Header Top */}
      <div className="footer-top">
        <div className="container">
          <div className="info-item">
            <i className="fas fa-shopping-cart"></i>
            <span>MUA HÀNG ONLINE</span>
            <span>Tất cả các ngày trong tuần</span>
          </div>
          <div className="info-item">
            <i className="fas fa-phone-alt"></i>
            <span>HỖ TRỢ BÁN HÀNG</span>
            <span>024.3991.8668</span>
          </div>
          <div className="info-item">
            <i className="fas fa-phone-alt"></i>
            <span>HỖ TRỢ KỸ THUẬT</span>
            <span>024.2214.8336</span>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <span>EMAIL</span>
            <span>vietanhwatch@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main container">
        <div className="footer-grid">
          <div>
            <h5>VỀ DONGHOVIETANH</h5>
            <ul>
              <li>Giới thiệu về donghovietanh</li>
              <li>Triết lý kinh doanh</li>
              <li>Giấy chứng nhận và giải thưởng</li>
              <li>Khách hàng nói gì về chúng tôi</li>
            </ul>
          </div>
          <div>
            <h5>CHÍNH SÁCH CHUNG</h5>
            <ul>
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo hành</li>
              <li>Dịch vụ và sửa chữa</li>
              <li>Hướng dẫn sử dụng đồng hồ</li>
              <li>Chính sách Khách hàng thân thiết</li>
            </ul>
          </div>
          <div>
            <h5>TIỆN ÍCH</h5>
            <ul>
              <li>Tin Tức Và Sự Kiện</li>
              <li>Tuyển dụng</li>
              <li>Thanh Toán</li>
              <li>Mua hàng online</li>
              <li>Mua Hàng Trả Góp</li>
            </ul>
          </div>
          <div className="footer-info">
            <div className="mb-4">
              <div style={{ position: 'relative', width: '400px' }}>
              <img src="/IMG/cou1.jpg" alt="Promo" />

                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center' }}>
                  <img src="/IMG/logo.png" alt="Logo" style={{ width: '50px', height: '50px', background: "black", background: "black", border: "3px solid #fff", filter: "brightness(100%)" }} />
                  <div style={{ marginLeft: '10px', color: '#fff', textShadow: '0 0 2px #000, 1px 1px 1px #000' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Đồng Hồ Việt Anh</div>
                    <div style={{ fontSize: '12px' }}>310.761 người theo dõi</div>
                  </div>

                </div>

                <div style={{  justifyContent: 'space-between', alignItems: 'center' , position: 'absolute', bottom: '10px', left: '10px',right: '110px', display: 'flex', gap: '10px' }}>
                  <button style={{ backgroundColor: '#fff', color: 'black', border: 'none', padding: '3px 6px', borderRadius: '3px', fontSize: '0.9rem' }}>
                    <i className="fa-brands fa-facebook" style={{ color: "#0259ed" }}></i> Theo dõi Trang
                  </button>
                  <button style={{ backgroundColor: '#f0f0f0', border: 'none', padding: '3px 6px', borderRadius: '3px', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-share" style={{ color: '#888' }}></i> Chia sẻ
                  </button>
                </div>
              </div>

            </div>

            <div className="social-icons ">
              <h5>LIÊN KẾT</h5>
              <a href="https://www.facebook.com/donghoduyanh" className="facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-square"></i>
              </a>
              <a href="https://twitter.com/yourprofile" className="twitter" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter-square"></i>
              </a>
              <a href="https://instagram.com/yourprofile" className="instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram-square"></i>
              </a>
              <a href="https://youtube.com/yourchannel" className="youtube" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube-square"></i>
              </a>
              <a href="https://pinterest.com/yourprofile" className="zalo" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                <i class="fa-solid fa-square-z"></i>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Branch Locations */}
      <div className="branches">
        <div className="container">
          <div className="tab-buttons">
            <button
              className={activeTab === "hanoi" ? "active" : ""}
              onClick={() => setActiveTab("hanoi")}
            >
              HÀ NỘI
            </button>
            <button
              className={activeTab === "hcm" ? "active" : ""}
              onClick={() => setActiveTab("hcm")}
            >
              HỒ CHÍ MINH
            </button>
          </div>

          <div className={`tab-content ${activeTab !== "hanoi" ? "hidden" : ""}`}>
            <div className="branch-grid">
              <div>
                <h5>PHỐ HUẾ - HÀ NỘI</h5>
                <p>
                  Địa chỉ: 200A Phố Huế, Quận Hai Bà Trưng, Hà Nội (gần ngã tư Phố Huế - Tô Hiến Thành - Nguyễn Công Trứ)
                </p>
                <p>Điện thoại: (024)2.214.8336</p>
                <p>Email: vietanhwatch@gmail.com</p>
              </div>
              <div>
                <h5>TTTM LOTTE CENTER 54 LIỄU GIAI - HÀ NỘI</h5>
                <p>
                  Địa chỉ: F4-B08, Tầng 4, Trung Tâm Thương Mại Lotte Center, 54 Liễu Giai, Q.Ba Đình, Hà Nội
                </p>
                <p>Điện thoại: (024)32676.555</p>
                <p>Email: vietanhwatch@gmail.com</p>
              </div>
              <div>
                <h5>TTTM VINCOM CENTER TRẦN VIỆT HƯNG - HÀ NỘI</h5>
                <p>
                  Địa chỉ: Tầng 2, TTTM Vincom Trần Việt Hưng, 119 Trần Việt Hưng, Cầu Giấy, Hà Nội
                </p>
                <p>Điện thoại: (024)8656.6880</p>
                <p>Email: vietanhwatch@gmail.com</p>
              </div>
              <div>
                <h5>MUA HÀNG ONLINE HÀ NỘI</h5>
                <p>Địa chỉ: Hà Nội</p>
                <p>Điện thoại: (024)3991.8668</p>
                <p>Email: vietanhwatch@gmail.com</p>
              </div>
            </div>

            <div className={`tab-content ${activeTab !== "hcm" ? "hidden" : ""}`}>
              <div className="branch-grid">
                <div>
                  <h5>TRẦN HƯNG ĐẠO - TP. HỒ CHÍ MINH</h5>
                  <p>205 Trần Hưng Đạo, P.Cô Giang, Q.1</p>
                  <p>Điện thoại: 0836.88.99.86</p>
                  <p>Email: vietanhwatch@gmail.com</p>
                </div>
                <div>
                  <h5>HAI BÀ TRƯNG - TP. HỒ CHÍ MINH</h5>
                  <p>300 Hai Bà Trưng, P.Tân Định, Q.1</p>
                  <p>Điện thoại: 08899.36168</p>
                  <p>Email: vietanhwatch@gmail.com</p>
                </div>
              </div>
            </div>

          </div>

          <div className={`tab-content ${activeTab !== "hcm" ? "hidden" : ""}`}>
            <div className="branch-grid">
              <div>
                <h5>TRẦN HƯNG ĐẠO - TP. HỒ CHÍ MINH</h5>
                <p>205 Trần Hưng Đạo, P.Cô Giang, Q.1</p>
                <p>Điện thoại: 0836.88.99.86</p>
                <p>Email: vietanhwatch@gmail.com</p>
              </div>
              <div>
                <h5>HAI BÀ TRƯNG - TP. HỒ CHÍ MINH</h5>
                <p>300 Hai Bà Trưng, P.Tân Định, Q.1</p>
                <p>Điện thoại: 08899.36168</p>
                <p>Email: vietanhwatch@gmail.com</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container text-center">
          <p>CÔNG TY TNHH PHÁT TRIỂN VÀ THƯƠNG MẠI VIET ANH</p>
          <p>VPGD : 200A Phố Huế, Hai Bà Trưng, Hà Nội</p>
          <p>Điện thoại: (024) 2.214.8336</p>
          <p>MST: 0105545498 Cấp ngày: 03/10/2011 Nơi cấp: Hà Nội</p>
          <div className="certifications">
            <img src="https://donghoduyanh.com/images/config/dathongbao.png" alt="Certification badge" />
            <img src="https://images.dmca.com/Badges/dmca_protected_sml_120l.png?ID=5cdfd6b9-54ac-4fa8-953f-524e3520dffa" alt="DMCA badge" />
          </div>
          <p>© VietAnhWatch - All rights reserved.</p>
          <p>Longines | Tissot | MIDO | Frederique Constant | Seiko | Citizen | Orient</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
