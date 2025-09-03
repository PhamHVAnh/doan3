const express = require("express");
const { login } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Login
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taiKhoan:
 *                 type: string
 *               matKhau:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Mật khẩu không đúng
 *       404:
 *         description: Tài khoản không tồn tại
 */
router.post("/Login", login);

module.exports = router;
