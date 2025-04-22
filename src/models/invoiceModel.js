const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    date: { type: Date, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "StockLog" }],
  },
  { timestamps: true }
);

// Добавляем индекс для сортировки по дате
invoiceSchema.index({ date: -1 });

module.exports = mongoose.model("Invoice", invoiceSchema);