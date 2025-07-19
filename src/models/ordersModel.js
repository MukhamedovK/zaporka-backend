const mongoose = require("mongoose");
const Counter = require("./counterModel");

const ordersModel = new mongoose.Schema(
  {
    orderNumber: { type: Number, unique: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    phoneNumber: {
      type: String,
      required: true,
      maxLength: [13, "Phone Number cannot be more than 13 characters"],
      minLength: [9, "Phone Number cannot be less than 9 characters"],
    },
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

ordersModel.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderNumber = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Orders", ordersModel);
