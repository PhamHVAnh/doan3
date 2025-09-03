import React from "react";
import "./tintuc.css";
const SuaDongHo = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="h3 fw-bold text-uppercase">
          Dịch vụ sửa chữa đồng hồ chính hãng tại Việt Anh Watch
        </h1>
        <p className="text-muted">
          Trung tâm kỹ thuật được ủy quyền sửa chữa bởi các thương hiệu đồng hồ Thụy Sỹ
        </p>
      </div>

      <div className="mb-4">
        <img
          src="https://donghoduyanh.com/upload_images/images/2020/03/25/Untitled-5.jpg"
          alt="Kỹ thuật viên đang sửa đồng hồ"
          className="img-fluid rounded shadow"
          style={{margin: "0 auto", display: "block"}}
        />
      </div>

      <section className="mb-5">
        <h2 className="h5 fw-bold">Giới thiệu về Trung tâm kỹ thuật Việt Anh Watch</h2>
        <p>
          Với đội ngũ kỹ thuật viên được đào tạo bài bản và trang thiết bị đạt tiêu chuẩn Thụy Sỹ,
          trung tâm kỹ thuật Việt Anh Watch đã và đang là địa chỉ tin cậy cho khách hàng khi cần sửa chữa đồng hồ chính hãng.
        </p>
        <p>
          Chúng tôi cung cấp dịch vụ sửa chữa cho tất cả các thương hiệu như Tissot, Longines, Mido,
          Rado, Frederique Constant, Citizen, Seiko, Orient, OP, Olympia Star...
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h5 fw-bold">Các dịch vụ sửa chữa tại Việt Anh Watch</h2>
        <ul>
          <li>Thay pin đồng hồ chính hãng (Sony, Maxell, Renata...)</li>
          <li>Thay mặt kính đồng hồ: kính khoáng, kính sapphire</li>
          <li>Thay dây da chính hãng, dây kim loại, dây NATO</li>
          <li>Đánh bóng vỏ đồng hồ</li>
          <li>Vệ sinh đồng hồ định kỳ</li>
          <li>Sửa lỗi vào nước, hấp hơi</li>
          <li>Sửa chữa các lỗi về bộ máy cơ và quartz</li>
        </ul>
      </section>

<section className="mb-5 repair-price-section">
  <h2 className="repair-price-title">Bảng giá dịch vụ sửa chữa</h2>
  <div className="repair-price-table-wrapper">
    <table className="repair-price-table">
      <thead className="repair-price-thead">
        <tr>
          <th>Dịch vụ</th>
          <th>Giá tham khảo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Thay pin đồng hồ</td>
          <td>80.000đ - 150.000đ</td>
        </tr>
        <tr>
          <td>Thay mặt kính đồng hồ</td>
          <td>200.000đ - 800.000đ</td>
        </tr>
        <tr>
          <td>Thay dây da chính hãng</td>
          <td>300.000đ - 1.500.000đ</td>
        </tr>
        <tr>
          <td>Bảo dưỡng đồng hồ cơ</td>
          <td>500.000đ - 2.000.000đ</td>
        </tr>
        <tr>
          <td>Sửa chữa bộ máy cơ</td>
          <td>Tùy tình trạng - Báo giá cụ thể</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p className="repair-price-note">* Bảng giá mang tính chất tham khảo, giá thực tế có thể thay đổi theo model và tình trạng đồng hồ.</p>
</section>


      <section className="mb-5">
        <h2 className="h5 fw-bold">Quy trình sửa chữa</h2>
        <ol>
          <li>Tiếp nhận đồng hồ tại quầy kỹ thuật hoặc qua chuyển phát</li>
          <li>Kiểm tra, đánh giá tình trạng và báo giá</li>
          <li>Tiến hành sửa chữa, thay thế linh kiện nếu cần</li>
          <li>Vệ sinh, test độ chính xác, khả năng chống nước</li>
          <li>Bàn giao và bảo hành dịch vụ từ 3-12 tháng</li>
        </ol>
      </section>

      <section className="mb-5">
        <h2 className="h5 fw-bold">Chính sách bảo hành sau sửa chữa</h2>
        <ul>
          <li>Bảo hành 3-12 tháng tùy dịch vụ</li>
          <li>Hỗ trợ test lại và kiểm tra miễn phí trong thời gian bảo hành</li>
          <li>Cam kết linh kiện chính hãng 100%</li>
        </ul>
      </section>

      <section className="mb-5">
        <h2 className="h5 fw-bold">Liên hệ & Địa chỉ tiếp nhận sửa chữa</h2>
        <p>
          <strong>Showroom Hà Nội:</strong> 200A Phố Huế, Hai Bà Trưng, Hà Nội – 0988 888 888
        </p>
        <p>
          <strong>Showroom TP.HCM:</strong> 25 Nguyễn Trãi, Q.1, TP.HCM – 0977 777 777
        </p>
        <p>
          Hoặc liên hệ qua số hotline <strong>1800 1766</strong> (miễn phí) để được tư vấn kỹ thuật.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h5 fw-bold">Hình ảnh thực tế dịch vụ</h2>
        <div className="row">
          <div className="col-md-4 mb-3">
            <img src="https://donghoduyanh.com/upload_images/images/2020/03/25/laudau.jpg" alt="Sửa chữa đồng hồ 1" className="img-fluid rounded"style={{height: "280px"}} />
          </div>
          <div className="col-md-4 mb-3">
            <img src="https://erawatch.vn/wp-content/uploads/2022/04/thay-the-phu-tung-dong-ho.jpg" alt="Sửa chữa đồng hồ 2" className="img-fluid rounded" />
          </div>
          <div className="col-md-4 mb-3">
            <img src="https://erawatch.vn/wp-content/uploads/2017/10/bo-dung-cu-sua-chua-dong-ho-deo-tay-2.jpg" alt="Sửa chữa đồng hồ 3" className="img-fluid rounded" />
          </div>
        </div>
      </section>

      <section className="text-center py-4 border-top">
        <h4 className="fw-bold">Bạn cần tư vấn sửa chữa đồng hồ?</h4>
        <p>Gọi ngay hotline <strong>1800 1766</strong> hoặc nhắn tin trực tiếp qua Fanpage của Việt Anh Watch để được hỗ trợ!</p>
      </section>
    </div>
  );
};

export default SuaDongHo;
