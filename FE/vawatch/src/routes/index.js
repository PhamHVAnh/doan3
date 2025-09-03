import LayoutDefault from "../components/Layout/LayoutDefault";
import Error404 from "../pages/Error404";
import GioHang from "../pages/GioHang";
import SanPham from "../pages/SanPham";
import TrangChu from "../pages/TrangChu";
import DangNhap from "../pages/DangNhap";
import ThuongHieu from "../pages/ThuongHieu";
import ChiTietSanPham from "../pages/ChiTiet";
import ThanhToan from "../pages/ThanhToan";
import Diachi from "../pages/Diachi";

import TongQuanAdmin from "../pages/Admin/TongQuanAdmin";
import DanhMucAdmin from "../pages/Admin/DanhMucAdmin";
import SanPhamAdmin from "../pages/Admin/SanPhamAdmin";
import HoaDonBanAdmin from "../pages/Admin/HoaDonBanAdmin";
import HoaDonNhapAdmin from "../pages/Admin/HoaDonNhapAdmin";
import LayoutAdmin from "../components/Layout/LayoutAdmin";
import TaiKhoanAdmin from "../pages/Admin/TaiKhoanAdmin";
import { Navigate } from "react-router-dom";

import NhaCungCapAdmin from "../pages/Admin/NhaCungCapAdmin";
import BrandProducts from "../pages/ThuongHieu/brand";
import HoSoAdmin from "../pages/Admin/HoSoAdmin";
import SanPhamNu from "../pages/SanPham/index2";
import SanPhamDoi from "../pages/SanPham/index3";
import SuaDongHo from "../pages/TinTuc";
import TinTuc from "../pages/TinTuc/page";
import SanPhamKhac from "../pages/TinTuc/page2";
import Filter from "../pages/SanPham/filter";
import ThongTin from "../pages/ThongTin";
import ChiTietBaiViet from "../pages/TinTuc/chitiet/ctAr";
import ChiTietBaiViet1 from "../pages/TinTuc/chitiet/BaiViet";
import DanhMucBaiViet from "../pages/TinTuc/chitiet/danhmuc";
import TimKiemSanPham from "../components/PD/search";


export const routes = [
  // user
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <TrangChu />,
      },
      {
        path: "san-pham/nam",
        element: <SanPham />,
      },
      {
        path: "san-pham/nu",
        element: <SanPhamNu />,
      },
      {
        path: "san-pham/doi",
        element: <SanPhamDoi />,
      },
      {
        path: "gio-hang",
        element: <GioHang />,
      },
      {
        path: "dang-nhap",
        element: <DangNhap />,
      },
      {
        path: "thuong-hieu",
        element: <ThuongHieu />,
      },
      {
        path: "chi-tiet/:id",
        element: <ChiTietSanPham />,
      },
      {
        path: "thanh-toan",
        element: <ThanhToan />,
      },
      {
        path: "dia-chi",
        element: <Diachi />,
      },
      {
        path: "sua-chua",
        element: <SuaDongHo />,
      },
      {
        path: "tin-tuc",
        element: <TinTuc />,
      },
          {
        path: "tin-tuc/:id",
        element: <ChiTietBaiViet />,
      },
          
          {
        path: "bai-viet/:id",
        element: <ChiTietBaiViet1 />,
      },
                {
        path: "danh-muc/:category",
        element: <DanhMucBaiViet />,
      },
      {
        path: "san-pham-khac",
        element: <SanPhamKhac />,
      },
      {
        path: "thuong-hieu/:brand",
        element: <BrandProducts />,
      },
        {
        path: "thong-tin",
        element: <ThongTin />,
      },
      {
        path: "filter",
        element: <Filter/>,
      },
      {
        path: "Tim-kiem",
        element: <TimKiemSanPham/>,
      },
    ],
  },

  // error
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { path: "", element: <Navigate to="tong-quan" replace /> },
      {
        path: "tong-quan",
        element: <TongQuanAdmin />,
      },
      {
        path: "danh-muc-admin",
        element: <DanhMucAdmin />,
      },
      {
        path: "san-pham-admin",
        element: <SanPhamAdmin />,
      },

      {
        path: "nha-cung-cap-admin",
        element: <NhaCungCapAdmin />,
      },
      {
        path: "don-xuat-admin",
        element: <HoaDonBanAdmin />,
      },
      {
        path: "don-nhap-admin",
        element: <HoaDonNhapAdmin />,
      },
      {
        path: "tai-khoan-admin",
        element: <TaiKhoanAdmin />,
      },
      {
        path: "ho-so-admin",
        element: <HoSoAdmin />,
      },
    ],
  },
];
