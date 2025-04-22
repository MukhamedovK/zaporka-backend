const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    date: { type: Date, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "StockLog" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);