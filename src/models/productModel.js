const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    stock: { type: Number },
    size: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    images: { type: [String], required: true },
    material: { type: String, required: false },
    maxTemperature: { type: String, required: false },
    pressure: { type: Number, required: false },
    controlType: { type: String, required: false },
    type: { type: String, required: false },
    others: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productModel);
