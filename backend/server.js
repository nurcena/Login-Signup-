const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// --- AYARLAR ---
app.use(cors());
app.use(express.json());

// --- 1. MONGODB BAĞLANTISI ---
mongoose.connect('mongodb://127.0.0.1:27017/loginDB')
    .then(() => console.log("✅ MongoDB'ye başarıyla bağlandık!"))
    .catch((err) => console.error("❌ Bağlantı hatası:", err));

// --- 2. KULLANICI ŞEMASI ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// --- 3. KAYIT OLMA ROTASI (REGISTER) ---
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Registration error! The email address may already be in use." });
    }
});

// --- 4. GİRİŞ YAPMA ROTASI (LOGIN) ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "No such user found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password!" });
        }

        res.status(200).json({
            message: "Login successful! Welcome!.",
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ error: "Server error occurred." });
    }
});

// --- 5. ŞİFRE SIFIRLAMA ROTASI (FORGOT PASSWORD) ---
app.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "No user was found with this email address.!" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Your password has been successfully updated! You can log in with your new password." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred on the server side while resetting the password." });
    }
});

// --- 6. SUNUCUYU BAŞLAT ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});
