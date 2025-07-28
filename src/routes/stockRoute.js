const router = require("express").Router();
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const StockLog = require("../models/stockLogModel");
const SaleLog = require("../models/saleLogModel");
const Invoice = require("../models/invoiceModel");
const Sale = require("../models/saleModel");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Приход товара (Invoice)
router.post("/add-invoice", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { source, date, items } = req.body;

    if (!source || !items?.length) {
      throw new Error("Укажите источник и хотя бы один товар");
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      throw new Error("Некорректная дата");
    }

    const invoice = new Invoice({ source, date: parsedDate, items: [] });
    await invoice.save({ session });

    const stockLogs = [];

    for (const item of items) {
      const { productId, amount, costPrice, sellingPrice } = item;

      if (!productId || !amount || !costPrice || !sellingPrice) {
        throw new Error("Неверные данные по товару");
      }

      if (costPrice > sellingPrice) {
        throw new Error("Себестоимость не может быть выше цены продажи");
      }

      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error(`Товар не найден: ${productId}`);

      product.stock = (product.stock || 0) + amount;
      await product.save({ session });

      const log = new StockLog({
        product: product._id,
        amount,
        costPrice,
        sellingPrice,
        currency: "UZS",
        addedBy: req.user?.username || "admin",
        invoice: invoice._id,
      });
      stockLogs.push(log);
    }

    const savedLogs = await StockLog.insertMany(stockLogs, { session });
    invoice.items = savedLogs.map((log) => log._id);
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Накладная добавлена", invoice });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// ✅ Продажа товаров (Sale)
router.post("/sell", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Добавьте хотя бы один товар для продажи");
    }

    const logs = [];

    for (const item of items) {
      const { productId, amount, sellingPrice } = item;

      if (!productId || !amount || !sellingPrice) {
        throw new Error("Неполные данные по товару");
      }

      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error(`Товар не найден: ${productId}`);

      if (product.stock < amount) {
        throw new Error(`Недостаточно товара: ${product.title}`);
      }

      product.stock -= amount;
      await product.save({ session });

      logs.push({
        product: product._id,
        amount,
        sellingPrice,
        soldBy: req.user?.username || "admin",
      });
    }

    const saleLogs = await SaleLog.insertMany(logs, { session });

    const sale = new Sale({
      soldBy: req.user?.username || "admin",
      date: new Date(),
      items: saleLogs.map((log) => log._id),
    });
    await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Продажа зарегистрирована", sale });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// ✅ История приходов (Invoices)
router.get("/history", authMiddleware, async (req, res) => {
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

    res.status(200).json({ data: invoices, total, page, limit });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении истории", error: err.message });
  }
});

// ✅ История продаж (Sales)
router.get("/sales", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sales = await Sale.find()
      .populate([{ path: "items", populate: { path: "product", select: "title" } }])
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments();

    res.status(200).json({ data: sales, total, page, limit });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении продаж", error: err.message });
  }
});

// ✅ Остатки товаров
router.get("/remainder", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({}, "title price stock");

    const remainders = products.map((p) => ({
      name: p?.title,
      quantity: p?.stock,
      price: new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(p?.price || 0),
      total: new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format((p?.stock || 0) * (p?.price || 0)),
    }));

    res.status(200).json(remainders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении остатков", error: err.message });
  }
});

// ✅ Подробный лог прихода
router.get("/history-items", authMiddleware, async (req, res) => {
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

    res.status(200).json({ data: logs, total, page, limit });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении логов", error: err.message });
  }
});

// ✅ Подробный лог продаж
router.get("/sale-logs", authMiddleware, async (req, res) => {
  try {
    const logs = await SaleLog.find()
      .populate("product", "title")
      .sort({ date: -1 });

    res.status(200).json({ data: logs });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Ошибка при получении логов продаж",
        error: err.message,
      });
  }
});

module.exports = router;
