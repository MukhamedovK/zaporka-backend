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
  credentials: true, // Разрешаем передачу куков и заголовков авторизации
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Используем CORS с нужными настройками
app.use(cors(corsOptions));

// Middleware для обработки preflight-запросов (OPTIONS)
app.options("*", cors(corsOptions));

// Вывод заголовков CORS для отладки
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("CORS Headers:", res.getHeaders());
  next();
});

// Логирование
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Swagger router
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server: ${DOMAIN}`);
  console.log(`Swagger: ${DOMAIN}/swagger`);
});
