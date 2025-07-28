const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  soldBy: String,
  date: { type: Date, default: Date.now },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SaleLog" }],
});

module.exports = mongoose.model("Sale", saleSchema);
