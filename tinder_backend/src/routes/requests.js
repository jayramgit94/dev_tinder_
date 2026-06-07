const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestsRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { createNotification } = require("../services/notificationService");

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    if (!["interested", "ignore"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: "User not found" });
    if (req.user.blockedUsers?.some((id) => id.toString() === toUserId)) {
      return res.status(403).json({ message: "User blocked" });
    }

    const existing = await ConnectionRequest.findOne({
      $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }],
    });
    if (existing) return res.status(400).json({ message: "Connection already exists" });

    if (status === "interested") {
      const reverse = await ConnectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        status: "interested",
      });
      if (reverse) {
        reverse.status = "accepted";
        await reverse.save();
        await createNotification({
          userId: toUserId,
          type: "match",
          title: `It's a match with ${req.user.firstName}!`,
          body: "You both connected — start chatting",
          fromUserId,
          link: "/app/inbox",
        });
        await createNotification({
          userId: fromUserId,
          type: "match",
          title: `It's a match with ${toUser.firstName}!`,
          body: "You both connected — start chatting",
          fromUserId: toUserId,
          link: "/app/inbox",
        });
        return res.json({ message: "It's a match!", matched: true, data: reverse });
      }
    }

    const connectionRequest = await ConnectionRequest.create({ fromUserId, toUserId, status });

    if (status === "interested") {
      await createNotification({
        userId: toUserId,
        type: "request",
        title: `${req.user.firstName} wants to connect`,
        body: "Review their profile and accept to start collaborating",
        fromUserId,
        link: "/app/profile",
      });
    }

    res.json({ message: "Connection request sent", matched: false, data: connectionRequest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

requestsRouter.post("/request/super/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    if (req.user.lastSuperConnectAt && req.user.lastSuperConnectAt.getTime() > dayAgo) {
      return res.status(429).json({ message: "Super Connect available once per day" });
    }

    req.user.lastSuperConnectAt = new Date();
    await req.user.save();

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: "User not found" });

    const existing = await ConnectionRequest.findOne({
      $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }],
    });
    if (existing) return res.status(400).json({ message: "Connection already exists" });

    const reverse = await ConnectionRequest.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
      status: "interested",
    });

    if (reverse) {
      reverse.status = "accepted";
      await reverse.save();
      return res.json({ message: "Super match!", matched: true, super: true, data: reverse });
    }

    const cr = await ConnectionRequest.create({ fromUserId, toUserId, status: "interested" });
    await createNotification({
      userId: toUserId,
      type: "request",
      title: `⭐ ${req.user.firstName} Super Connected!`,
      body: "They highlighted you — review their profile",
      fromUserId,
      link: "/app/profile",
    });
    res.json({ message: "Super Connect sent!", matched: false, super: true, data: cr });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

requestsRouter.delete("/request/undo/:toUserId", userAuth, async (req, res) => {
  try {
    const deleted = await ConnectionRequest.findOneAndDelete({
      fromUserId: req.user._id,
      toUserId: req.params.toUserId,
      status: { $in: ["ignore", "interested"] },
    });
    if (!deleted) return res.status(404).json({ message: "Nothing to undo" });
    res.json({ message: "Undone", data: deleted });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

requestsRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { requestId, status } = req.params;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: req.user._id,
      status: "interested",
    });
    if (!connectionRequest) return res.status(404).json({ message: "Request not found" });

    connectionRequest.status = status;
    await connectionRequest.save();

    if (status === "accepted") {
      await createNotification({
        userId: connectionRequest.fromUserId,
        type: "match",
        title: `${req.user.firstName} accepted your request!`,
        body: "It's a match — start chatting now",
        fromUserId: req.user._id,
        link: "/app/inbox",
      });
    } else if (status === "rejected") {
      await createNotification({
        userId: connectionRequest.fromUserId,
        type: "request",
        title: `${req.user.firstName} declined your request`,
        body: "Keep exploring — more developers are waiting",
        fromUserId: req.user._id,
        link: "/app",
      });
    }

    res.json({ message: `Request ${status}`, data: connectionRequest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = requestsRouter;
