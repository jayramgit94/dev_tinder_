const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;



const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    index:true,
  },
  lastName:{
    type: String,
  },
  email:{
      type: String,
      required:true,
      unique:true,
      lowercase:true,
      unique: true,
      trim:true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("invalid email address");
        }
    }},
  skills:{
      type: [String],
      validate(value)
      {
        if(value.length > 10){
          throw new Error("skills should be less than 10");
        }
      }
  },about:{
      type: String,
      default:"Hey there! I am using DevTinder.",
    },
  password:{
      type: String,
      required:true,
      minlength: 6,
      trim:true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("please enter a strong password");
        }
    },
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("gender must be male, female or other");
      }
    },
  },
  city: {
    type: String,
  },
  photoUrl: {
    type: String,
    default: "https://randomuser.me/api/portraits/lego/1.jpg",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("invalid url");
      }
    },
  },
  onboardingComplete: {
    type: Boolean,
    default: false,
  },
  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },
  calendlyUrl: { type: String, default: "" },
  lookingFor: { type: [String], default: [] },
  readReceipts: { type: Boolean, default: true },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastSuperConnectAt: { type: Date, default: null },
  isOnline:{
    type: Boolean,
    default: false,
  },
  lastOnline:{
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});



userSchema.methods.getJWT = function(){
  const user = this;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  //create a jwt token and send to the client
  //this is the instance method of the user model, so we can access the user document using this keyword
 const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: "10h" },
      );
  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordMatch = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordMatch;
  
}

const User = mongoose.model("User", userSchema);

module.exports = User;