const express = require('express');
const router = express.Router();
// const jwt = require("jsonwebtoken")

const authRouter = require("./auth");
const bookingRouter = require("./booking");
const lockerRouter = require("./locker");
const userRouter = require("./user");
const reviewRouter = require("./review");



router.use("/auth", authRouter);


// router.use(async (req, res, next) => {
//     try {
//         const token = req.headers.authorization;
//         console.log(token)
//         const user = jwt.verify(token?.split(" ")[1], "MY_SECRET")
//         console.log(user);
//         req.user = user;
//         next()
//     } catch (e) {
//         console.log(e)
//         return res.json({ msg: "INVALID" })

//     }
// })

router.use("/booking", bookingRouter);
router.use("/locker", lockerRouter);
router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/review", reviewRouter)

module.exports = router;