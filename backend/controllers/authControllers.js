// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30h", // token expires in 30 hours
  });
};

// Register User
export const registerUser = async (req, res) => {
  const { fullName, email, password, role = "user" } = req.body; // <-- default to 'user'
  console.log(req.body);
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ fullName, email, password, role }); // <-- use role here
const token=generateToken(user._id);
    res.status(201).cookie("token", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" ,
      maxAge: 24 * 60 * 60 * 1000, 
    }).json({
      _id: user._id,
      user,
      msg:"User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid Password" });
    }
    console.log("Loggedin user is", user)
    const token = generateToken(user._id);
    res.status(200).cookie("token", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" ,
      maxAge: 24 * 60 * 60 * 1000, 
    }).json({
      _id: user._id,
      user,
      msg:"User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Info
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const profile= async (req,res)=>{
  try {
    const id=req.user._id||req.user.id;
    if(!id){
      return res.status(400).json({ message: "User ID is required" });
    }
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({user,msg:"User profile fetched successfully"});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  } 
};

  const logout= async (req,res)=>{
       try {res.clearCookie("token",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",   
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
  });
    return res.status(200).json({msg:"User logged out successfully"});
}catch(err){
  
    return res.status(500).json({ msg: "Logout failed", error: err.message });
}
  }
  
const deleteUser= async (req,res)=>{
  try {
    const id=req.user._id||req.user.id; 
    if(!id){
      return res.status(400).json({ message: "User ID is required" });
    }
      const user = await User.findByIdAndDelete(id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({message:"User deleted successfully"});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};
const updateprofile= async (req,res)=>{
  try {
    const id=req.user._id||req.user.id; 
    const { profileImage,fullName,email } = req.body;
    if(!id){
      return res.status(400).json({ message: "User ID is required" });
    }
      const user = await User.findByIdAndUpdate(id, { profileImage,fullName,email }, { new: true });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({user,msg:"Profile picture updated successfully"});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  } 
};

export { logout, deleteUser, profile,updateprofile };
