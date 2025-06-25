const mongoose = require("mongoose");

const companyInfoModel = new mongoose.Schema(
  {
    email: [{ type: String, required: false }],
    phoneNumbers: [{ type: String, required: false }],
    companyAddress: {
      address: { type: String, requiredd: false },
      latitude: { type: String, require: false },
      longitude: { type: String, required: false },
    },
    telegram: {type: String, required: false},
    workTime: { type: String, required: false },
    companyInfo: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("companyInfo", companyInfoModel);
