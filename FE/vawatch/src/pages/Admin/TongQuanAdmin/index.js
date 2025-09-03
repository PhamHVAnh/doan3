import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./tongQuan.scss";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

function TongQuanAdmin() {
  const [stats, setStats] = useState({
    danhMucCount: 0,
    sanPhamCount: 0,
    nguoiDungCount: 0,
    hoaDonBanCount: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [ndData, setNdData] = useState([]);
  const [dailyOrderStats, setDailyOrderStats] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const [orderStatusStats, setOrderStatusStats] = useState({
    "Chờ xác nhận": 0,
    "Đã duyệt": 0,
    "Đã hủy": 0,
  });
  const [orderAmountStats, setOrderAmountStats] = useState({
    "Chờ xác nhận": 0,
    "Đã duyệt": 0,
    "Đã hủy": 0,
  });

  // State lọc
  const [filterOrderStatus, setFilterOrderStatus] = useState("Tất cả");
  const [filterUserRole, setFilterUserRole] = useState("Tất cả");

  // Phân trang khách hàng
  const [customerPage, setCustomerPage] = useState(1);
  const customerPageSize = 5;

  // Phân trang đơn hàng
  const [orderPage, setOrderPage] = useState(1);
  const orderPageSize = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const [dmRes, spRes, ndRes, hdRes, ctHdbRes] = await Promise.all([
          fetch("http://localhost:3002/api/danhmuc/getall"),
          fetch("http://localhost:3002/api/sanpham/getall"),
          fetch("http://localhost:3002/api/nguoidung/getall"),
          fetch("http://localhost:3002/api/hoadonban/getall"),
          fetch("http://localhost:3002/api/cthoadonban/getall"),
        ]);
        const dmData = await dmRes.json();
        const spData = await spRes.json();
        const ndList = await ndRes.json();
        const hdData = await hdRes.json();
        const ctHdbData = await ctHdbRes.json();

        let totalRevenue = 0;
        const dailyStats = {};
        const productSales = {};

        const statusStats = { "Chờ xác nhận": 0, "Đã duyệt": 0, "Đã hủy": 0 };
        const amountStats = { "Chờ xác nhận": 0, "Đã duyệt": 0, "Đã hủy": 0 };

        const formattedOrders = hdData.map((o) => {
          const user = ndList.find((u) => u.maND === o.maND);
          let statusText = "Chờ xác nhận";
          let statusColor = "bg-secondary";

          // Chuẩn hóa trạng thái đơn hàng
          if (o.trangThai === "Đã duyệt") {
            statusText = "Đã duyệt";
            statusColor = "bg-success text-white";
            totalRevenue += o.tongTien || 0; // Chỉ tính doanh thu cho đơn hàng đã duyệt

            // Thống kê doanh thu theo ngày
            const orderDate = new Date(o.ngayBan);
            const dateString = orderDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
            dailyStats[dateString] = (dailyStats[dateString] || 0) + (o.tongTien || 0);

            // Thống kê sản phẩm bán chạy
            const orderDetails = ctHdbData.filter(item => item.maHDB === o.maHDB);
            orderDetails.forEach(detail => {
              productSales[detail.maSP] = (productSales[detail.maSP] || 0) + detail.soLuong;
            });

          } else if (o.trangThai === "Đã huỷ" || o.trangThai === "Đã hủy") {
            statusText = "Đã hủy";
            statusColor = "bg-danger text-white";
          } else if (o.trangThai === "Chờ duyệt") {
            statusText = "Chờ xác nhận";
            statusColor = "bg-warning text-dark";
          }

          statusStats[statusText]++;
          amountStats[statusText] += o.tongTien || 0;

          return {
            id: o.maHDB,
            customer: user?.tenND || "Không xác định",
            date: o.ngayBan
              ? new Date(o.ngayBan).toLocaleDateString("vi-VN")
              : "",
            amount: o.tongTien || 0,
            status: statusText,
            statusColor,
            phuongThuc: o.phuongThuc || "Không rõ",
            user,
          };
        });

        // Lấy dữ liệu 7 ngày gần nhất cho biểu đồ cột
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 ngày bao gồm cả ngày hôm nay
        const last7DaysData = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo);
          date.setDate(sevenDaysAgo.getDate() + i);
          const dateString = date.toLocaleDateString("en-CA");
          last7DaysData.push({
            name: date.toLocaleDateString("vi-VN"),
            DoanhThu: dailyStats[dateString] || 0,
          });
        }

        // Lấy top 5 sản phẩm bán chạy nhất
        const sortedProducts = Object.entries(productSales)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);

        const topProductsData = sortedProducts.map(([maSP, soLuong]) => {
          const product = spData.find(p => p.maSP === maSP);
          return {
            name: product?.tenSP || `SP ${maSP}`,
            value: soLuong,
          };
        });

        setStats({
          danhMucCount: dmData.length,
          sanPhamCount: spData.length,
          nguoiDungCount: ndList.length,
          hoaDonBanCount: hdData.length,
          totalRevenue: totalRevenue,
        });
        setNdData(ndList);
        setOrders(formattedOrders);
        setOrderStatusStats(statusStats);
        setOrderAmountStats(amountStats);
        setDailyOrderStats(last7DaysData);
        setTopSellingProducts(topProductsData);

        // Reset trang khi dữ liệu mới load
        setCustomerPage(1);
        setOrderPage(1);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    }
    fetchData();
  }, []);

  // Lọc dữ liệu khách hàng theo chức vụ
  const filteredCustomers = ndData.filter((u) => {
    switch (filterUserRole) {
      case "Khách hàng":
        return u.maVT === "A01";
      case "Nhân viên":
        return u.maVT === "A00";

      default:
        return true;
    }
  });
  

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = orders.filter((o) => {
    if (filterOrderStatus === "Tất cả") return true;
    return o.status === filterOrderStatus;
  });

  // Phân trang dữ liệu sau lọc
  const totalCustomerPages = Math.ceil(filteredCustomers.length / customerPageSize);
  const pagedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customerPageSize,
    customerPage * customerPageSize
  );

  const totalOrderPages = Math.ceil(filteredOrders.length / orderPageSize);
  const pagedOrders = filteredOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );

  // Reset trang khi filter thay đổi để không bị page vượt
  useEffect(() => {
    setCustomerPage(1);
  }, [filterUserRole]);

  useEffect(() => {
    setOrderPage(1);
  }, [filterOrderStatus]);

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">Trang Tổng Quan</h1>

      {/* Thống kê tổng quan */}
      <div className="row g-3 mb-4 flex-wrap justify-content-center">
  <div className="col-6 col-md-3">
    <div className="stat-square bg-primary text-white p-3 rounded text-center shadow-sm">
      <i className="bi bi-box-seam fs-3"></i>
      <div className="fs-4 fw-bold">{stats.sanPhamCount}</div>
      <div>Sản phẩm</div>
    </div>
  </div>
  <div className="col-6 col-md-3">
    <div className="stat-square bg-success text-white p-3 rounded text-center shadow-sm">
      <i className="bi bi-bag-check fs-3"></i>
      <div className="fs-4 fw-bold">{stats.hoaDonBanCount}</div>
      <div>Đơn hàng</div>
    </div>
  </div>
  <div className="col-6 col-md-3">
    <div className="stat-square bg-info text-white p-3 rounded text-center shadow-sm">
      <i className="bi bi-people fs-3"></i>
      <div className="fs-4 fw-bold">{stats.nguoiDungCount}</div>
      <div>Người dùng</div>
    </div>
  </div>
  <div className="col-6 col-md-3">
    <div className="stat-square bg-danger text-white p-3 rounded text-center shadow-sm">
      <i className="bi bi-tags fs-3"></i>
      <div className="fs-4 fw-bold">{stats.danhMucCount}</div>
      <div>Danh mục</div>
    </div>
  </div>
  {/* <div className="col-12 col-md-4">
    <div className="stat-square bg-warning text-dark p-3 rounded text-center shadow-sm">
      <i className="bi bi-currency-exchange fs-3"></i>
      <div className="fs-4 fw-bold">{stats.totalRevenue.toLocaleString()} VND</div>
      <div>Doanh thu (Đã duyệt)</div>
    </div>
  </div> */}
</div>


      {/* Biểu đồ */}
      <div className="row mb-5">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Doanh thu 7 ngày gần nhất</h5>
            </div>
            <div className="card-body" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyOrderStats}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis formatter={(value) => `${Number(value).toLocaleString()} VND`} />
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString()} VND`} />
                  <Bar dataKey="DoanhThu" fill="#8884d8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
  <div className="card shadow-sm h-100">
    <div className="card-header bg-info text-white">
      <h5 className="mb-0">Top 5 sản phẩm bán chạy</h5>
    </div>
    <div className="card-body" style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={topSellingProducts}
            cx="40%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={({ name, percent }) => {
              const shortName = name.length > 12 ? name.slice(0, 10) + "..." : name;
              return `${shortName}: ${(percent * 100).toFixed(0)}%`;
            }}
            dataKey="value"
          >
            {topSellingProducts.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) =>
              [`${Number(value).toLocaleString()} sản phẩm`, props.payload.name]
            }
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ maxWidth: 120, fontSize: '0.85rem' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      </div>

      {/* Bảng khách hàng */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Danh sách khách hàng</h5>
          <select
  className="form-select form-select-sm w-auto"
  value={filterUserRole}
  onChange={(e) => setFilterUserRole(e.target.value)}
>
  <option value="Tất cả">Tất cả</option>
  <option value="Khách hàng">Khách hàng</option>
  <option value="Nhân viên">Nhân viên</option>
</select>

        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Mã ND</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {pagedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                pagedCustomers.map((u, idx) => (
                  <tr key={u.maND}>
                    <td>{(customerPage - 1) * customerPageSize + idx + 1}</td>
                    <td>{u.maND}</td>
                    <td>{u.tenND}</td>
                    <td>{u.email}</td>
                    <td>{u.sdt}</td>
                    <td>{u.diaChi}</td>
    
                 <td>
                 <td>
  <span className={`badge ${u.maVT === "A01" ? "bg-success" : "bg-warning text-dark"}`}>
    {u.maVT === "A01" ? "Khách hàng" : "Nhân viên"}
  </span>
</td>

</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Phân trang khách hàng */}
        <nav className="mt-2">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${customerPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCustomerPage(customerPage - 1)}
              >
                &laquo;
              </button>
            </li>
            {[...Array(totalCustomerPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${customerPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCustomerPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                customerPage === totalCustomerPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCustomerPage(customerPage + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bảng đơn hàng */}
      <div className="card shadow-sm mb-5">
       <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center px-3 py-2 rounded-top shadow-sm">
  <h5 className="mb-0 fw-semibold">Đơn hàng mới nhất</h5>
  <select
    className="form-select form-select-sm w-auto custom-select-order"
    value={filterOrderStatus}
    onChange={(e) => setFilterOrderStatus(e.target.value)}
  >
    <option value="Tất cả">Tất cả</option>
    <option value="Chờ xác nhận">Chờ xác nhận</option>
    <option value="Đã duyệt">Đã duyệt</option>
    <option value="Đã hủy">Đã hủy</option>
  </select>
</div>

        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Mã HDB</th>
                <th>Khách hàng</th>
                <th>Ngày bán</th>
                <th>Phương thức</th>
                <th>Tổng tiền (VNĐ)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                pagedOrders.map((o, idx) => (
                  <tr key={o.id}>
                    <td>{(orderPage - 1) * orderPageSize + idx + 1}</td>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.date}</td>
                    <td>{o.phuongThuc}</td>
                    <td>{o.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${o.statusColor}`}>{o.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Phân trang đơn hàng */}
        <nav className="mt-2">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${orderPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setOrderPage(orderPage - 1)}
              >
                &laquo;
              </button>
            </li>
            {[...Array(totalOrderPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${orderPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setOrderPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${orderPage === totalOrderPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setOrderPage(orderPage + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default TongQuanAdmin;
