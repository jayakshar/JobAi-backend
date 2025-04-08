const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { db } = require("../models");
const User = db.user;

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    console.log("Incoming Request Body:", req.body); // ✅ Log incoming request

    const { email, password, googleId, facebookId, photo_url, first_name, last_name, mobile, login_type } = req.body;

    if (!email) {
        return res.status(400).json({ status: 400, message: "Email is required", data: {} });
    }

    try {
        let user = await User.findOne({ where: { email } });
        let message = "";

        // console.log("User found in DB:", user); // ✅ Debug user lookup

        if (googleId && login_type === "google") {
            // console.log("Google Login Attempt:", { googleId, email }); // ✅ Debug Google login attempt
            if (!user) {
                user = await User.create({
                    google_id: googleId,
                    email,
                    photo_url: photo_url,
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
        } else if (facebookId && login_type === "facebook") {
            // console.log("Facebook Login Attempt:", { facebookId, email }); // ✅ Debug Facebook login attempt
            if (!user) {
                user = await User.create({
                    facebook_id: facebookId,
                    email,
                    photo_url: photo_url,
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
            // console.log("Normal Login Attempt:", { email }); // ✅ Debug normal login attempt
            if (!user) {
                return res.status(400).json({ status: 400, message: "User not found. Please sign up.", data: {} });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ status: 400, message: "Invalid credentials", data: {} });
            }

            await user.update({ last_login_at: moment().format("YYYY-MM-DD HH:mm:ss") });
            message = "User logged in successfully";
        } else {
            return res.status(400).json({ status: 400, message: "Invalid credentials", data: {} });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

        return res.status(200).json({
            status: 200,
            message,
            data: user,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ status: 500, message: "Authentication error", data: {} });
    }
};
exports.register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    console.log("Registration Request Body:", req.body); // Debug log

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ status: 400, message: "All fields are required", data: {} });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: 400, message: "Passwords do not match", data: {} });
    }

    try {
        // Check if the user already exists
        let existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "Email is already registered", data: {} });
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
        return res.status(500).json({ status: 500, message: "Registration failed", data: {} });
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
        return res.status(400).json({ status: 400, message: "User ID is required.", data: {} });
    }
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found", data: {} });
        }
        return res.status(200).json({
            status: 200,
            message: "User profile get  successfully",
            data: user,
        });

    } catch (error) {
        console.error('Profile retrieval error:', error);
        return res.status(500).json({ status: 500, message: "Internal server error.", data: {} });
    }
};
exports.updateProfile = async (req, res) => {
    const userId = req.user?.id || '';
    console.log("Updating profile for userId:", userId);

    if (!userId) {
        return res.status(400).json({ status: 400, message: "User ID is required.", data: {} });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }

        const {
            first_name,
            last_name,
            mobile,
            email,
            website,
            qualification,
            address,
            description,
            photo_url
        } = req.body;

        await user.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            mobile: mobile || user.mobile,
            email: email || user.email,
            website: website || user.website,
            qualification: qualification || user.qualification,
            address: address || user.address,
            description: description || user.description,
            photo_url: photo_url || user.photo_url,
        });

        console.log("Payload received:", req.body);
        return res.status(200).json({
            status: 200,
            message: "Profile updated successfully.",
            data: user,
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ status: 500, message: "Internal server error.", data: {} });
    }
};

exports.uploadCv = async (req, res) => {
    const userId = req.user?.id || '';
    console.log("Updating profile for userId:", userId);

    if (!userId) {
        return res.status(400).json({ status: 400, message: "User ID is required.", data: {} });
    }
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = `${req.file.filename}`;
        const originalName = req.file.originalname;

        await User.update(
            { cv_path: originalName },
            { where: { id: userId } }
        );

        return res.status(200).json({
            message: "CV uploaded and saved successfully",
            filePath,
            originalName,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ message: "Server error while uploading CV" });
    }
};

