const mongoose = require("mongoose");

const swiperModel = new mongoose.Schema(
  {
    image: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("swiper", swiperModel);
