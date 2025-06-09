const router = require("express").Router();
const productModel = require("../models/productModel");
const crudCreator = require("../services/crudCreator");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { searchProduct } = require("../controllers/searchController");
const {
  createProduct,
  updateProduct,
  getProductsByCategory,
} = require("../controllers/productController");

const productController = crudCreator(productModel, {
  useImages: true,
  imageFields: ["images"],
  imageFolder: "products",
  populateFields: ["category", "others"],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Название продукта
 *         description:
 *           type: string
 *           description: Описание продукта
 *         stock:
 *           type: number
 *           description: Количество товара в наличии
 *         price:
 *           type: number
 *           description: Цена продукта
 *         size:
 *           type: string
 *           description: Размер продукта
 *         category:
 *           type: string
 *           description: "Id of the category"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Галерея изображений
 *         material:
 *           type: string
 *           description: Материал
 *         maxTemperature:
 *           type: string
 *           description: Максимальная температура
 *         type:
 *           type: string
 *           description: Вид продукта
 *         pressure:
 *           type: number
 *           description: Давление
 *         controlType:
 *           type: string
 *           description: Тип управления
 *         weight:
 *           type: string
 *           description: Вес продукта
 *         others:
 *           type: array
 *           items:
 *             type: string
 *           description: Другие продукты
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Получить список всех продуктов
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех продуктов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Создать новый продукт
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название продукта
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *               stock:
 *                 type: number
 *                 description: Количество товара в наличии
 *               price:
 *                 type: number
 *                 description: Цена продукта
 *               size:
 *                 type: string
 *                 description: Размер продукта
 *               category:
 *                 type: string
 *                 description: "Id of the category"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Галерея изображений
 *               material:
 *                 type: string
 *                 description: Материал
 *               maxTemperature:
 *                 type: string
 *                 description: Максимальная температура
 *               type:
 *                 type: string
 *                 description: Вид продукта
 *               pressure:
 *                 type: number
 *                 description: Давление
 *               controlType:
 *                 type: string
 *                 description: Тип управления
 *               weight:
 *                 type: string
 *                 description: Вес продукта
 *               others:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Другие продукты
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации данных
 *
 * /api/v1/products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Продукт не найден
 *
 *   put:
 *     summary: Обновить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название продукта
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *               stock:
 *                 type: number
 *                 description: Количество товара в наличии
 *               price:
 *                 type: number
 *                 description: Цена продукта
 *               size:
 *                 type: string
 *                 description: Размер продукта
 *               category:
 *                 type: string
 *                 description: "Id of the category"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Галерея изображений
 *               material:
 *                 type: string
 *                 description: Материал
 *               maxTemperature:
 *                 type: string
 *                 description: Максимальная температура
 *               type:
 *                 type: string
 *                 description: Вид продукта
 *               pressure:
 *                 type: number
 *                 description: Давление
 *               controlType:
 *                 type: string
 *                 description: Тип управления
 *               weight:
 *                 type: string
 *                 description: Вес продукта
 *               others:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Другие продукты
 *     responses:
 *       200:
 *         description: Продукт успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Продукт не найден
 *
 *   delete:
 *     summary: Удалить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт успешно удален
 *       404:
 *         description: Продукт не найден
 */

/**
 * @swagger
 * /api/v1/products/search:
 *   get:
 *     summary: Search products by title or description
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term to match against product title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Successful search with product results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/products/by-category/{slug}:
 *   get:
 *     summary: Get products by category slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the category to filter products
 *     responses:
 *       200:
 *         description: List of products in the given category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

router.get("/search", searchProduct);
router.get("/by-category/:slug", getProductsByCategory);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post(
  "/",
  [
    authMiddleware,
    uploadMiddleware("products", [{ name: "images", maxCount: 5 }]),
  ],
  createProduct
);
router.put(
  "/:id",
  [
    authMiddleware,
    uploadMiddleware("products", [{ name: "images", maxCount: 5 }]),
  ],
  updateProduct
);
router.delete("/:id", authMiddleware, productController.remove);

module.exports = router;
