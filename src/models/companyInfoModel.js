const mongoose = require("mongoose");

const companyInfoModel = new mongoose.Schema(
  {
    email: [{ type: String, require: false }],
    phoneNumbers: [{ type: String, require: false }],
    companyAddress: {
      address: { type: String, require: false },
      latitude: { type: String, require: false },
      longitude: { type: String, require: false },
    },
    companyInfo: { type: String, require: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("companyInfo", companyInfoModel);
