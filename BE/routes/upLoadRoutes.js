const express = require("express");
const {
  uploadImage,
  getAllImages,
} = require("../controllers/upLoadController"); // Correct function name
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: No files uploaded
 */
router.post("/upload", uploadImage);

router.get("/images", getAllImages);

module.exports = router;
