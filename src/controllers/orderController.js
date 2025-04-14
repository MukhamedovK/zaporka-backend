const ordersModel = require("../models/ordersModel");

const makePaid = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    let order = await ordersModel.findById(id);

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    order.isPaid = true;
    order.paidAt = new Date();
    order.save();

    res.status(200).json({ message: "Order is paid", data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { makePaid };
