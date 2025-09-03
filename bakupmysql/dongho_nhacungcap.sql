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
-- Table structure for table `nhacungcap`
--

DROP TABLE IF EXISTS `nhacungcap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhacungcap` (
  `maNCC` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `tenNCC` varchar(255) NOT NULL,
  `diaChi` varchar(255) NOT NULL,
  `sdt` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`maNCC`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhacungcap`
--

LOCK TABLES `nhacungcap` WRITE;
/*!40000 ALTER TABLE `nhacungcap` DISABLE KEYS */;
INSERT INTO `nhacungcap` VALUES ('10a4f706-4b73-4632-84a9-6f731c447128','Đại lý casio Hà Nội','Địa chỉ: 200A Phố Huế, Quận Hai Bà Trưng, Hà Nội','0123456798','hn@watchgmail.com','2025-06-05 03:28:57','2025-06-14 17:05:59'),('550e8400-e29b-41d4-a716-446655440000','Công ty Đồng Hồ VNVIP','123 Đường Lê Lợi, Hà Nội','0987654321','abc@donghoabc.com','2023-01-10 08:30:00','2023-01-10 08:30:00'),('550e8400-e29b-41d4-a716-446655440001','Cung cấp Đồng Hồ BALK','456 Phố Huế, Hà Nội','0912345678','xyz@donghoxyz.vn','2023-01-12 09:00:00','2025-06-05 04:14:52'),('550e8400-e29b-41d4-a716-446655440002','Cung ứng Đồng Hồ Cao Cấp','789 Đường Trần Phú, TP.HCM','0977123456','caocap@dongho.com','2023-01-15 10:00:00','2023-01-15 10:00:00'),('550e8400-e29b-41d4-a716-446655440003','Công ty Đồng Hồ Minh Long','12 Nguyễn Trãi, Đà Nẵng','0901234567','minhlong@dongho.com','2023-01-20 11:00:00','2023-01-20 11:00:00'),('550e8400-e29b-41d4-a716-446655440004','Nhà cung cấp Đồng Hồ Sài Gòn','34 Lê Lợi, TP.HCM','0934567890','saigon@dongho.com','2023-01-22 08:45:00','2023-01-22 08:45:00'),('550e8400-e29b-41d4-a716-446655440005','Công ty Đồng Hồ Hoàng Kim','56 Phan Đình Phùng, Hà Nội','0945678901','hoangkim@dongho.com','2023-01-25 09:15:00','2023-01-25 09:15:00'),('550e8400-e29b-41d4-a716-446655440006','Nhà cung cấp Đồng Hồ Vĩnh Phát','78 Trần Hưng Đạo, Cần Thơ','0989123456','vinhphat@dongho.com','2023-01-27 10:30:00','2023-01-27 10:30:00'),('550e8400-e29b-41d4-a716-446655440007','Cung ứng Đồng Hồ Đông Á','90 Hai Bà Trưng, Hải Phòng','0923456789','donga@dongho.com','2023-01-30 14:00:00','2023-01-30 14:00:00'),('550e8400-e29b-41d4-a716-446655440008','Công ty Đồng Hồ Bảo Long','22 Lý Thường Kiệt, Huế','0919876543','baolong@dongho.com','2023-02-01 13:45:00','2023-02-01 13:45:00'),('550e8400-e29b-41d4-a716-446655440009','Nhà cung cấp Đồng Hồ An Phát','100 Nguyễn Huệ, Nha Trang','0956789012','anphat@dongho.com','2023-02-05 15:00:00','2023-02-05 15:00:00'),('61271966-0a63-494f-9117-72d59e08b6b0','Đại lý sekiro','Tân Định, Quận 1, TP. Hồ Chí Minh ','0192837466','anbWatch@gmail.com','2025-06-05 03:31:00','2025-06-05 03:31:00');
/*!40000 ALTER TABLE `nhacungcap` ENABLE KEYS */;
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
