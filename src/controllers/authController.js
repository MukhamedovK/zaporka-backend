require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Все поля обязательны" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Пользователь уже существует" });
    }

    const user = new User({ username, password });
    await user.save();

    const token = generateToken(user);
    res
      .status(201)
      .json({
        success: true,
        message: "Пользователь зарегистрирован",
        id: user._id,
        username: user.username,
        token: token,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Ошибка сервера",
        error: error.message,
      });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Все поля обязательны" });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Неверные учетные данные" });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Ошибка сервера",
        error: error.message,
      });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Пользователь не найден" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Ошибка сервера",
        error: error.message,
      });
  }
};
