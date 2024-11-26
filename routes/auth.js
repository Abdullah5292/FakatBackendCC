const bcrypt = require("bcrypt");
const Users = require("../models/Users");
var express = require("express");
const nodemailer = require('nodemailer');
const transporter = require('../emailService.js');
const crypto = require('crypto');
var router = express.Router();
// const jwt = require("jsonwebtoken")
const MY_SECRET = "MY_SECRET";

router.post("/signUp", async (req, res) => {
    try {
        const { username, email, password, ERP, CNIC, Phone_num } = req.body;

        let user = await Users.findOne({ username })
        console.log(user);
        if (user) {
            console.log('username already exists')
            return res.json({ msg: "Email is in use already" })
        }
        // Email validation here
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.json({ msg: "Invalid email format" });
        }
        //username validation here
        let user1 = await Users.findOne({ username })
        if (user1) return res.json({ msg: "Username exists already" })
        if (username.length < 3) {
            return res.json({ msg: "Username is too short" })
        }
        // Add password validation here
        if (password.length < 5) {
            return res.json({ msg: "Password is too short" })
        }
        // Check for special characters
        const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharacters.test(password)) {
            return res.json({ msg: "Password must contain a special character" });
        }
        // add ERP validation here
        let user2 = await Users.findOne({ ERP })
        if (user2) return res.json({ msg: "ERP exists already" })
        if (!/^\d{5}$/.test(ERP)) {
            return res.json({ error: 'Invalid ERP format. ERP should be exactly 5 digits' });
        }
        // add CNIC validation here
        let user3 = await Users.findOne({ CNIC })
        if (user3) return res.json({ msg: "CNIC exists already" })
        if (!/^\d{5}-\d{7}-\d{1}$/.test(CNIC)) {
            return res.json({ error: 'Invalid CNIC format. CNIC should be exactly 15 digits' });
        }
        // add Phone_num validation here
        let user4 = await Users.findOne({ Phone_num })
        if (user4) return res.json({ msg: "Phone number in use already" })
        if (!/^\d{11}$/.test(Phone_num)) {
            return res.json({ error: 'Invalid Phone number format. Phone number should be exactly 11 digits' });
        }
        await Users.create({ ...req.body, password: await bcrypt.hash(password, 5) });
        //create an unique  userid and add it to the user object
        //    const userId = Math.floor(Math.random() * 1000000); 
        return res.json({ msg: "SignUp Successful" })
    } catch (error) {
        console.error(error)
    }

});

router.post("/login", async (req, res) => {
    try {
        console.log(req.body)
        const { username, password } = req.body

        const user = await Users.findOne({ username })
        if (!user) return res.json({ msg: "Incorrect Username" })
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.json({ msg: "Incorrect Password" })
        // const token = jwt.sign({
        //     username,
        //     userId: user.userId,
        //     createdAt: new Date(),
        //     role: user.role,
        // }, "MY_SECRET", { expiresIn: "1d" });
        // res.json({
        //     msg: "LOGGED IN", token
        // })
    } catch (error) {
        console.error(error)
    }
});

function generateToken() {
    return crypto.randomBytes(6).toString('hex');
}

router.post("/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json({ msg: "User not found" });
        }
        const resetToken = generateToken();

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: "Your OTP to reset your password is: " + resetToken
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ msg: 'Email sent and user\'s token is saved in db', resetPasswordToken: user.resetPasswordToken });
            }
            console.log(error);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
});

router.post("/resetpassword", async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        const user = await Users.findOne({ email });
        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        if (user.resetPasswordToken == resetToken) {
            console.log("CORRECT TOKEN");
            if (
                newPassword.length < 8 ||
                !/\d/.test(newPassword) ||
                !/[a-zA-Z]/.test(newPassword)
            ) {
                throw new Error("Password must be at least 8 characters long and include both numbers and alphabets.");
            }
            const hashedPassword = await bcrypt.hash(newPassword, 5);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            console.log("CORRECT TOKEN");

            return res.json({ msg: "Password reset successful" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
});

//change password
router.post("/changepassword", async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;
        const user = await Users.findOne({ username });
        if (!user) {
            return res.json({ msg: "User not found" });
        }
        const passwordCheck = await bcrypt.compare(oldPassword, user.password);
        if (!passwordCheck) {
            return res.json({ msg: "Incorrect Password" });
        }
        if (
            newPassword.length < 8 ||
            !/\d/.test(newPassword) ||
            !/[a-zA-Z]/.test(newPassword)
        ) {
            throw new Error("Password must be at least 8 characters long and include both numbers and alphabets.");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 5);
        user.password = hashedPassword;
        await user.save();
        return res.json({ msg: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
});
module.exports = router;
