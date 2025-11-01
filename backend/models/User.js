// models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        profileImage: { 
            type: String, 
            default: 'default-user.png' // You can set a default image path/URL here
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // New field for role-based access control
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user', // Default role for new users
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords for login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// New method to check if the user is an admin
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

const User = mongoose.model("User", userSchema);

export default User;