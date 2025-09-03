const express = require("express");
const {
  getAll,
  getById,
  insert,
  update,
  remove,
  search,
  updatePassword,
} = require("../controllers/nguoiDungController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NguoiDung
 */

/**
 * @swagger
 * /api/nguoidung/getall:
 *   get:
 *     tags: [NguoiDung]
 *     responses:
 *       200:
 *         description: A list of NguoiDung items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NguoiDung'
 */
router.get("/nguoidung/getall", getAll);

/**
 * @swagger
 * /api/nguoidung/getbyid/{id}:
 *   get:
 *     tags: [NguoiDung]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the NguoiDung item
 *     responses:
 *       200:
 *         description: A NguoiDung item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NguoiDung'
 *       404:
 *         description: NguoiDung item not found
 */
router.get("/nguoidung/getbyid/:id", getById);

/**
 * @swagger
 * /api/nguoidung/insert:
 *   post:
 *     tags: [NguoiDung]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenND:
 *                 type: string
 *               diaChi:
 *                 type: string
 *               ngaySinh:
 *                 type: string
 *                 format: date
 *               sdt:
 *                 type: string
 *               email:
 *                 type: string
 *               taiKhoan:
 *                 type: string
 *               matKhau:
 *                 type: string
 *               anhThe:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "URL của ảnh thẻ"
 *     responses:
 *       201:
 *         description: The created NguoiDung item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NguoiDung'
 */
router.post("/nguoidung/insert", insert);

/**
 * @swagger
 * /api/nguoidung/update:
 *   put:
 *     tags: [NguoiDung]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maND:
 *                 type: string
 *               tenND:
 *                 type: string
 *               diaChi:
 *                 type: string
 *               ngaySinh:
 *                 type: string
 *                 format: date
 *               sdt:
 *                 type: string
 *               email:
 *                 type: string
 *               anhThe:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "URL của ảnh thẻ"
 *               maVT:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated NguoiDung item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NguoiDung'
 *       404:
 *         description: NguoiDung item not found
 */
router.put("/nguoidung/update", update);

/**
 * @swagger
 * /api/nguoidung/delete/{id}:
 *   delete:
 *     tags: [NguoiDung]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the NguoiDung item
 *     responses:
 *       200:
 *         description: The deleted NguoiDung item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NguoiDung'
 *       404:
 *         description: NguoiDung item not found
 */
router.delete("/nguoidung/delete/:id", remove);

/**
 * @swagger
 * /api/nguoidung/search:
 *   get:
 *     tags: [NguoiDung]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term
 *     responses:
 *       200:
 *         description: A list of NguoiDung items matching the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NguoiDung'
 */
router.get("/nguoidung/search", search);

/**
 * @swagger
 * /api/nguoidung/updatepassword:
 *   patch:
 *     tags: [NguoiDung]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taiKhoan:
 *                 type: string
 *                 description: Tên tài khoản của người dùng
 *               matKhauCu:
 *                 type: string
 *                 description: Mật khẩu cũ của người dùng
 *               matKhauMoi:
 *                 type: string
 *                 description: Mật khẩu mới của người dùng
 *     responses:
 *       200:
 *         description: Mật khẩu người dùng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taiKhoan:
 *                   type: string
 *                 matKhau:
 *                   type: string
 *       400:
 *         description: Mật khẩu cũ không đúng
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.patch("/nguoidung/updatepassword", updatePassword);

module.exports = router;
