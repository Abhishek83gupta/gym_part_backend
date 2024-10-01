const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields must be filled" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Email is not valid" });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: "Password not strong enough" });
    }
     
    // const exists = await User.find({ email }); returns an array. 
    // You should use findOne() instead, which returns a single object or null. Since find() always returns an array, even if the array is empty,
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({ email, password: hashedPassword });

    // Create a token
    const token = createToken(user._id);

    // Respond with success
    return res.status(200).json({ email, token });

  } catch (error) {
    // Handle hashing or any other errors
    return res.status(500).json({ success: false, message: error.message });
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields must be filled" });
    }
  
    const user = await User.findOne({ email });

    if(!user){
     return res.status(400).json({ success:false, message: "Incorrect email"})
    }
  
    const match = await bcrypt.compare(password, user.password)
  
    if(!match){
      return res.status(400).json({ success : false, message : "Incorrect password" })
    }

    // create a token
    const token = createToken(user._id);

    return res.status(200).json({ email, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

};


module.exports = {
  loginUser,
  signupUser,
};
