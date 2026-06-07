const validator = require("validator");


const validateSignupdata = (req )=>{
  const  {firstName , lastName , email , password} =req.body;   
  if(!firstName || !email || !password) {
    throw new Error("first name, email and password are required");

  }else if(typeof firstName !== "string" || typeof email !== "string" || typeof password !== "string" || (lastName !== undefined && typeof lastName !== "string")) {
    throw new Error("invalid input data type");

  }else if(firstName.trim().length < 3 || firstName.trim().length > 30){
    throw new Error("first name should be between 3 and 30 characters");

  }else if(lastName && (lastName.trim().length < 1 || lastName.trim().length > 30)){
    throw new Error("last name should be between 1 and 30 characters");
  }
  else if(!validator.isEmail(email)){
    throw new Error("please provide a valid email address");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("please enter a strong password");
  }

};

const validateEditProfileData = (req)=>{
  const allowedEditFields = [
    "firstName", "lastName", "skills", "about", "age", "gender", "city", "photoUrl",
    "onboardingComplete", "githubUrl", "linkedinUrl", "portfolioUrl", "calendlyUrl",
    "lookingFor", "readReceipts",
  ];


  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));


  return isEditAllowed;

}


module.exports = {
  validateSignupdata,
  validateEditProfileData,
};