import React, { useState } from "react";
import "./Diachi.scss";

function Diachi() {
  const [activeImage, setActiveImage] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  const cuaHangData = [
    {
      ten: "Viet Anh Watch - Phố Huế - Hà Nội",
      diaChi:
        "200A Phố Huế, Quận Hai Bà Trưng, Hà Nội (gần ngã tư Phố Huế - Tô Hiến Thành - Nguyễn Công Trứ)",
      thuongHieu:
        "Longines, Tissot, MIDO, Hamilton, Maurice Lacroix, Frederique Constant, Certina, Titoni, Seiko, Citizen, Orient, Casio, Claude Bernard, Daniel Wellington, Olym Pianus, Olympia Star",
      website: "www.donghovietanh.com",
      email: "vietanhwatch@gmail.com",
      dienThoai: "(024)2214.8336",
      gioMoCua: "Từ 8h30 đến 21h tất cả các ngày trong tuần",
      thanhPho: "Hà Nội",
      hinhAnh: [
        "https://donghoduyanh.com/images/address/2021/01/26/original/dong-ho-duy-anh-pho-hue-1_1611632441_1611637689.jpg",
        "https://donghoduyanh.com/images/address/2021/01/26/original/dong-ho-duy-anh-pho-hue_1611632441_1611637377.jpg",
        "https://donghoduyanh.com/images/address/2021/01/26/resized/dong-ho-duy-anh-pho-hue-2_1611632441.jpg",
        "https://donghoduyanh.com/images/address/2021/01/26/resized/dong-ho-duy-anh-pho-hue-3_1611632441.jpg",
      ],
    },
    {
      ten: "Viet Anh Watch - TTTM Lotte Center 54 Liễu Giai - Hà Nội",
      diaChi:
        "F4-B08, Tầng 4, Trung Tâm Thương Mại Lotte Center, 54 Liễu Giai, Q.Ba Đình, Hà Nội",
      thuongHieu: "Longines, Tissot, MIDO, Seiko, Citizen, Daniel Wellington",
      website: "www.donghovietanh.com",
      email: "vietanhwatch@gmail.com",
      dienThoai: "(024)32676.555",
      gioMoCua: "Từ 8h30 đến 21h tất cả các ngày trong tuần",
      thanhPho: "Hà Nội",
      hinhAnh: [
        "https://donghoduyanh.com/images/address/2024/12/25/original/lotte-1_1735102397.jpg",
        "https://donghoduyanh.com/images/address/2024/12/25/original/lotte-2_1735102393.jpg",
        "https://donghoduyanh.com/images/address/2024/12/25/original/lotte-3_1735102394.jpg",
        "https://donghoduyanh.com/images/address/2024/12/25/original/lotte-4_1735102395.jpg",
      ],
    },
    {
      ten: "Viet Anh Watch - Vincom Trần Duy Hưng - Hà Nội",
      diaChi:
        "Tầng 2, TTTM Vincom Trần Duy Hưng, 119 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      thuongHieu:
        "Longines, MIDO, Tissot, Calvin Klein, Daniel Wellington, Citizen, Olym Pianus, Olympia Star",
      website: "www.donghovietanh.com",
      email: "vietanhwatch@gmail.com",
      dienThoai: "(024)6656.6660",
      gioMoCua: "Từ 8h30 đến 21h tất cả các ngày trong tuần",
      thanhPho: "Hà Nội",
      hinhAnh: [
        "https://donghoduyanh.com/images/address/2019/12/24/original/add4_1577179010.jpg",
        "https://donghoduyanh.com/images/address/2021/11/12/original/duy-anh-tdh_1636695425.jpg",
        "https://donghoduyanh.com/images/address/2019/12/24/original/other_add4_2_1577179009.jpg",
        "https://donghoduyanh.com/images/address/2019/12/24/original/other_add4_3_1577179009.jpg",
      ],
    },
    {
      ten: "Viet Anh Watch - Trần Hưng Đạo - TP. Hồ Chí Minh",
      diaChi:
        "Địa chỉ: 300 Hai Bà Trưng, phường Tân Định, Quận 1, TP. Hồ Chí Minh (gần nhà thờ Tân Định)",
      thuongHieu: "Longines, Tissot, MIDO, Seiko, Citizen, Daniel Wellington",
      website: "www.donghovietanh.com",
      email: "vietanhwatch@gmail.com",
      dienThoai: "0836.88.99.86",
      gioMoCua: "Từ 8h30 đến 21h tất cả các ngày trong tuần",
      thanhPho: "Hồ Chí Minh",
      hinhAnh: [
        "https://donghoduyanh.com/images/address/2022/10/07/large/z3780083612156_e415b8904f387eb2dde52b409ff43367_1665117323.jpg",
        "https://donghoduyanh.com/images/address/2022/10/07/resized/z3779988704601_83b6b843da0c297341dc23f52048aab2_1665109108.jpg",
        "https://donghoduyanh.com/images/address/2022/10/07/resized/z3780305268082_cd58becc7b475606ea701307e2c23d71_1665117321.jpg",
        "https://donghoduyanh.com/images/address/2022/10/11/resized/z3782635190956_596a973daf5036eb9417f5e0e19bc17a_1665453750.jpg"
      ],
    },
    {
      ten: "Viet Anh Watch - Hai Bà Trưng - TP. Hồ Chí Minh",
      diaChi:
        "205 Trần Hưng Đạo, phường Cô Giang, Quận 1, TP.Hồ Chí Minh (gần Ngân hàng Vietinbank)",
      thuongHieu: "Longines, Tissot, MIDO, Seiko, Citizen, Daniel Wellington",
      website: "www.donghovietanh.com",
      email: "vietanhwatch@gmail.com",
      dienThoai: "08899.36168",
      gioMoCua: "Từ 8h30 đến 21h tất cả các ngày trong tuần",
      thanhPho: "Hồ Chí Minh",
      hinhAnh: [
        "https://donghoduyanh.com/images/address/2022/01/31/large/longines_1643566997.jpg",
        "https://donghoduyanh.com/images/address/2021/01/26/resized/duy-anh-sai-gon-1_1611632400.jpg"
        ,"https://donghoduyanh.com/images/address/2021/01/26/resized/duy-anh-sai-gon_1611632400_1611647989.jpg",
        "https://donghoduyanh.com/images/address/2021/01/26/resized/duy-anh-sai-gon-7_1611632400.jpg"
      ],
    },

  
  ];

  const filteredStores = selectedCity
    ? cuaHangData.filter((store) => store.thanhPho === selectedCity)
    : cuaHangData;

  return (
    <div className="diachi-container">
      <h1 className="title">HỆ THỐNG CỬA HÀNG ĐỒNG HỒ VIET ANH</h1>

      <select
        className="filter-select"
        onChange={(e) => setSelectedCity(e.target.value)}
        value={selectedCity}
      >
        <option value="">-- Chọn tỉnh / thành phố --</option>
        <option value="Hà Nội">Hà Nội</option>
        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
      </select>

      {filteredStores.map((store, index) => (
        <div key={index} className="store-card">
          <div className="store-content">
            <div className="info">
              <h2>{store.ten}</h2>
              <p>
                <strong>Địa chỉ:</strong> {store.diaChi}
              </p>
              <p>
                <strong>Thương hiệu:</strong> {store.thuongHieu}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={`https://${store.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {store.website}
                </a>
              </p>
              <p>
                <strong>Email:</strong> {store.email}
              </p>
              <p>
                <strong>Điện thoại:</strong> {store.dienThoai}
              </p>
              <p>
                <strong>Giờ mở cửa:</strong> {store.gioMoCua}
              </p>
            </div>

            <div className="images">
              <div className="main-image">
                <img
                  src={store.hinhAnh[0]}
                  onClick={() => setActiveImage(store.hinhAnh[0])}
                  alt="Ảnh lớn"
                />
              </div>
              <div className="thumbnail-images">
                {store.hinhAnh.slice(1).map((src, i) => (
                  <img
                    key={i}
                    src={src.trim()}
                    onClick={() => setActiveImage(src.trim())}
                    alt={`Ảnh nhỏ ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="map-button">
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    store.diaChi
                  )}`,
                  "_blank"
                )
              }
            >
              Xem bản đồ
            </button>
          </div>
        </div>
      ))}

      {activeImage && (
        <div className="modal-overlay" onClick={() => setActiveImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setActiveImage(null)}
            >
              ×
            </button>
            <img src={activeImage} alt="Ảnh phóng to" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Diachi;
