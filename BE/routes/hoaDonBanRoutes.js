// const express = require("express");
// const {
//   getByIdCTHDB,
//   getAllCTHDB,
//   getAll,
//   getById,
//   insert,
//   update,
//   remove,
//   search,
// } = require("../controllers/hoaDonBanController");
// const router = express.Router();

// router.get("/hoadonban/getall", getAll);
// router.get("/hoadonban/getbyid/:id", getById);
// router.post("/hoadonban/insert", insert);
// router.put("/hoadonban/update", update);
// router.delete("/hoadonban/delete/:id", remove);
// router.get("/hoadonban/search", search);

// router.get("/cthoadonban/getall", getAllCTHDB);
// router.get("/cthoadonban/getbyid/:id", getByIdCTHDB);

// module.exports = router;

const express = require("express");
const {
  getByIdCTHDB,
  getAllCTHDB,
  getAll,
  getById,
  insert,
  update,
  remove,
  search,
  getByUser,
} = require("../controllers/hoaDonBanController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HoaDonBan
 */

/**
 * @swagger
 * /api/hoadonban/getall:
 *   get:
 *     tags: [HoaDonBan]
 *     responses:
 *       200:
 *         description: Danh sách hóa đơn bán
 */
router.get("/hoadonban/getall", getAll);

/**
 * @swagger
 * /api/hoadonban/getbyid/{id}:
 *   get:
 *     tags: [HoaDonBan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã hóa đơn bán
 *     responses:
 *       200:
 *         description: Một hóa đơn bán
 *       404:
 *         description: Không tìm thấy
 */
router.get("/hoadonban/getbyid/:id", getById);

/**
 * @swagger
 * /api/hoadonban/insert:
 *   post:
 *     tags: [HoaDonBan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ngayBan:
 *                 type: string
 *                 format: date
 *               trangThai:
 *                 type: string
 *               giamGia:
 *                 type: number
 *               tongTien:
 *                 type: number
 *               phuongThuc:
 *                 type: string
 *               maND:
 *                 type: string
 *               CTHoaDonBans:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - ma_CTHDB
 *                     - maSP
 *                     - soLuong
 *                     - donGia
 *                     - thanhTien
 *                   properties:
 *                     ma_CTHDB:
 *                       type: string
 *                     maSP:
 *                       type: string
 *                     soLuong:
 *                       type: integer
 *                     donGia:
 *                       type: number
 *                       format: float
 *                     thanhTien:
 *                       type: number
 *                       format: float
 *     responses:
 *       201:
 *         description: Đã tạo hóa đơn bán
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/hoadonban/insert", insert);

/**
 * @swagger
 * /api/hoadonban/update:
 *   put:
 *     tags: [HoaDonBan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maHDB:
 *                 type: string
 *               ngayBan:
 *                 type: string
 *                 format: date
 *               trangThai:
 *                 type: string
 *               giamGia:
 *                 type: number
 *               tongTien:
 *                 type: number
 *               phuongThuc:
 *                 type: string
 *               maND:
 *                 type: string
 *               CTHoaDonBans:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - ma_CTHDB
 *                     - maSP
 *                     - soLuong
 *                     - donGia
 *                     - thanhTien
 *                   properties:
 *                     ma_CTHDB:
 *                       type: string
 *                     maSP:
 *                       type: string
 *                     soLuong:
 *                       type: integer
 *                     donGia:
 *                       type: number
 *                       format: float
 *                     thanhTien:
 *                       type: number
 *                       format: float
 *     responses:
 *       200:
 *         description: Đã cập nhật hóa đơn bán
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.put("/hoadonban/update", update);

/**
 * @swagger
 * /api/hoadonban/delete/{id}:
 *   delete:
 *     tags: [HoaDonBan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã hóa đơn bán
 *     responses:
 *       200:
 *         description: Đã xóa hóa đơn bán
 *       404:
 *         description: Không tìm thấy hóa đơn
 */
router.delete("/hoadonban/delete/:id", remove);

/**
 * @swagger
 * /api/hoadonban/search:
 *   get:
 *     tags: [HoaDonBan]
 *     parameters:
 *       - in: query
 *         name: ngayBan
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: maSP
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *       400:
 *         description: Tham số không hợp lệ
 */
router.get("/hoadonban/search", search);

/**
 * @swagger
 * /api/cthoadonban/getall:
 *   get:
 *     tags: [HoaDonBan]
 *     responses:
 *       200:
 *         description: Danh sách chi tiết hóa đơn bán
 */
router.get("/cthoadonban/getall", getAllCTHDB);

/**
 * @swagger
 * /api/cthoadonban/getbyid/{id}:
 *   get:
 *     tags: [HoaDonBan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách chi tiết của hóa đơn
 */
router.get("/cthoadonban/getbyid/:id", getByIdCTHDB);

router.get("/hoadonban/getbyuser/:maND", getByUser);

module.exports = router;

