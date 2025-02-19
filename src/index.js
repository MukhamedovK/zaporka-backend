require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

// Import configs
const swaggerDocs = require("./config/SwaggerConfig");
const connectDB = require("./config/database");

// Import middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import routes
const productRouter = require("./routes/productRouter")

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Production configuration settings
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
  app.use(cors({ origin: ["*"] }));
} else {
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://zaporka.uz",
      ],
    })
  );
}

// Swagger router
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1", productRouter)

const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;
app.listen(PORT, () => {
  console.log(`Server: ${DOMAIN || `http://localhost:${PORT}`}`);
  console.log(`Swagger: ${DOMAIN || `http://localhost:${PORT}/swagger`}`);
});
