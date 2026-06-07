require("dotenv").config();

const http = require("http");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/database");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");
const { setIO } = require("./socket/ioInstance");
const { initSocket } = require("./socket/index");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const messagesRouter = require("./routes/messages");
const notificationsRouter = require("./routes/notifications");

const app = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

const swipeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  message: { success: false, message: "Slow down on swipes." },
});

app.use("/login", authLimiter);
app.use("/signup", authLimiter);
app.use("/request/send", swipeLimiter);
app.use("/request/super", swipeLimiter);
app.use(apiLimiter);

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "DevTinder API is running" });
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);
app.use("/", messagesRouter);
app.use("/", notificationsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    credentials: true,
  },
});

setIO(io);
initSocket(io);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`DevTinder API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
