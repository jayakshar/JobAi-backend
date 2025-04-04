const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { db } = require("../../models");
const User = db.user;

const JWT_SECRET = process.env.JWT_SECRET;

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 400, error: "Email and password are required" });
    }
    try {
        const adminUser = await User.findOne({ where:{ email}});

        if (!adminUser) {
            return res.status(404).json({ status: 404, error: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({ status: 401, error: "Invalid credentials" });
        }

        await adminUser.update({ last_login_at: moment().format("YYYY-MM-DD HH:mm:ss") });

        const token = jwt.sign({ id: adminUser.id }, JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({
            status: 200,
            message: "Admin logged in successfully",
            data: adminUser,
            token,
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data : {} });
    }
};

exports.adminRegister = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ status: 400, error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: 400, error: "Passwords do not match" });
    }

    try {
        let existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ status: 400, error: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            // role: 'admin',
            last_login_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

        const token = jwt.sign({ id: newAdmin.id, email: newAdmin.email }, JWT_SECRET, { expiresIn: "30d" });

        return res.status(201).json({
            status: 201,
            message: "Admin registered successfully",
            data: newAdmin,
            token,
        });
    } catch (error) {
        console.error("Admin registration error:", error);
        return res.status(500).json({ status: 500, message: "Registration failed" , data : {}});
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?.id || '';
    console.log("user id", userId);
    if (!userId) {
        return res.status(400).json({ status: 400, error: "Admin ID is required." });
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ status: 400, error: "All fields are required" });
    }
    try {
        let comparePassword = await bcrypt.compare(oldPassword, req.user.password);
        if (!comparePassword) {
            return res.status(400).json({ status: 400, error: "Old password is incorrect" });
        }
        if (newPassword === oldPassword) {
            return res.status(400).json({ status: 400, error: "New password cannot be the same as old password" });
            
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ status: 400, error: "New passwords do not match" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: userId } });
        return res.status(200).json({ status: 200, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error" , data : {}});
    }   
};