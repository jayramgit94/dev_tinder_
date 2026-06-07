const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userObj = user.toObject({ getters: true, virtuals: false });
    delete userObj.password;

    return res.status(200).json(userObj);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try{
    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request");

    };

    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });
    
    await user.save();
    const userObj = user.toObject({ getters: true, virtuals: false });
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userObj,
    });

  }catch(err){
    res.status(400).send(`Bad Request: ${err.message}`);
  }
});

module.exports = profileRouter;