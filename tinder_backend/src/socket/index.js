const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

const parseCookieHeader = (header = "") =>
  header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("=") || "");
    return acc;
  }, {});

const authenticateSocket = async (socket, next) => {
  try {
    const parsed = parseCookieHeader(socket.handshake.headers.cookie || "");
    const token = parsed.token || socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    if (!JWT_SECRET) {
      return next(new Error("JWT secret not configured"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
};

const initSocket = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    socket.join(`user:${userId}`);

    socket.on("join_chat", ({ targetUserId }) => {
      if (targetUserId) {
        const room = [userId, targetUserId].sort().join(":");
        socket.join(`chat:${room}`);
      }
    });

    socket.on("leave_chat", ({ targetUserId }) => {
      if (targetUserId) {
        const room = [userId, targetUserId].sort().join(":");
        socket.leave(`chat:${room}`);
      }
    });

    socket.on("typing", ({ targetUserId, isTyping }) => {
      if (!targetUserId) return;
      io.to(`user:${targetUserId}`).emit("typing", {
        fromUserId: userId,
        isTyping: Boolean(isTyping),
      });
    });

    socket.on("disconnect", () => {
      /* user room cleaned up automatically */
    });
  });
};

module.exports = { initSocket };
