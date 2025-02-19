require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

// Import configs
const swaggerDocs = require("./config/swaggerConfig");
const connectDB = require("./config/database");

// Import middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import routes
const productRouter = require("./routes/productRouter")
const authRouter = require("./routes/authRouter");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Настройки CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8000",
  "https://zaporka-backend.onrender.com",
  "https://zaporka.uz",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// Логирование
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Swagger router
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1", productRouter)
app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server: ${DOMAIN}`);
  console.log(`Swagger: ${DOMAIN}/swagger`);
});
