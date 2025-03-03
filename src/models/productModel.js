const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    stock: { type: Number },
    price: { type: [Number] },
    currency: { type: String, default: "UZS" },
    views: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    availabilitiy: { type: Boolean, default: true },
    mainImage: { type: String },
    swiperImages: { type: [String] },
    thickness: { type: String },
    SDR: { type: Number },
    rotationAngle: { type: String },
    material: { type: String },
    sizeInInch: { type: [String] },
    sizeInmm: { type: [Number] },
    DN: { type: [Number] },
    type: { type: [String] },
    manufacturer: { type: String },
    standart: { type: String },
    surfaceMaterial: { type: [String] },
    workEnv: { type: [String] },
    steelGrade: { type: String },
    workEnvTemperature: { type: String },
    nominalPressure: { type: [String] },
    workingPressure: { type: [String] },
    minPressure: { type: [String] },
    maxPressure: { type: [String] },
    model: { type: String },
    application: { type: [String] },
    construction: { type: String },
    serviceLife: { type: String },
    accession: { type: String },
    advantages: { type: [String] },
    category: { type: String, ref: "category", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productModel);
