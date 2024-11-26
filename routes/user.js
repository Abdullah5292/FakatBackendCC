const Users = require("../models/Users");
const Bookings = require("../models/Bookings");
const Lockers = require("../models/Lockers");

var express = require("express");
var router = express.Router();
// const jwt = require("jsonwebtoken")


router.put("/UpdateInfo", async (req, res) => {
    try {
        const { User_id, username, email, password, ERP, CNIC, Phone_num } = req.body;
        console.log(User_id);
        const user = await Users.findOne({ _id: User_id })
        if (!user) return res.json({ msg: "User not found" })
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 5);
        if (ERP) user.ERP = ERP;
        if (CNIC) user.CNIC = CNIC;
        if (Phone_num) user.Phone_num = Phone_num;
        await user.save();
        res.json({ msg: "User updated successfully", data: user })
    } catch (error) {
        console.error(error)
    }
});
/******* above are all the routes that WILL NOT pass through the middleware ********/

router.use((req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else return res.json({ msg: "Unauthorized. Only admin users can perform this action" })

})
/******* below are all the routes that WILL pass through the middleware ********/

//get details of user
router.get("/getUser", async (req, res) => {
    try {
        const user = await Users.findOne({ User_id: req.body.useriD })
        if (!user) return res.json({ msg: "No User Found" })
        res.json({ msg: "User Found", data: user })
        console.log(error);
    } catch (error) {
        console.error(error)
    }
}
);
//get all users 
router.get("/getUsers", async (req, res) => {
    try {
        const users = await Users.find();
        res.json({ msg: "Users Found", data: users })
    } catch (error) {
        console.error(error)
    }
}
);

module.exports = router

