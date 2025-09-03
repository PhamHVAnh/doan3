import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "./thuongHieu.scss";
import { brand } from "../../components/data/brand";
import { Link } from "react-router-dom";

function ThuongHieu() {
  return (
    <div className="thuong-hieu">
      <div className="banner">
        <div className="breadcrumb-nav">
          <Link to="/">TRANG CHỦ</Link>
          <i className="fas fa-chevron-right"></i>
          <span className="active">THƯƠNG HIỆU</span>
        </div>
      </div>

      <h2 className="title">Thương hiệu nổi bật</h2>
      <div className="brand-slider">
<Swiper
  modules={[Navigation]}
  spaceBetween={10} // <= giảm khoảng cách giữa các slide
  navigation
  breakpoints={{
    0: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 }
  }}
>
  {brand.slice(0, 10).map((b, index) => (
    <SwiperSlide key={index}>
      <Link to={`/thuong-hieu/${b.slug}`} className="slide"
      onClick={() => window.scrollTo(0, 0)}
      >
        <img className="bg" src={b.image} alt={`brand-${index}`} />
        <div className="icon-wrapper">
          <img className="icon" src={b.icon} alt={`icon-${index}`} />
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>

      </div>

      <h2 className="title" style={{ marginTop: "40px" }}>Tất cả thương hiệu</h2>
      <div className="brand-grid">
        {brand.map((b, index) => (
          <Link to={`/thuong-hieu/${b.slug}`} key={index} className="brand-card"
          onClick={() => window.scrollTo(0, 0)}>
            <img className="bg" src={b.image} alt={`brand-${b.name}`} />
            <div className="icon-wrapper">
              <img className="icon" src={b.icon} alt={`icon-${b.name}`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ThuongHieu;
