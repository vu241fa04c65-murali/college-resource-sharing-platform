const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://241fa04c65:nari9347@collegedb.skyoyss.mongodb.net/collegeDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ✅ Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
    try {
        console.log("Incoming Data:", req.body); // 🔥 ADDED (debug)

        const { name, email, password } = req.body;

        // 🔥 ADDED validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "Signup successful" });

    } catch (err) {
        console.log("Signup Error:", err); // 🔥 ADDED detailed error
        res.status(500).json({ message: "Server error" });
    }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {
        console.log("Login Data:", req.body); // 🔥 ADDED

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email, password });

        if (user) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (err) {
        console.log("Login Error:", err); // 🔥 ADDED
        res.status(500).json({ message: "Server error" });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});