const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const imageUrlCreator = require("../services/imageUrlCreator");
const deleteFile = require("../services/deleteFile");

const imageFields = ["mainImage", "swiperImages"];
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

    let category = await categoryModel
      .findById(req.body?.category)
      .select("productsQuantity");

    if (category) {
      category.productsQuantity += 1;
      await category.save();
    } else {
      return res.status(400).json({ message: "Category does not exists" });
    }

    const newItem = await productModel.create({ ...req.body, ...images });
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

    const query = productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...images },
      { new: true, runValidators: true }
    );

    if (populateFields) query.populate(populateFields);

    const updatedProduct = await query;

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createProduct, updateProduct };
