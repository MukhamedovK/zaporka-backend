const mongoose = require("mongoose");

const ordersModel = new mongoose.Schema(
  {
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    ],
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phoneNumber: {
      type: String,
      required: false,
      maxLength: [13, "Phone Number cannot be more than 13 characters"],
      minLength: [9, "Phone Number cannot be less than 9 characters"],
    },
    address: { type: String, required: false },
    totalPrice: { type: Number, required: false },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", ordersModel)
