import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import slides from "./data/slidesData";
import { brand } from "../../components/data/brand";
import "./trangChu.scss";
import ProductList from "../../components/PD/ProductList";
import { getAllProducts } from "../../services/sanPhamService";
import Protab from "../../components/PD/Protab";

function TrangChu() {
const [products, setProducts] = useState([]);
 const showProducts = products.slice(0, 10);
  useEffect(() => {
    getAllProducts().then((data) => {
      setProducts(data); 
    });
  }, []); 

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  useEffect(() => {
    const fixed = "VIỆT ANH - ";
    const texts = [
      "SỐ LƯỢNG ĐỒNG HỒ ĐA DẠNG NHẤT",
      "70 NĂM KINH NGHIỆM VỀ ĐỒNG HỒ"
    ];
    const h = document.getElementById("header-text");
    let i = 0, j = 0, del = false;
  
    function type() {
      if (!h) return;
      h.textContent = fixed + texts[i].slice(0, j);
      if (!del && j === texts[i].length) {
        del = true;
        setTimeout(type, 2000);
      } else if (del && j === 0) {
        del = false;
        i = (i + 1) % texts.length;
        setTimeout(type, 500);
      } else {
        j += del ? -1 : 1;
        setTimeout(type, del ? 50 : 100);
      }
    }
  
    type();
  }, []);
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const changeSlide = (direction) => {
    setCurrentSlide((prevIndex) =>
      (prevIndex + direction + slides.length) % slides.length
    );
  };
const images = ['/IMG/cou1.jpg', '/IMG/cou2.jpg', '/IMG/cou3.webp'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <main>
      {/* Carousel đầu trang */}
     <div className="carousel position-relative">
      <img src={images[index]} className="d-block w-100" alt="Slide" />

      <button className="carousel-control-prev" onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}>
        <span className="carousel-control-prev-icon" />
      </button>
      <button className="carousel-control-next" onClick={() => setIndex((i) => (i + 1) % images.length)}>
        <span className="carousel-control-next-icon" />
      </button>
    </div>
      {/* Header section */}
      <div className="header-section">
        <img src="https://donghoduyanh.com/images/config/dongho_1584349656.jpg" alt="Watch background" height="300" width="1920" />
        <h1 id="header-text">VIỆT ANH - 70 NĂM KINH NGHIỆM VỀ ĐỒNG HỒ</h1>
      </div>

      {/* Features */}
      <div className="features-section">
        <div className="feature-item">
          <img src="/IMG/1.png" alt="Bảo hành" height="100" width="100" style={{ backgroundColor: "black" }} />
          <h3>PHÒNG BẢO HÀNH ĐẠT</h3>
          <p>TIÊU CHUẨN THỤY SĨ</p>
        </div>
        <div className="feature-item">
          <img src="/IMG/2.png" alt="Uy tín" height="100" width="100" style={{ backgroundColor: "#d6a424" }} />
          <h3>THƯƠNG HIỆU UY TÍN</h3>
          <p>LÂU ĐỜI 70 NĂM</p>
        </div>
        <div className="feature-item">
          <img src="/IMG/3.png" alt="Đền hàng" height="100" width="100" style={{ backgroundColor: "black" }} />
          <h3>ĐỀN 20 LẦN NẾU BÁN</h3>
          <p>HÀNG FAKE</p>
        </div>
      </div>

      {/* Banners */}
      <div className="container my-4">
        <div className="row">
          <div className="col-md-6 text-center">
            <button className="btn btn-link p-0 border-0 bg-transparent">
              <img src="/IMG/image4.jpg" alt="banner 1" className="img-fluid custom-img" />
            </button>
          </div>
          <div className="col-md-6 text-center">
            <button className="btn btn-link p-0 border-0 bg-transparent">
              <img src="/IMG/image5.webp" alt="banner 2" className="img-fluid custom-img" />
            </button>
          </div>
        </div>
      </div>
      {/* Thương hiệu */}
<div className="container my-5">
    <Link to={`/thuong-hieu/${brand.slug}`} className="brand-link" onClick={() => window.scrollTo(0, 0)}>
  <Slider {...sliderSettings}>
    {brand.map((brand, index) => (
      <div className="brand-item" key={index}>
        <img src={brand.icon} alt={brand.name} className="img-fluid" />
      </div>
    ))}
  </Slider>
  </Link>
</div>


      {/* Slide giới thiệu sản phẩm */}
      <div className="Slider">
        {slides.map((slide, index) => (
          <div key={index} className={`Slide ${index === currentSlide ? "active" : ""}`}>
            <img className="bg-image" src={slide.image} alt={`Slide ${index + 1}`} />
            <div className="Slide-content">
              <div className="text-content">
                <h1>{slide.title}</h1>
                <h3>{slide.subtitle}</h3>
                <p>{slide.description}</p>
                <button>VÀO CỬA HÀNG</button>
              </div>
              <img className="watch-image" src={slide.watchImage} alt={`Watch ${index + 1}`} />
            </div>
          </div>
        ))}
        <div className="navigation">
          <button className="nav-btn prev" onClick={() => changeSlide(-1)}></button>
          <button className="nav-btn next" onClick={() => changeSlide(1)}></button>
        </div>
      </div>

 <div>
      {/* Hiển thị danh sách sản phẩm */}
      {/* <div className="container my-5">
<h2 className="text-center  fw-bold pb-2 bs-dark-text-emphasis">
  Sản phẩm nổi bật
</h2>

              <ProductList products={showProducts}/>
      </div>
      <div className="see-more-container mb-4 d-flex align-items-center justify-content-center">
        <div className="line flex-grow-1 bg-dark mx-3" style={{ height: "1px" }}></div>
        <Link to="/san-pham" className="btn btn-outline-dark" 
        onClick={() => {
          window.location.href = "/san-pham";
        }}
        >XEM THÊM</Link>
        <div className="line flex-grow-1 bg-dark mx-3" style={{ height: "1px" }}></div>
      </div> */}
      <Protab products={showProducts} />
    </div>
  <div className="brand">
  <h2 className="title1">
  <span>Thương hiệu nổi bật</span>
  <Link to="/thuong-hieu" className="xem-tat-ca" onClick={() => window.scrollTo(0, 0)}>Xem tất cả <i class="fa-duotone fa-thin fa-angles-right"></i></Link>
</h2>

  <Slider {...sliderSettings}>
        {brand.slice(0, 19).map((brand, index) => (
          <div className="slide" key={index}>
            <Link to={`/thuong-hieu/${brand.slug}`} className="brand-link" onClick={() => window.scrollTo(0, 0)}>
            <img className="bg" src={brand.image} alt={`brand-${index}`} />
            <div className="icon-wrapper">
              <img className="icon" src={brand.icon} alt={`icon-${index}`} />
           
            </div>
             </Link>
          </div>
        ))}
      </Slider>
  </div>

<div className="why-choose-us container py-5">
  <h2 className="section-title text-center">
    <span className="line"></span>
    VÌ SAO NÊN CHỌN CHÚNG TÔI
    <span className="line"></span>
  </h2>
  <div className="row text-center mt-4">
    <div className="col-md-3">
    <i class="fa-light fa-award fa-flip fa-2xl"></i>   100% HÀNG CHÍNH HÃNG
    </div>
    <div className="col-md-3">
    <i class="fa-sharp fa-light fa-truck fa-bouncea fa-2xl"></i>    MỄN PHÍ VẬN CHUYỂN
    </div>
    <div className="col-md-3">
    <i class="fa-solid fa-badge-check fa-beat fa-2xl"></i>   BẢO HÀNH 5 NĂM
    </div>
    <div className="col-md-3">
    <i class="fa-regular fa-square-7 fa-flip fa-2xl"></i>    Đổi hàng trong 7 ngày 
    </div>
  </div>
</div>
<div className="chungnhan flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg leading-tight">
            ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC CÁC
            <br />
            THƯƠNG HIỆU LỚN
          </h2>
          <a className="text-base underline" href="/xem-tat-ca">
            XEM TẤT CẢ
          </a>
        </div>
        <hr className="border border-gray-300 mb-10" />
        <div>
          <p className="font-semibold text-base mb-10">
            Chứng nhận Việt Anh Watch là Đại lý ủy quyền chính thức thương hiệu LONGINES tại Việt Nam
            <span className="text-red-600 ml-1">
              <a href="/xem-ngay">(Xem ngay)</a>
            </span>
          </p>
        </div>
      </div>
      <div className="flex-1">
        <img
          alt="Certificate of official authorized dealer for LONGINES and HAMILTON brands in a wooden frame"
          className="w-full h-auto object-contain"
          height="500"
          width="400"
          src="https://storage.googleapis.com/a1aa/image/63aab502-65b2-497c-6ba0-299fd5ee797e.jpg"
        />
      </div>
    </div>

    <div className="news-video-wrapper">
      <div className="label-header">
        <h6 className="label-title">TIN TỨC - VIDEO</h6>
      </div>
      <hr className="label-divider" />

      <div className="news-video-container">
        {/* Danh sách tin tức */}
        <div className="news-list">
          <div className="news-item">
            <div className="news-content">
              <h3 className="news-title">
                Đồng hồ số: Khám phá thế giới đồng hồ hiển thị chữ số đầy tiện ích
              </h3>
              <p className="news-desc">
                Trong thế giới đồng hồ rộng lớn và đa dạng, đồng hồ số (digital watch) luôn chiếm một vị trí đặc biệt. Không chỉ mang...
              </p>
              <div className="news-date">
                <i className="far fa-calendar-alt"></i>28/04/2025
              </div>
            </div>
            <img
              src="https://storage.googleapis.com/a1aa/image/1b16a800-05b1-4b4b-bee0-417cd6c76614.jpg"
              alt="Digital watch"
              className="news-image"
            />
          </div>

          <div className="news-item">
            <div className="news-content">
              <h3 className="news-title">
                Đồng hồ treo tường có chuông báo giờ: Tiện ích và các sản phẩm nổi bật
              </h3>
              <p className="news-desc">
                Đồng hồ treo tường có chuông báo giờ không chỉ dùng để xem giờ mà còn tạo âm thanh nhắc nhở mỗi giờ, mang lại sự tiện...
              </p>
              <div className="news-date">
                <i className="far fa-calendar-alt"></i>26/04/2025
              </div>
            </div>
            <img
              src="https://storage.googleapis.com/a1aa/image/1e07341e-96a4-4108-6b16-48652a71f3e0.jpg"
              alt="Wall clock"
              className="news-image"
            />
          </div>

          <div className="news-item">
            <div className="news-content">
              <h3 className="news-title">
                Đồng hồ Casio năng lượng mặt trời – Bền bỉ, tiện lợi, không cần thay...
              </h3>
              <p className="news-desc">
                Trong thế giới hiện đại, nơi công nghệ và môi trường cần được cân bằng, đồng hồ Casio năng lượng mặt trời chính là sự...
              </p>
              <div className="news-date">
                <i className="far fa-calendar-alt"></i>26/04/2025
              </div>
            </div>
            <img
              src="https://storage.googleapis.com/a1aa/image/bf62a00e-7576-47a0-d9d8-4dbb878b6139.jpg"
              alt="Casio solar"
              className="news-image"
            />
          </div>
          <div className="news-item">
            <div className="news-content">
              <h3 className="news-title">
                Đồng hồ treo tường có chuông báo giờ: Tiện ích và các sản phẩm nổi bật
              </h3>
              <p className="news-desc">
                Đồng hồ treo tường có chuông báo giờ không chỉ dùng để xem giờ mà còn tạo âm thanh nhắc nhở mỗi giờ, mang lại sự tiện...
              </p>
              <div className="news-date">
                <i className="far fa-calendar-alt"></i>26/04/2025
              </div>
            </div>
            <img
              src="https://storage.googleapis.com/a1aa/image/1e07341e-96a4-4108-6b16-48652a71f3e0.jpg"
              alt="Wall clock"
              className="news-image"
            />
          </div>

          <div className="news-item">
            <div className="news-content">
              <h3 className="news-title">
                Đồng hồ Casio năng lượng mặt trời – Bền bỉ, tiện lợi, không cần thay...
              </h3>
              <p className="news-desc">
                Trong thế giới hiện đại, nơi công nghệ và môi trường cần được cân bằng, đồng hồ Casio năng lượng mặt trời chính là sự...
              </p>
              <div className="news-date">
                <i className="far fa-calendar-alt"></i>26/04/2025
              </div>
            </div>
            <img
              src="https://storage.googleapis.com/a1aa/image/bf62a00e-7576-47a0-d9d8-4dbb878b6139.jpg"
              alt="Casio solar"
              className="news-image"
            />
          </div>
        </div>

        {/* Video section */}
        <div className="video-section">
          <div className="video-header">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
              alt="YouTube"
              className="video-logo"
              style={{ height: 24 }}
            />
            <span className="video-title">YouTube</span>
            <div className="video-separator"></div>
            <p className="video-description">
              REVIEW ĐỒNG HỒ HAMILTON JAZZMASTER GMT AUTO H32605581
            </p>
          </div>

          <div className="main-video">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/AAS_KH9ZphY"
              title="YouTube video player"
              // frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <div className="video-caption">
              Review Đồng Hồ Hamilton Jazzmaster Gmt Auto H32605581
            </div>
          </div>

          <div className="video-thumbnails">
            {[
              {
                id: "P5J6sUK7O0U",
                title: "Review Đồng Hồ Hamilton Jazzmaster"
              },
              {
                id: "ZU4q8W8l1kM",
                title: "Review Đồng Hồ Nữ MIDO Baroncelli Wild"
              },
              {
                id: "N27mZY4Txf4",
                title: "Review Đồng Hồ Titoni Airmaster 83908 SRG"
              },
              {
                id: "P5J6sUK7O0U",
                title: "Review Đồng Hồ Longines"
              }
            ].map((video, index) => (
              <div className="video-thumb" key={index}>
                <iframe
                  width="100%"
                  height="90"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="video-caption-sm">{video.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    </main>
  );
}

export default TrangChu;
