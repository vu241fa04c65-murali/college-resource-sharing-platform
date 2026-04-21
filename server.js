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
        console.log("Incoming Data:", req.body);

        const name = req.body.name.trim();
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password.trim();

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({ message: "Signup successful" });

    } catch (err) {
        console.log("Signup Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password.trim();

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ message: "Invalid password" });
        }

        res.json({ message: "Login successful" });

    } catch (err) {
        console.log(err);
        res.json({ message: "Server error" });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});