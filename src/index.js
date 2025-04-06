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

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8000",
  "https://zaporka-backend.onrender.com",
  "https://zaporka.uz",
  "https://zaporka-admin.vercel.app",
];

// ✅ CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no 'origin' (e.g., mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authentication
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS
app.use(cors())

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Swagger router
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server: ${DOMAIN}`);
  console.log(`Swagger: ${DOMAIN}/swagger`);
});
