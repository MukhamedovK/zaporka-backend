const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    costPrice: { type: Number, required: true }, // New field for cost price
    addedBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", stockLogSchema);