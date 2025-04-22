// routes/stock.js
const router = require("express").Router();
const Product = require("../models/productModel");
const StockLog = require("../models/stockLogModel");
const Invoice = require("../models/invoiceModel");

router.post("/add-invoice", async (req, res) => {
  try {
    const { source, date, items } = req.body;

    if (!source) {
      return res.status(400).json({ message: "Укажите источник поступления" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Добавьте хотя бы один товар" });
    }

    // Валидация товаров
    for (const item of items) {
      const { productId, amount, costPrice, sellingPrice, addedBy } = item;

      if (!productId) {
        return res.status(400).json({ message: "Укажите продукт для каждого товара" });
      }
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Неверное количество для товара" });
      }
      if (!costPrice || costPrice <= 0) {
        return res.status(400).json({ message: "Неверная себестоимость для товара" });
      }
      if (!sellingPrice || sellingPrice <= 0) {
        return res.status(400).json({ message: "Неверная цена продажи для товара" });
      }
      if (costPrice > sellingPrice) {
        return res.status(400).json({ message: "Себестоимость не может быть больше цены продажи" });
      }
    }

    // Создаем накладную
    const invoice = new Invoice({
      source,
      date: new Date(date),
      items: [],
    });

    // Обрабатываем каждый товар
    const stockLogs = [];
    for (const item of items) {
      const { productId, amount, costPrice, sellingPrice, addedBy } = item;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      // Обновляем количество на складе
      product.stock = (product.stock || 0) + amount;
      await product.save();

      // Создаем запись StockLog
      const log = new StockLog({
        product: product._id,
        amount,
        costPrice,
        sellingPrice,
        currency: "UZS", // Фиксировано UZS
        addedBy: addedBy || "admin",
        invoice: invoice._id,
      });
      stockLogs.push(log);
    }

    // Сохраняем все StockLog записи
    const savedLogs = await StockLog.insertMany(stockLogs);
    invoice.items = savedLogs.map((log) => log._id);
    await invoice.save();

    res.status(200).json({
      message: "Накладная успешно добавлена",
      invoice,
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const invoices = await Invoice.find()
      .populate({
        path: "items",
        populate: { path: "product", select: "title" },
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments();

    res.status(200).json({
      data: invoices,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении истории", error: err.message });
  }
});

router.get("/history-items", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await StockLog.find()
      .populate("product", "title")
      .populate("invoice", "source date")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StockLog.countDocuments();

    res.status(200).json({
      data: logs,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении истории товаров", error: err.message });
  }
});