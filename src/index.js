require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

// Import middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import configs
const swaggerDocs = require("./config/swaggerConfig");
const connectDB = require("./config/database");

// Import routes
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const ordersRouter = require("./routes/ordersRouter");
const stockRouter = require("./routes/stockRoute");
const companyInfoRouter = require("./routes/companyInfoRouter");
const swiperRouter = require("./routes/swiperRouter");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// CORS
app.use(cors({ origin: "*" }));

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Swagger router
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/company-info", companyInfoRouter);
app.use("/api/v1/swiper", swiperRouter);

const PORT = process.env.PORT || 8000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server: ${DOMAIN}`);
  console.log(`Swagger: ${DOMAIN}/swagger`);
});
