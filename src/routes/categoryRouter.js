const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const categoryModel = require("../models/categoryModel");
const crudCreator = require("../services/crudCreator");

const categoryController = crudCreator(categoryModel);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Получить все категории
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список всех категорий
 *       500:
 *         description: Ошибка сервера
 *
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Категория успешно создана
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Получить одну категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Данные о категории
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Ошибка сервера
 *
 *   put:
 *     summary: Обновить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Категория успешно обновлена
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Ошибка сервера
 *
 *   delete:
 *     summary: Удалить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Категория успешно удалена
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Ошибка сервера
 */

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.post("/", async (req, res) => {
  try {
    let { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!slug || slug === "string") {
      slug = name.replaceAll(" ", "-");
    }
    const category = await categoryModel.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!slug) {
      slug = name.replaceAll(" ", "-");
    }
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", authMiddleware, categoryController.remove);

module.exports = router;
