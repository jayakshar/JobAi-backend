const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { db } = require("../models");
const User = db.user;

const JWT_SECRET = process.env.JWT_SECRET;


exports.login = async (req, res) => {
    const { email, password, googleId, facebookId, photoUrl, first_name, last_name, mobile } = req.body;

    console.log("Request Body:", req.body);

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        let user = await User.findOne({ where: { email } });
        let message = "";
        let login_type = "normal";

        if (googleId) {
            login_type = "google";
            if (!user) {
                user = await User.create({
                    google_id: googleId,
                    email,
                    photo_url: photoUrl,
                    signup_by: "google",
                    last_login_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    first_name: first_name || null,
                    last_name: last_name || null,
                    mobile: mobile || null,
                });
                message = "User registered successfully with Google";
            } else {
                await user.update({ last_login_at: moment().format("YYYY-MM-DD HH:mm:ss") });
                message = "User logged in successfully with Google";
            }
        } else if (facebookId) {
            login_type = "facebook";
            if (!user) {
                user = await User.create({
                    facebook_id: facebookId,
                    email,
                    photo_url: photoUrl,
                    signup_by: "facebook",
                    last_login_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    first_name: first_name || null,
                    last_name: last_name || null,
                    mobile: mobile || null,
                });
                message = "User registered successfully with Facebook";
            } else {
                await user.update({ last_login_at: moment().format("YYYY-MM-DD HH:mm:ss") });
                message = "User logged in successfully with Facebook";
            }
        } else if (password) {
            if (!user) {
                return res.status(400).json({ error: "User not found. Please sign up." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            await user.update({ last_login_at: moment().format("YYYY-MM-DD HH:mm:ss") });
            message = "User logged in successfully";
        } else {
            return res.status(400).json({ error: "Invalid request. Must provide googleId, facebookId, or password" });
        }

        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return res.status(500).json({ error: "Internal server error" });
        }

        try {
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

            return res.status(200).json({
                status: 200,
                message,
                login_type,
                user,
                token,
            });
        } catch (err) {
            console.error("JWT Sign Error:", err);
            return res.status(500).json({ error: "Token generation failed" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Authentication error" });
    }
};


exports.register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    console.log("Registration Request Body:", req.body); // Debug log

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Check if the user already exists
        let existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = await User.create({
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            last_login_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

        // Generate JWT Token
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "30d" });

        return res.status(201).json({
            status: 201,
            message: "User registered successfully",
            user: newUser,
            token,
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Registration failed" });
    }
};
// exports.register = async (req, res) => {
//     const { firstName, lastName, email, password, confirmPassword } = req.body;

//     console.log("Registration Request Body:", req.body);

//     if (!firstName || !lastName || !email || !password || !confirmPassword) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//         return res.status(400).json({ error: "Passwords do not match" });
//     }

//     try {
//         let existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email is already registered" });
//         }

//         const hashedPassword = bcrypt.hashSync(password, 10);

//         const newUser = await User.create({
//             first_name: firstName,
//             last_name: lastName,
//             email,
//             password: hashedPassword,
//             signup_by: "email",
//             last_login_at: moment().format("YYYY-MM-DD HH:mm:ss"),
//         });

//         return res.status(201).json({
//             status: 201,
//             message: "User registered successfully. Please log in to continue.", // 🔹 No token here
//             user: newUser,
//         });

//     } catch (error) {
//         console.error("Registration error:", error);
//         return res.status(500).json({ error: "Registration failed" });
//     }
// };

exports.getProfile = async (req, res) => {
    const userId = req.user?.id || '';
    console.log("userId", userId);
    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });

    } catch (error) {
        console.error('Profile retrieval error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateProfile = async (req, res) => {
    const userId = req.user?.id || '';
    console.log("Updating profile for userId:", userId);
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }
    
    try {
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const { first_name, last_name, mobile, photo_url } = req.body;
        
        await user.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            mobile: mobile || user.mobile,
            photo_url: photo_url || user.photo_url,
        });
        
        return res.status(200).json({ message: "Profile updated successfully", profile: user });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

