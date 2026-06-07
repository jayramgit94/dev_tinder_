const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/message");
const Report = require("../models/report");
const { calcCompatibility } = require("../utils/compat");

const USER_SAFE = "firstName lastName photoUrl age gender about skills city githubUrl linkedinUrl portfolioUrl calendlyUrl lookingFor";

const mapSafeUser = (user, extra = {}) => ({
  _id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  photoUrl: user.photoUrl,
  age: user.age,
  gender: user.gender,
  about: user.about,
  skills: user.skills,
  city: user.city,
  githubUrl: user.githubUrl,
  linkedinUrl: user.linkedinUrl,
  portfolioUrl: user.portfolioUrl,
  calendlyUrl: user.calendlyUrl,
  lookingFor: user.lookingFor,
  ...extra,
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const rows = await ConnectionRequest.find({ toUserId: req.user._id, status: "interested" })
      .populate("fromUserId", USER_SAFE);
    res.json({ data: rows.map((r) => ({ ...r._doc, fromUserId: mapSafeUser(r.fromUserId) })) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const rows = await ConnectionRequest.find({ fromUserId: req.user._id, status: "interested" })
      .populate("toUserId", USER_SAFE);
    res.json({ data: rows.map((r) => ({ ...r._doc, toUserId: mapSafeUser(r.toUserId) })) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const rows = await ConnectionRequest.find({
      $or: [
        { toUserId: req.user._id, status: "accepted" },
        { fromUserId: req.user._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE).populate("toUserId", USER_SAFE);
    res.json({
      data: rows.map((r) => ({
        ...r._doc,
        fromUserId: mapSafeUser(r.fromUserId),
        toUserId: mapSafeUser(r.toUserId),
      })),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/stats", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const [received, sent, matches, unreadMessages] = await Promise.all([
      ConnectionRequest.countDocuments({ toUserId: userId, status: "interested" }),
      ConnectionRequest.countDocuments({ fromUserId: userId, status: "interested" }),
      ConnectionRequest.countDocuments({
        $or: [{ toUserId: userId, status: "accepted" }, { fromUserId: userId, status: "accepted" }],
      }),
      Message.countDocuments({ toUserId: userId, readAt: null }),
    ]);
    res.json({ data: { received, sent, matches, unreadMessages } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/search", userAuth, async (req, res) => {
  try {
    const { q = "", city = "", skills = "" } = req.query;
    const filter = { _id: { $ne: req.user._id }, onboardingComplete: true };
    if (city.trim()) filter.city = { $regex: city.trim(), $options: "i" };
    if (skills.trim()) {
      const list = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (list.length) filter.skills = { $in: list };
    }
    if (q.trim()) {
      filter.$or = [
        { firstName: { $regex: q.trim(), $options: "i" } },
        { lastName: { $regex: q.trim(), $options: "i" } },
        { about: { $regex: q.trim(), $options: "i" } },
        { skills: { $regex: q.trim(), $options: "i" } },
      ];
    }
    const users = await User.find(filter).select(USER_SAFE).limit(20);
    res.json({
      data: users.map((u) => mapSafeUser(u, {
        compatibility: calcCompatibility(req.user.skills, u.skills),
      })),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/user/block/:userId", userAuth, async (req, res) => {
  try {
    const targetId = req.params.userId;
    if (!req.user.blockedUsers.some((id) => id.toString() === targetId)) {
      req.user.blockedUsers.push(targetId);
      await req.user.save();
    }
    await ConnectionRequest.deleteMany({
      $or: [
        { fromUserId: req.user._id, toUserId: targetId },
        { fromUserId: targetId, toUserId: req.user._id },
      ],
    });
    res.json({ message: "User blocked" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/user/report", userAuth, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId || !reason?.trim()) return res.status(400).json({ message: "userId and reason required" });
    await Report.create({ reporterId: req.user._id, reportedId: userId, reason: reason.trim() });
    res.json({ message: "Report submitted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page, 10) || 1;
    let limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;
    const { city, gender, skills } = req.query;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hide = new Set([loggedInUser._id.toString(), ...(loggedInUser.blockedUsers || []).map(String)]);
    connectionRequests.forEach((r) => {
      hide.add(r.fromUserId.toString());
      hide.add(r.toUserId.toString());
    });

    const filter = { _id: { $nin: Array.from(hide) }, onboardingComplete: true };
    if (city?.trim()) filter.city = { $regex: city.trim(), $options: "i" };
    if (gender && ["male", "female", "other"].includes(gender)) filter.gender = gender;
    if (skills?.trim()) {
      const list = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (list.length) filter.skills = { $in: list };
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).select(USER_SAFE).skip(skip).limit(limit),
    ]);

    res.json({
      data: users.map((u) => mapSafeUser(u, {
        compatibility: calcCompatibility(loggedInUser.skills, u.skills),
      })),
      total,
      page,
      limit,
      hasMore: skip + users.length < total,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
