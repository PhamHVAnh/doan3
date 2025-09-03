const express = require("express");
const { getAll, getById } = require("../controllers/vaiTroController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: VaiTro
 */

/**
 * @swagger
 * /api/vaitro/getall:
 *   get:
 *     tags: [VaiTro]
 *     responses:
 *       200:
 *         description: A list of VaiTro items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VaiTro'
 */
router.get("/vaitro/getall", getAll);

/**
 * @swagger
 * /api/vaitro/getbyid/{id}:
 *   get:
 *     tags: [VaiTro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the VaiTro item
 *     responses:
 *       200:
 *         description: A VaiTro item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VaiTro'
 *       404:
 *         description: VaiTro item not found
 */
router.get("/vaitro/getbyid/:id", getById);

module.exports = router;
