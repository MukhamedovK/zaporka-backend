const router = require("express").Router();
const productModel = require("../models/productModel");
const crudCreator = require("../services/crudCreator");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { searchProduct } = require("../controllers/searchController");
const { createProduct, updateProduct } = require("../controllers/productController");

const productController = crudCreator(productModel, {
  useImages: true,
  imageFields: ["mainImage", "swiperImages"],
  imageFolder: "products",
  populateFields: "category",
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
 *           type: array
 *           items:
 *             type: number
 *           description: Цена продукта
 *         currency:
 *           type: string
 *           default: "UZS"
 *           description: Валюта
 *         views:
 *           type: number
 *           default: 0
 *           description: Количество просмотров
 *         ordersCount:
 *           type: number
 *           default: 0
 *           description: Количество заказов
 *         availabilitiy:
 *           type: boolean
 *           default: true
 *           description: Доступность товара
 *         category:
 *           type: string
 *           description: "Id of the category"
 *         mainImage:
 *           type: string
 *           format: binary
 *           description: Главное изображение
 *         swiperImages:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Галерея изображений
 *         thickness:
 *           type: string
 *           description: Толщина
 *         SDR:
 *           type: number
 *           description: SDR
 *         rotationAngle:
 *           type: string
 *           description: Угол поворота
 *         material:
 *           type: string
 *           description: Материал
 *         sizeInInch:
 *           type: array
 *           items:
 *             type: string
 *           description: Размер в дюймах
 *         sizeInmm:
 *           type: array
 *           items:
 *             type: number
 *           description: Размер в мм
 *         DN:
 *           type: array
 *           items:
 *             type: number
 *           description: Диаметр номинальный (DN)
 *         type:
 *           type: array
 *           items:
 *             type: string
 *           description: Тип продукта
 *         manufacturer:
 *           type: string
 *           description: Производитель
 *         standart:
 *           type: string
 *           description: Стандарт
 *         surfaceMaterial:
 *           type: array
 *           items:
 *             type: string
 *           description: Материал поверхности
 *         workEnv:
 *           type: array
 *           items:
 *             type: string
 *           description: Рабочая среда
 *         steelGrade:
 *           type: string
 *           description: Марка стали
 *         workEnvTemperature:
 *           type: string
 *           description: Температура рабочей среды
 *         nominalPressure:
 *           type: array
 *           items:
 *             type: string
 *           description: Номинальное давление
 *         workingPressure:
 *           type: array
 *           items:
 *             type: string
 *           description: Рабочее давление
 *         minPressure:
 *           type: array
 *           items:
 *             type: string
 *           description: Минимальное давление
 *         maxPressure:
 *           type: array
 *           items:
 *             type: string
 *           description: Максимальное давление
 *         model:
 *           type: string
 *           description: Модель
 *         application:
 *           type: array
 *           items:
 *             type: string
 *           description: Область применения
 *         construction:
 *           type: string
 *           description: Конструкция
 *         serviceLife:
 *           type: string
 *           description: Срок службы
 *         accession:
 *           type: string
 *           description: Присоединение
 *         advantages:
 *           type: array
 *           items:
 *             type: string
 *           description: Преимущества
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
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Цена продукта
 *               currency:
 *                 type: string
 *                 default: "UZS"
 *                 description: Валюта
 *               views:
 *                 type: number
 *                 default: 0
 *                 description: Количество просмотров
 *               ordersCount:
 *                 type: number
 *                 default: 0
 *                 description: Количество заказов
 *               availabilitiy:
 *                 type: boolean
 *                 default: true
 *                 description: Доступность товара
 *               category:
 *                 type: string
 *                 description: "Id of the category"
 *               mainImage:
 *                 type: string
 *                 format: binary
 *                 description: Главное изображение
 *               swiperImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Галерея изображений
 *               thickness:
 *                 type: string
 *                 description: Толщина
 *               SDR:
 *                 type: number
 *                 description: SDR
 *               rotationAngle:
 *                 type: string
 *                 description: Угол поворота
 *               material:
 *                 type: string
 *                 description: Материал
 *               sizeInInch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Размер в дюймах
 *               sizeInmm:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Размер в мм
 *               DN:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Диаметр номинальный (DN)
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Тип продукта
 *               manufacturer:
 *                 type: string
 *                 description: Производитель
 *               standart:
 *                 type: string
 *                 description: Стандарт
 *               surfaceMaterial:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Материал поверхности
 *               workEnv:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Рабочая среда
 *               steelGrade:
 *                 type: string
 *                 description: Марка стали
 *               workEnvTemperature:
 *                 type: string
 *                 description: Температура рабочей среды
 *               nominalPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Номинальное давление
 *               workingPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Рабочее давление
 *               minPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Минимальное давление
 *               maxPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Максимальное давление
 *               model:
 *                 type: string
 *                 description: Модель
 *               application:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Область применения
 *               construction:
 *                 type: string
 *                 description: Конструкция
 *               serviceLife:
 *                 type: string
 *                 description: Срок службы
 *               accession:
 *                 type: string
 *                 description: Присоединение
 *               advantages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Преимущества
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
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Цена продукта
 *               currency:
 *                 type: string
 *                 default: "UZS"
 *                 description: Валюта
 *               views:
 *                 type: number
 *                 default: 0
 *                 description: Количество просмотров
 *               ordersCount:
 *                 type: number
 *                 default: 0
 *                 description: Количество заказов
 *               availabilitiy:
 *                 type: boolean
 *                 default: true
 *                 description: Доступность товара
 *               category:
 *                 type: string
 *                 description: "Id of the category"
 *               mainImage:
 *                 type: string
 *                 format: binary
 *                 description: Главное изображение
 *               swiperImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Галерея изображений
 *               thickness:
 *                 type: string
 *                 description: Толщина
 *               SDR:
 *                 type: number
 *                 description: SDR
 *               rotationAngle:
 *                 type: string
 *                 description: Угол поворота
 *               material:
 *                 type: string
 *                 description: Материал
 *               sizeInInch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Размер в дюймах
 *               sizeInmm:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Размер в мм
 *               DN:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Диаметр номинальный (DN)
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Тип продукта
 *               manufacturer:
 *                 type: string
 *                 description: Производитель
 *               standart:
 *                 type: string
 *                 description: Стандарт
 *               surfaceMaterial:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Материал поверхности
 *               workEnv:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Рабочая среда
 *               steelGrade:
 *                 type: string
 *                 description: Марка стали
 *               workEnvTemperature:
 *                 type: string
 *                 description: Температура рабочей среды
 *               nominalPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Номинальное давление
 *               workingPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Рабочее давление
 *               minPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Минимальное давление
 *               maxPressure:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Максимальное давление
 *               model:
 *                 type: string
 *                 description: Модель
 *               application:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Область применения
 *               construction:
 *                 type: string
 *                 description: Конструкция
 *               serviceLife:
 *                 type: string
 *                 description: Срок службы
 *               accession:
 *                 type: string
 *                 description: Присоединение
 *               advantages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Преимущества
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

router.get("/search", searchProduct);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post(
  "/",
  [
    authMiddleware,
    uploadMiddleware("products", [
      { name: "mainImage", maxCount: 1 },
      { name: "swiperImages", maxCount: 5 },
    ]),
  ],
  createProduct
);
router.put(
  "/:id",
  [
    authMiddleware,
    uploadMiddleware("products", [
      { name: "mainImage", maxCount: 1 },
      { name: "swiperImages", maxCount: 5 },
    ]),
  ],
  updateProduct
);
router.delete("/:id", authMiddleware, productController.remove);

module.exports = router;
