const express = require("express");
const authRouter = express.Router();
const { validateSignupdata } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DEMO_ACCOUNT = {
  firstName: "Demo",
  lastName: "User",
  email: "demo@example.com",
  password: "DemoUser123!",
  age: 24,
  gender: "male",
  city: "Mumbai",
  about: "Primary demo account for testing login and feed flow",
  skills: ["JavaScript", "React", "Node.js"],
  photoUrl: "https://randomuser.me/api/portraits/men/10.jpg",
  onboardingComplete: true,
};


authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupdata(req);
    const { firstName, lastName, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).send("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : undefined,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const userObj = savedUser.toObject();
    delete userObj.password;

    return res.status(201).send({
      message: "User registered successfully",
      user: userObj,
    });
  } catch (err) {
    if (
      err.message === "first name, email and password are required" ||
      err.message === "invalid input data type" ||
      err.message.includes("first name should be between") ||
      err.message.includes("last name should be between") ||
      err.message.includes("please provide a valid email address") ||
      err.message.includes("please enter a strong password")
    ) {
      return res.status(400).send(err.message);
    }

    return res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : email;
    let user = await User.findOne({ email: normalizedEmail });

    if (!user && normalizedEmail === DEMO_ACCOUNT.email) {
      const hashedPassword = await bcrypt.hash(DEMO_ACCOUNT.password, 10);
      user = await User.create({
        ...DEMO_ACCOUNT,
        password: hashedPassword,
      });
    }

    if (user && normalizedEmail === DEMO_ACCOUNT.email && !user.onboardingComplete) {
      user.onboardingComplete = true;
      user.skills = user.skills?.length ? user.skills : DEMO_ACCOUNT.skills;
      await user.save();
    }

    if (!user) {
      return res.status(404).send("user not found");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).send("invalid credentials");
    } else {
      // create a jwt token and send to the client
      const token = await user.getJWT();

      const isProduction = process.env.NODE_ENV === "production";
      const sameSite = process.env.VERCEL ? "lax" : isProduction ? "none" : "lax";

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
      });

      // Send a sanitized user object (exclude password)
      const userObj = user.toObject({ getters: true, virtuals: false });
      delete userObj.password;

      return res.status(200).send({ user: userObj });
    }
  } catch (err) {
    console.log("error in login", err);
    res.status(500).send("Internal Server Error");
  }
};

authRouter.post(["/login", "/user/login", "/Login"], loginHandler);

authRouter.post("/logout",async(req,res)=>{
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = process.env.VERCEL ? "lax" : isProduction ? "none" : "lax";

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: isProduction,
    sameSite,
  });
  return res.status(200).send("logout successful");
});

module.exports = authRouter;