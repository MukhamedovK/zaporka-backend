const categoryModel = require("../models/categoryModel");
const { slugify } = require("transliteration");
const imageUrlCreator = require("../services/imageUrlCreator");
const deleteFile = require("../services/deleteFile");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const finalSlug = slugify(slug && slug !== "string" ? slug : name);
    const existingSlug = await categoryModel.find({ slug: finalSlug });
    if (existingSlug) {
      return res.status(400).json({ message: "Slug has already exists!" });
    }

    const image = req.files?.image?.[0];
    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imagePath = imageUrlCreator(image.filename, "category");

    const category = await categoryModel.create({
      name,
      slug: finalSlug,
      image: imagePath,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existing = await categoryModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    const finalSlug = slugify(
      slug && slug !== "string" ? slug : name || existing.name
    );

    let newImagePath = existing.image;
    const newImage = req.files?.image?.[0];
    if (newImage) {
      newImagePath = imageUrlCreator(newImage.filename, "category");
      if (existing.image) deleteFile(existing.image);
    }

    existing.name = name || existing.name;
    existing.slug = finalSlug;
    existing.image = newImagePath;

    await existing.save();

    res.json(existing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.image) {
      deleteFile(category.image);
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
