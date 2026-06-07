const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Notification = require("../models/notification");
const { populateFromUser } = require("../services/notificationService");

const notificationsRouter = express.Router();

notificationsRouter.get("/notifications", userAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    const data = await Promise.all(notifications.map(populateFromUser));

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      readAt: null,
    });

    res.json({ success: true, data, unreadCount });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

notificationsRouter.patch("/notifications/:id/read", userAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { readAt: new Date() } },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

notificationsRouter.post("/notifications/read-all", userAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, readAt: null },
      { $set: { readAt: new Date() } },
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = notificationsRouter;
