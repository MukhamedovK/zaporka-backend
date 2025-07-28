const mongoose = require("mongoose");

const saleLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  amount: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  soldBy: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SaleLog", saleLogSchema);
