const router = require("express").Router();
const ordersModel = require("../models/ordersModel");
const crudCreator = require("../services/crudCreator");
const { makePaid, createOrder } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const orderController = crudCreator(ordersModel, {
  populateFields: ["products.product"],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         products:
 *           type: array
 *           description: List of products with quantity
 *           items:
 *             type: object
 *             required:
 *               - quantity
 *               - product
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID (ObjectId)
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phoneNumber:
 *           type: string
 *           example: +1234567890
 *           minLength: 9
 *           maxLength: 13
 *         address:
 *           type: string
 *           example: 123 Main St, Springfield
 *         totalPrice:
 *           type: number
 *           example: 150.75
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/v1/orders/{id}/pay:
 *   patch:
 *     summary: Mark an order as paid
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to mark as paid
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as paid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order is paid
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid or missing order ID / Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Server error
 */

router.get("/", orderController.getAll);
router.get("/:id", orderController.getOne);
router.post("/", createOrder);
router.put("/:id", authMiddleware, orderController.update);
router.delete("/:id", authMiddleware, orderController.remove);
router.patch("/:id/pay", authMiddleware, makePaid);

module.exports = router;
