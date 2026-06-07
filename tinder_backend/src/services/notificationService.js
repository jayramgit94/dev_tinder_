const Notification = require("../models/notification");
const User = require("../models/user");
const { getIO } = require("../socket/ioInstance");

const populateFromUser = async (notification) => {
  const doc = notification.toObject ? notification.toObject() : notification;
  if (doc.fromUserId) {
    const fromUser = await User.findById(doc.fromUserId).select("firstName lastName photoUrl");
    return { ...doc, fromUser };
  }
  return doc;
};

const createNotification = async ({ userId, type, title, body, fromUserId, link }) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    body,
    fromUserId: fromUserId || null,
    link: link || null,
  });

  const populated = await populateFromUser(notification);
  const io = getIO();

  if (io) {
    io.to(`user:${userId.toString()}`).emit("notification", populated);
  }

  return populated;
};

module.exports = { createNotification, populateFromUser };
