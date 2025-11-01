// src/models/User.js (Complete version)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // Added for platform requirements (Google OAuth alternative/supplement)
        role: {
            type: String,
            enum: ['user', 'organizer', 'admin'],
            default: 'user', 
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

// Method to check if the user is an admin
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

const User = mongoose.model("User", userSchema);

export default User;