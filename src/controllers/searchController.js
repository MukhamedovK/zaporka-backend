const Product = require("../models/productModel");

const searchProduct = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    const searchRegex = new RegExp(query, "i");

    const filter = {
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      results: products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { searchProduct };
