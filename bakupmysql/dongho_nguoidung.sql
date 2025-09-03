-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dongho
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoidung` (
  `maND` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `tenND` varchar(255) NOT NULL,
  `diaChi` varchar(255) NOT NULL,
  `ngaySinh` date NOT NULL,
  `sdt` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `taiKhoan` varchar(255) NOT NULL,
  `matKhau` varchar(255) NOT NULL,
  `anhThe` text,
  `maVT` varchar(255) NOT NULL DEFAULT 'U11',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`maND`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `taiKhoan` (`taiKhoan`),
  KEY `maVT` (`maVT`),
  CONSTRAINT `nguoidung_ibfk_1` FOREIGN KEY (`maVT`) REFERENCES `vaitro` (`maVT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoidung`
--

LOCK TABLES `nguoidung` WRITE;
/*!40000 ALTER TABLE `nguoidung` DISABLE KEYS */;
INSERT INTO `nguoidung` VALUES ('2a876169-01a4-43b4-becc-8a57169c57fa','Phạm Hoàng Việt Anh','Cẩm Hoàng - Cẩm Giàng - Hải Dương','2000-01-01','0999888666','phva24004@gmail.com','anhviet','1589c2a3db6bca699926c48eb7e3f4e6','[\"/uploads/1750089228840.gif\"]','A01','2025-06-16 15:51:58','2025-06-16 15:55:58'),('4c77a9d6-ec20-4d81-ace7-2fbd59d967d3','anhp','Hưng Yên ','2000-01-01','0123456799','thanhbinh6a7@gmail.com','anhp','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1750089552797.gif\"]','A01','2025-06-05 04:27:05','2025-06-16 15:59:12'),('63a1bbca-9755-4cb2-b63b-afeb9c53d5fd','user123','Cẩm Giàng-Hải dương','2000-01-01','0123456790','vietanh2404@gmail.com','user123','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2025-06-05 04:29:16','2025-06-16 00:26:27'),('783fcd8c-92d1-40a9-8b06-e232daba76a4','vietanh','Hải Dương-Cẩm Giàng','2000-01-01','01237786888','vietanh24004@gmail.com','vietanh','0a2c7a10b6f1a10ac9e8d1bf5f24be83','[\"/uploads/1749916729729.gif\"]','A01','2025-06-13 17:43:25','2025-06-14 17:07:04'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a01','Nguyễn Văn An','123 Lê Lợi, Hà Nội','1985-05-20','0987654321','an.nguyen@example.com','admin1','21232f297a57a5a743894a0e4a801fc3','[\"/uploads/1750089445670.gif\"]','A00','2023-01-01 08:00:00','2025-06-16 15:57:25'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a02','Trần Thị Bình','456 Phố Huế, Hà Nội','1990-08-15','0912345678','binh.tran@example.com','admin2','21232f297a57a5a743894a0e4a801fc3','[\"/uploads/1747723458569.png\"]','A00','2023-01-02 08:00:00','2023-01-02 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a03','Lê Văn Cường','789 Trần Phú, TP.HCM','1988-03-10','0977123456','cuong.le@example.com','amin3','21232f297a57a5a743894a0e4a801fc3','[\"/uploads/1747723458569.png\"]','A00','2023-01-03 08:00:00','2023-01-03 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a04','Phạm Thị Dung','12 Nguyễn Trãi, Đà Nẵng','1992-11-25','0901234567','dung.pham@example.com','admin4','21232f297a57a5a743894a0e4a801fc3','[\"/uploads/1747723458569.png\"]','A00','2023-01-04 08:00:00','2023-01-04 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a05','Hoàng Văn Đông','34 Lê Lợi, TP.HCM','1987-07-30','0934567890','dong.hoang@example.com','admin5','21232f297a57a5a743894a0e4a801fc3','[\"/uploads/1747723458569.png\"]','A00','2023-01-05 08:00:00','2023-01-05 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a06','Nguyễn Thị Hà','56 Phan Đình Phùng, Hà Nội','1995-04-18','0945678901','ha.nguyen@example.com','hanguyen','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-06 08:00:00','2023-01-06 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a07','Trần Văn Hùng','78 Trần Hưng Đạo, Cần Thơ','1989-12-22','0989123456','hung.tran@example.com','hungt','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-07 08:00:00','2023-01-07 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a08','Lê Thị Hoa','90 Hai Bà Trưng, Hải Phòng','1991-06-05','0923456789','hoa.le@example.com','hoal','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-08 08:00:00','2023-01-08 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a09','Phạm Văn Khoa','22 Lý Thường Kiệt, Huế','1986-10-11','0919876543','khoa.pham@example.com','khoap','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-09 08:00:00','2023-01-09 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a10','Hoàng Thị Lan','100 Nguyễn Huệ, Nha Trang','1993-09-19','0956789012','lan.hoang@example.com','lanh','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-10 08:00:00','2023-01-10 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a11','Đinh Văn Minh','15 Trần Duy Hưng, Hà Nội','1990-02-28','0987001122','minh.dinh@example.com','minhd','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-11 08:00:00','2023-01-11 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a12','Nguyễn Thị My','23 Đinh Tiên Hoàng, Hà Nội','1994-07-16','0977003344','my.nguyen@example.com','mynguyen','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-12 08:00:00','2023-01-12 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a13','Trần Văn Nam','89 Phan Chu Trinh, TP.HCM','1988-05-30','0966005566','nam.tran@example.com','namt','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-13 08:00:00','2023-01-13 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a14','Lê Thị Oanh','77 Hùng Vương, Đà Nẵng','1992-03-25','0955007788','oanh.le@example.com','oanhl','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-14 08:00:00','2023-01-14 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a15','Phạm Văn Phúc','56 Lê Duẩn, Huế','1989-01-15','0944009900','phuc.pham@example.com','phucp','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-15 08:00:00','2023-01-15 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a16','Hoàng Thị Quỳnh','33 Bà Triệu, Hà Nội','1993-12-05','0933001122','quynh.hoang@example.com','quynhh','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-16 08:00:00','2023-01-16 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a17','Đỗ Văn Sơn','44 Trần Nhật Duật, Hải Phòng','1991-11-23','0922003344','son.do@example.com','user','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-17 08:00:00','2023-01-17 08:00:00'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a18','Nguyễn Thị Thu','15 Lý Thường Kiệt, Huế','1987-04-10','0911005566','phamdevil4@gmail.com','user1','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1749612930707.jpg\"]','A01','2023-01-18 08:00:00','2025-06-11 06:51:31'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a19','Nguyễn Quốc Anh','77 Nguyễn Trãi, Đà Nẵng','1986-08-08','0900007788','usheilanak@gmail.com','user2','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-19 08:00:00','2025-06-11 07:20:31'),('c1a6b3f2-1d23-4f8c-8db1-0a7e4e0f1a20','Trần Thị Vân','100 Trần Phú, TP.HCM','1990-09-15','0899999900','satonakata2810@gmail.com','user3','25d55ad283aa400af464c76d713c07ad','[\"/uploads/1747723458569.png\"]','A01','2023-01-20 08:00:00','2025-06-13 00:31:11'),('c9540ac5-c75e-43c5-93af-3417d5f7c17f','admin','Hải Dương','2025-06-04','0869917358','anhp@gmail.com','admin','21232f297a57a5a743894a0e4a801fc3','[\"/uploads/1749917195161.gif\"]','A00','2025-06-04 09:14:28','2025-06-14 16:32:36');
/*!40000 ALTER TABLE `nguoidung` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-20 14:15:56
