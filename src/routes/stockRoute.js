const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/productModel");
const StockLog = require("../models/stockLogModel");

// Добавить приход
router.post("/add/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const { amount, addedBy } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Неверное количество для прихода" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    // Обновляем количество
    product.stock = (product.stock || 0) + amount;
    await product.save();

    // Создаём запись в истории
    const log = new StockLog({
      product: product._id,
      amount,
      addedBy: typeof addedBy === "string" && addedBy.trim() ? addedBy : "admin"
    });
    await log.save();

    res.status(200).json({
      message: "Приход добавлен, количество обновлено",
      product,
      log,
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// Получить историю приходов по продукту
router.get("/history/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;

    const logs = await StockLog.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении истории", error: err.message });
  }
});
// Новый маршрут
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate("product", "title") // Получаем название товара
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении истории", error: err.message });
  }
});

module.exports = router;
