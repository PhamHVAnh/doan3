const express = require("express");
const {
  insert,
  update,
  remove,
  search,
  getByIdDM,
  getAllDM,
  searchDMOrSanPham,
} = require("../controllers/danhMucController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authorizeRole");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DanhMuc
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DanhMuc:
 *       type: object
 *       properties:
 *         maDM:
 *           type: string
 *           format: uuid
 *           description: Mã danh mục
 *         tenDM:
 *           type: string
 *           description: Tên danh mục
 */

/**
 * @swagger
 * /api/danhmuc/insert:
 *   post:

 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenDM
 *             properties:
 *               tenDM:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
 */
router.post("/danhmuc/insert", verifyToken, checkRole(["A00"]), insert);

/**
 * @swagger
 * /api/danhmuc/update:
 *   put:
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - maDM
 *               - tenDM
 *             properties:
 *               maDM:
 *                 type: string
 *               tenDM:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.put("/danhmuc/update", verifyToken, checkRole(["A00"]), update);

/**
 * @swagger
 * /api/danhmuc/delete/{id}:
 *   delete:
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.delete("/danhmuc/delete/:id", verifyToken, checkRole(["A00"]), remove);

/**
 * @swagger
 * /api/danhmuc/search:
 *   get:
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DanhMuc'
 */
router.get("/danhmuc/search", verifyToken, search);

/**
 * @swagger
 * /api/danhmuc/getbyid/{id}:
 *   get:
 *     tags: [DanhMuc]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/danhmuc/getbyid/:id", getByIdDM);

/**
 * @swagger
 * /api/danhmuc/getAll:
 *   get:
 *     tags: [DanhMuc]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DanhMuc'
 */
router.get("/danhmuc/getAll", getAllDM);

/**
 * @swagger
 * /api/danhmuc/search:
 *   get:
 *     tags: [DanhMuc]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm danh mục hoặc sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/danhmuc/search", searchDMOrSanPham);


router.get("/danhmuc/search", searchDMOrSanPham);

module.exports = router;
