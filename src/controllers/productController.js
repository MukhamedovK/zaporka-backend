const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const imageUrlCreator = require("../services/imageUrlCreator");
const deleteFile = require("../services/deleteFile");

const imageFields = ["images"];
const imageFolder = "products";

const createProduct = async (req, res) => {
  try {
    let images = {};
    imageFields.forEach((field) => {
      if (req.files?.[field]) {
        const imageUrls = Array.isArray(req.files[field])
          ? req.files[field].map((file) =>
              imageUrlCreator(file.filename, imageFolder)
            )
          : [imageUrlCreator(req.files[field][0].filename, imageFolder)];

        images[field] = imageUrls.length === 1 ? imageUrls[0] : imageUrls;
      }
    });

    const newItem = await productModel.create({ ...req.body, ...images });

    let category = await categoryModel
      .findById(req.body?.category)
      .select("productsQuantity");

    if (category) {
      category.productsQuantity += 1;
      await category.save();
    } else {
      return res.status(400).json({ message: "Category does not exists" });
    }

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let images = {};
    imageFields.forEach((field) => {
      if (req.files?.[field]) {
        const imageUrls = Array.isArray(req.files[field])
          ? req.files[field].map((file) =>
              imageUrlCreator(file.filename, imageFolder)
            )
          : [imageUrlCreator(req.files[field][0].filename, imageFolder)];

        images[field] = imageUrls.length === 1 ? imageUrls[0] : imageUrls;
      }
    });

    const query = productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...images },
      { new: true, runValidators: true }
    );

    const oldProduct = await productModel.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    imageFields.forEach((field) => {
      if (images[field] && oldProduct[field]) {
        if (Array.isArray(oldProduct[field])) {
          oldProduct[field].forEach((img) => deleteFile(img));
        } else {
          deleteFile(oldProduct[field]);
        }
      }
    });

    if (
      req.body.category &&
      String(oldProduct.category) !== String(req.body.category)
    ) {
      const oldCategory = await categoryModel
        .findById(oldProduct.category)
        .select("productsQuantity");
      if (oldCategory) {
        oldCategory.productsQuantity -= 1;
        await oldCategory.save();
      }

      const newCategory = await categoryModel
        .findById(req.body.category)
        .select("productsQuantity");
      if (newCategory) {
        newCategory.productsQuantity += 1;
        await newCategory.save();
      }
    }

    query.populate("others").select("images title stock").populate("category");

    const updatedProduct = await query;

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    let category = await categoryModel
      .findById(product?.category)
      .select("productsQuantity");

    if (category) {
      category.productsQuantity -= 1;
      await category.save();
    }

    const item = await productModel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    imageFields.forEach((field) => {
      if (item[field]) {
        if (Array.isArray(item[field])) {
          item[field].forEach((filePath) => deleteFile(filePath));
        } else {
          deleteFile(item[field]);
        }
      }
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await productModel
      .find({ category: category._id })
      .populate("others")
      .select("_id images title stock price")
      .populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, updateProduct, getProductsByCategory, deleteProduct };
