import React from 'react';

const SanPhamKhac = () => {
  const sanPhamData = [
    { title: 'ĐỒNG HỒ THỤY SỸ', image: 'https://donghoduyanh.com/images/menu/resized/dong-ho-thuy-sy_1653966220.jpg.webp' },
    { title: 'ĐỒNG HỒ NHẬT BẢN', image: 'https://donghoduyanh.com/images/menu/resized/dong-ho-nhat-ban_1653966206.jpg.webp' },
    { title: 'TRANG SỨC DW', image: 'https://donghoduyanh.com/images/menu/resized/vong-dw_1595491512.jpg.webp' },
    { title: 'DÂY ĐEO ĐỒNG HỒ', image: 'https://donghoduyanh.com/images/menu/resized/dayda_1584003106.jpg.webp' },
    { title: 'ĐỒNG HỒ ĐỂ BÀN', image: 'https://donghoduyanh.com/images/menu/resized/donghodeban_1584003404.jpg.webp' },
    { title: 'ĐỒNG HỒ BÁO THỨC', image: 'https://donghoduyanh.com/images/menu/resized/donghobaothuc_1584003336.jpg.webp' },
    { title: 'TRANG SỨC CALVIN KLEIN', image: 'https://donghoduyanh.com/images/menu/resized/trangsuc_1584003274.jpg.webp' },
  ];

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-muted">TRANG CHỦ &gt; </span>
        <span className="text-danger fw-semibold">SẢN PHẨM KHÁC</span>
      </div>

      {/* Title */}
      <h2 className="text-center text-uppercase mb-4">Sản phẩm khác</h2>

      {/* Grid sản phẩm */}
      <div className="row g-4">
        {sanPhamData.map((item, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="card border-0 text-center">
              <img
                src={item.image}
                alt={item.title}
                className="card-img-top"
                style={{ borderRadius: '6px', objectFit: 'cover' , cursor: 'pointer'}}
              />
              <div className="card-body px-1">
                <h6 className="card-title fw-bold text-uppercase" style={{cursor: 'pointer'}}>
                  {item.title}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SanPhamKhac;
