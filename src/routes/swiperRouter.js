const express = require("express");
const router = express.Router();

const Swiper = require("../models/swiperModel");
const crudCreator = require("../services/crudCreator");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const swiperCrud = crudCreator(Swiper, {
  useImages: true,
  imageFields: ["image"],
  imageFolder: "swiper",
});

/**
 * @swagger
 * tags:
 *   name: Swiper
 *   description: Swiper management
 */

/**
 * @swagger
 * /api/v1/swiper:
 *   get:
 *     summary: Get all swipers
 *     tags: [Swiper]
 *     responses:
 *       200:
 *         description: List of swipers
 */

/**
 * @swagger
 * /api/v1/swiper/{id}:
 *   get:
 *     summary: Get swiper by ID
 *     tags: [Swiper]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Swiper ID
 *     responses:
 *       200:
 *         description: Swiper found
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/v1/swiper:
 *   post:
 *     summary: Create a swiper
 *     tags: [Swiper]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 */

/**
 * @swagger
 * /api/v1/swiper/{id}:
 *   put:
 *     summary: Update a swiper
 *     tags: [Swiper]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Swiper ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/v1/swiper/{id}:
 *   delete:
 *     summary: Delete a swiper
 *     tags: [Swiper]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Swiper ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */

router.get("/", swiperCrud.getAll);
router.get("/:id", swiperCrud.getOne);
router.post(
  "/",
  [
    authMiddleware,
    uploadMiddleware("swiper", [{ name: "image", maxCount: 5 }]),
  ],
  swiperCrud.create
);
router.put(
  "/:id",
  [
    authMiddleware,
    uploadMiddleware("swiper", [{ name: "image", maxCount: 5 }]),
  ],
  swiperCrud.update
);
router.delete("/:id", swiperCrud.remove);

module.exports = router;
