const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve your HTML files

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/collegeDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Model
const User = mongoose.model("User", UserSchema);


// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: "⚠️ User already exists" });
        }

        // Save new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({ message: "✅ Signup successful" });

    } catch (error) {
        res.json({ message: "❌ Error during signup" });
    }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (user) {
            res.json({ message: "✅ Login successful" });
        } else {
            res.json({ message: "❌ Invalid email or password" });
        }

    } catch (error) {
        res.json({ message: "❌ Error during login" });
    }
});


// ================= SERVER =================
app.listen(5000, () => {
    console.log("🚀 Server running at http://localhost:5000");
});