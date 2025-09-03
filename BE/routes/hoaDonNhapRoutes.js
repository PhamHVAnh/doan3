const express = require("express");
const {
  getAll,
  getById,
  insert,
  update,
  remove,
  search,
  getByIdCTHDN,
  getAllCTHDN,
} = require("../controllers/hoaDonNhapController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HoaDonNhap
 */

/**
 * @swagger
 * /api/hoadonnhap/getall:
 *   get:
 *     tags: [HoaDonNhap]
 *     responses:
 *       200:
 *         description: A list of HoaDonNhap items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HoaDonNhap'
 */
router.get("/hoadonnhap/getall", getAll);

/**
 * @swagger
 * /api/hoadonnhap/getbyid/{id}:
 *   get:
 *     tags: [HoaDonNhap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the HoaDonNhap item
 *     responses:
 *       200:
 *         description: A HoaDonNhap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HoaDonNhap'
 *       404:
 *         description: HoaDonNhap item not found
 */
router.get("/hoadonnhap/getbyid/:id", getById);

/**
 * @swagger
 * /api/hoadonnhap/insert:
 *   post:
 *     tags: [HoaDonNhap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *
 *               ngayNhap:
 *                 type: string
 *                 format: date
 *                 description: Ngày nhập
 *               giamGia:
 *                 type: number
 *                 description: Giảm giá
 *               phuongThuc:
 *                 type: string
 *                 description: Phương thức thanh toán
 *               maND:
 *                 type: string
 *                 description: Mã người dùng
 *               maNCC:
 *                 type: string
 *                 description: Mã nhà cung cấp
 *               CTHoaDonNhaps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     maSP:
 *                       type: string
 *                       description: Mã sản phẩm
 *                     soLuong:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *                     donGia:
 *                       type: number
 *                       description: Đơn giá sản phẩm
 *     responses:
 *       201:
 *         description: The created or updated HoaDonNhap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HoaDonNhap'
 *       400:
 *         description: Thiếu thông tin bắt buộc hoặc lỗi dữ liệu
 *       404:
 *         description: Hóa đơn nhập hoặc sản phẩm không tồn tại
 */
router.post("/hoadonnhap/insert", insert);

/**
 * @swagger
 * /api/hoadonnhap/update:
 *   put:
 *     tags: [HoaDonNhap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maHDN:
 *                 type: string
 *               ngayNhap:
 *                 type: string
 *                 format: date-time
 *               giamGia:
 *                 type: number
 *               tongTien:
 *                 type: number
 *               phuongThuc:
 *                 type: string
 *               maND:
 *                 type: string
 *               maNCC:
 *                 type: string
 *               CTHoaDonNhaps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ma_CTHDN:
 *                       type: string
 *                     maSP:
 *                       type: string
 *                     soLuong:
 *                       type: number
 *                     donGia:
 *                       type: number
 *                     thanhTien:
 *                       type: number
 *     responses:
 *       200:
 *         description: The updated HoaDonNhap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HoaDonNhap'
 *       400:
 *         description: Thiếu thông tin hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Hóa đơn nhập hoặc sản phẩm không tồn tại
 */
router.put("/hoadonnhap/update", update);

/**
 * @swagger
 * /api/hoadonnhap/delete/{id}:
 *   delete:
 *     tags: [HoaDonNhap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the HoaDonNhap item
 *     responses:
 *       200:
 *         description: The deleted HoaDonNhap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HoaDonNhap'
 *       404:
 *         description: HoaDonNhap item not found
 */
router.delete("/hoadonnhap/delete/:id", remove);

/**
 * @swagger
 * /api/hoadonnhap/search:
 *   get:
 *     tags: [HoaDonNhap]
 *     parameters:
 *       - in: query
 *         name: ngayNhap
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày nhập hàng (YYYY-MM-DD) để tìm hóa đơn nhập
 *       - in: query
 *         name: maSP
 *         schema:
 *           type: string
 *         description: Mã sản phẩm để tìm kiếm trong chi tiết hóa đơn nhập
 *     responses:
 *       200:
 *         description: Danh sách hóa đơn nhập hoặc chi tiết hóa đơn nhập phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 anyOf:
 *                   - $ref: '#/components/schemas/HoaDonNhap'
 *                   - $ref: '#/components/schemas/CTHoaDonNhap'
 *       400:
 *         description: Không có tham số tìm kiếm hợp lệ
 */
router.get("/hoadonnhap/search", search);
/**
 * @swagger
 * /api/cthoadonnhap/getall:
 *   get:
 *     tags: [HoaDonNhap]
 *     responses:
 *       200:
 *         description: Danh sách chi tiết hóa đơn bán
 */

router.get("/cthoadonnhap/getall", getAllCTHDN);
/**
 * @swagger
 * /api/cthoadonnhap/getbyid/{id}:
 *   get:
 *     tags: [HoaDonNhap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the CTHoaDonNhap item
 *     responses:
 *       200:
 *         description: A CTHoaDonNhap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CTHoaDonNhap'
 *       404:
 *         description: CTHoaDonNhap item not found
 */

router.get("/cthoadonnhap/getbyid/:id", getByIdCTHDN);

module.exports = router;
