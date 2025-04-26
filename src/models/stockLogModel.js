// models/stockLogModel.js
const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    currency: { type: String, required: true, default: "UZS" }, // Фиксировано UZS
    addedBy: { type: String },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", stockLogSchema);