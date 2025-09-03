const express = require("express");
const {
  getAll,
  getById,
  insert,
  update,
  remove,
  search,
} = require("../controllers/nhaCungCapController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NhaCungCap
 */

/**
 * @swagger
 * /api/nhacungcap/getall:
 *   get:
 *     tags: [NhaCungCap]
 *     responses:
 *       200:
 *         description: A list of NhaCungCap items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NhaCungCap'
 */
router.get("/nhacungcap/getall", getAll);

/**
 * @swagger
 * /api/nhacungcap/getbyid/{id}:
 *   get:
 *     tags: [NhaCungCap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the NhaCungCap item
 *     responses:
 *       200:
 *         description: A NhaCungCap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NhaCungCap'
 *       404:
 *         description: NhaCungCap item not found
 */
router.get("/nhacungcap/getbyid/:id", getById);

/**
 * @swagger
 * /api/nhacungcap/insert:
 *   post:
 *     tags: [NhaCungCap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenNCC:
 *                 type: string
 *               diaChi:
 *                 type: string
 *               sdt:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created NhaCungCap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NhaCungCap'
 */
router.post("/nhacungcap/insert", insert);

/**
 * @swagger
 * /api/nhacungcap/update:
 *   put:
 *     tags: [NhaCungCap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maNCC:
 *                 type: string
 *               tenNCC:
 *                 type: string
 *               diaChi:
 *                 type: string
 *               sdt:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated NhaCungCap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NhaCungCap'
 *       404:
 *         description: NhaCungCap item not found
 */
router.put("/nhacungcap/update", update);

/**
 * @swagger
 * /api/nhacungcap/delete/{id}:
 *   delete:
 *     tags: [NhaCungCap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the NhaCungCap item
 *     responses:
 *       200:
 *         description: The deleted NhaCungCap item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NhaCungCap'
 *       404:
 *         description: NhaCungCap item not found
 */
router.delete("/nhacungcap/delete/:id", remove);

/**
 * @swagger
 * /api/nhacungcap/search:
 *   get:
 *     tags: [NhaCungCap]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term
 *     responses:
 *       200:
 *         description: A list of NhaCungCap items matching the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NhaCungCap'
 */
router.get("/nhacungcap/search", search);

module.exports = router;
