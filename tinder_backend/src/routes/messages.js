const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/message");
const { createNotification } = require("../services/notificationService");

const messagesRouter = express.Router();

const canUsersMessageEachOther = async (userAId, userBId) => {
  const acceptedConnection = await ConnectionRequest.findOne({
    status: "accepted",
    $or: [
      { fromUserId: userAId, toUserId: userBId },
      { fromUserId: userBId, toUserId: userAId },
    ],
  });
  return Boolean(acceptedConnection);
};

const buildConversationSummary = async (currentUserId, acceptedConnections) => {
  const conversations = [];

  for (const connection of acceptedConnections) {
    const otherUserId =
      connection.fromUserId.toString() === currentUserId.toString()
        ? connection.toUserId
        : connection.fromUserId;

    const [matchUser, latestMessage, unreadCount] = await Promise.all([
      User.findById(otherUserId).select("firstName lastName photoUrl"),
      Message.findOne({
        $or: [
          { fromUserId: currentUserId, toUserId: otherUserId },
          { fromUserId: otherUserId, toUserId: currentUserId },
        ],
      })
        .sort({ createdAt: -1 })
        .populate("fromUserId", "firstName lastName photoUrl")
        .populate("toUserId", "firstName lastName photoUrl"),
      Message.countDocuments({
        fromUserId: otherUserId,
        toUserId: currentUserId,
        readAt: null,
      }),
    ]);

    conversations.push({ matchUser, latestMessage, unreadCount, connectionId: connection._id });
  }

  conversations.sort((a, b) => {
    const aTime = a.latestMessage?.createdAt ? new Date(a.latestMessage.createdAt).getTime() : 0;
    const bTime = b.latestMessage?.createdAt ? new Date(b.latestMessage.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return conversations;
};

messagesRouter.get("/inbox/conversations", userAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const acceptedConnections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
    });

    const conversations = await buildConversationSummary(currentUserId, acceptedConnections);
    return res.json({ message: "Inbox conversations retrieved successfully", data: conversations });
  } catch (error) {
    return res.status(400).send("ERROR: " + error.message);
  }
});

messagesRouter.get("/chat/:targetUserId/messages", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).send("You cannot chat with yourself");
    }

    const targetUser = await User.findById(targetUserId).select("firstName lastName photoUrl");
    if (!targetUser) return res.status(404).send("User not found");

    const canMessage = await canUsersMessageEachOther(currentUserId, targetUserId);
    if (!canMessage) return res.status(403).send("You can only message accepted matches");

    const messages = await Message.find({
      $or: [
        { fromUserId: currentUserId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("fromUserId", "firstName lastName photoUrl")
      .populate("toUserId", "firstName lastName photoUrl");

    if (req.user.readReceipts !== false) {
      await Message.updateMany(
        { fromUserId: targetUserId, toUserId: currentUserId, readAt: null },
        { $set: { readAt: new Date() } },
      );
    }

    return res.json({ message: "Chat messages retrieved successfully", data: messages, targetUser });
  } catch (error) {
    return res.status(400).send("ERROR: " + error.message);
  }
});

messagesRouter.post("/chat/:targetUserId/messages", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const { messageText } = req.body;
    const currentUserId = req.user._id;

    if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
      return res.status(400).send("Message text is required");
    }

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).send("You cannot chat with yourself");
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).send("User not found");

    const canMessage = await canUsersMessageEachOther(currentUserId, targetUserId);
    if (!canMessage) return res.status(403).send("You can only message accepted matches");

    const message = await Message.create({
      fromUserId: currentUserId,
      toUserId: targetUserId,
      messageText: messageText.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("fromUserId", "firstName lastName photoUrl")
      .populate("toUserId", "firstName lastName photoUrl");

    await createNotification({
      userId: targetUserId,
      type: "message",
      title: `${req.user.firstName} sent you a message`,
      body: messageText.trim().slice(0, 100),
      fromUserId: currentUserId,
      link: "/app/inbox",
    });

    return res.status(201).json({ message: "Message sent successfully", data: populatedMessage });
  } catch (error) {
    return res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = messagesRouter;
