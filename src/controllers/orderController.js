const { sendOrderToBot, updateOrderStatus } = require("../bot");
const ordersModel = require("../models/ordersModel");

const createOrder = async (req, res) => {
  try {
    const order = await ordersModel.create(req.body);

    const populatedOrder = await ordersModel
      .findById(order._id)
      .populate("products.product");

    sendOrderToBot(populatedOrder);
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makePaid = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    let order = await ordersModel.findById(id).populate("products");

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    order.isPaid = true;
    order.paidAt = new Date();
    order.save();

    updateOrderStatus(order);
    res.status(200).json({ message: "Order is paid", data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { makePaid, createOrder };
