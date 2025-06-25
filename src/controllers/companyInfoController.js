const companyInfoModel = require("../models/companyInfoModel");

const getCompanyInfo = async (req, res) => {
  try {
    let companyInfo = await companyInfoModel.findOne();
    if (!companyInfo) {
      companyInfo = await companyInfoModel.create({
        email: [""],
        phoneNumbers: [""],
        companyAddress: {
          address: "",
          latitude: "",
          longitude: "",
        },
        telegram: "",
        workTime: "",
        companyInfo: "",
      });
    }
    res.json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompanyInfo = async (req, res) => {
  try {
    let companyInfo = await companyInfoModel.findOneAndUpdate(
      {},
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!companyInfo) {
      return res.status(404).json({ message: "Company Info Not Found" });
    }
    res.json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCompanyInfo, updateCompanyInfo };
