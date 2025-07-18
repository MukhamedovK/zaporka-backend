const mongoose = require("mongoose");

const swiperModel = new mongoose.Schema(
  {
    image: { type: String, required: true },
    link: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("swiper", swiperModel);
