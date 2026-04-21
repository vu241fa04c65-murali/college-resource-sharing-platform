const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ FINAL FIXED CONNECTION (NO OPTIONS)
mongoose.connect("mongodb+srv://241fa04c65:nari9347@collegedb.skyoyss.mongodb.net/collegeDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({ message: "Signup successful" });

    } catch (err) {
        console.log(err);
        res.json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (user) {
            res.json({ message: "Login successful" });
        } else {
            res.json({ message: "Invalid credentials" });
        }

    } catch (err) {
        console.log(err);
        res.json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});