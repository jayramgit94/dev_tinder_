const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const messagesRouter = require("./routes/messages");
const notificationsRouter = require("./routes/notifications");

const getFrontendUrl = () => {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:5173";
};

const createApp = () => {
  const app = express();
  const frontendUrl = getFrontendUrl();
  const isVercel = Boolean(process.env.VERCEL);

  if (isVercel) {
    app.use((req, _res, next) => {
      if (req.url.startsWith("/api")) {
        req.url = req.url.slice(4) || "/";
      }
      next();
    });
  }

  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      res.status(503).json({
        success: false,
        message: "Database unavailable",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  });

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

  app.get("/health", async (_req, res) => {
    try {
      await connectDB();
      res.json({
        success: true,
        message: "DevTinder API is running",
        mongo: "connected",
      });
    } catch (err) {
      res.status(503).json({
        success: false,
        message: "DevTinder API running but MongoDB unavailable",
        mongo: "disconnected",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  });

  app.use("/", authRouter);
  app.use("/", profileRouter);
  app.use("/", requestsRouter);
  app.use("/", userRouter);
  app.use("/", messagesRouter);
  app.use("/", notificationsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
