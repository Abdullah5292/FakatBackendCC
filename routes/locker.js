const Users = require('../models/Users');
const Lockers = require('../models/Lockers');

var express = require('express');
var router = express.Router();
//Following gets all available lockers 
router.get('/getallLockers', async (req, res) => {
    try {
        const lockers = await Lockers.find();
        if (!lockers) return res.json({ msg: 'No Lockers currently available' });
        res.json({ msg: 'Available Lockers Found', data: lockers });
    } catch (error) {
        console.error(error);
    }
});
//following gets all available lockers in specific building
router.get('/getLockersInBuilding', async (req, res) => {
    try {
        const lockers = await Lockers.find({ Building_Name: req.query.Building_Name });
        if (!lockers) return res.json({ msg: 'No Lockers currently available in this building' });
        //print all lockers availble in the building
        res.json({ msg: 'Available Lockers Found', data: lockers });

    } catch (error) {
        console.error(error);
    }
});
//Following will give Locker details of the user, who has owns the locker[another user can't see the locker details of another user]
router.get("/getLockerWithUser", async (req, res) => {
    try {
        const Locker = await Locker.findOne({ Locker_id: req.body.Locker_id }).populate("user")
        if (!Locker) return res.json({ msg: 'Locker not Found' })
        //should i add a check here to see if the user is the same as the one who owns the locker?
        const userId = req.user.userId; // Get the user ID from the request
        if (role === 'admin') { // how to seperate admin and user here? efficently?
            return res.json({ msg: "Locker Found", data: Locker });
        }
        if (Locker.user.toString() !== userId) { // Check if the user ID in the Locker does not match the user ID in the request
            return res.status(403).json({ error: 'Unauthorized. You can only view your own Locker details.' }); // Return an error response
        }
        res.json({ msg: "Locker Found", data: Locker })
    } catch (error) {
        console.error(error)
    }
});
//create building api locker 



/******* below are all the routes that WILL NOT pass through the middleware ********/
router.use((req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else return res.json({ msg: "Unauthorized. Only admin users can perform this action" })

})

/******* below are all the routes that WILL pass through the
 * middleware ********/
//Gets details of a specific locker    
router.get("/getLocker", async (req, res) => {
    try {
        const locker = await Lockers.findOne({ _id: req.body.Locker_id })
        if (!locker) return res.json({ msg: "No Locker Found" })
        res.json({ msg: "Locker Found", data: locker })
    } catch (error) {
        console.error(error)
    }
});


router.post("/addLocker", async (req, res) => {
    try {
        // const user = await Users.findOne({ username: req.body.username })
        // if (!user) return res.json({ msg: "USER NOT FOUND" })

        const existingLocker = await Lockers.findOne({ Locker_num: req.body.Locker_num, Building_Name: req.body.Building_Name })
        if (existingLocker) return res.json({ msg: "Locker Already exists" })

        await Lockers.create({ ...req.body })
        res.json({ msg: "Locker added successfully", data: Lockers })

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to add locker" });
    }
}
);


router.put('/updatestatus', async (req, res) => {
    try {
        const locker = await Lockers.findOne({ Locker_id: req.body.Locker_id });
        if (!locker) return res.json({ msg: 'Locker not found' });
        await Lockers.updateOne({ Locker_Status: req.body.Locker_Status });
        res.json({ msg: 'Locker status updated' });
    } catch (error) {
        console.error(error);
    }
}
);

//get total locker count where locker is available not available and reserved

router.get('/getLockerCount', async (req, res) => {
    try {
        const totalLockers = await Lockers.countDocuments();
        const availableLockers = await Lockers.countDocuments({ Locker_Status: 'Available' });
        const notAvailableLockers = await Lockers.countDocuments({ Locker_Status: 'Not Available' });
        const reservedLockers = await Lockers.countDocuments({ Locker_Status: 'Reserved' });
        res.json({ msg: 'Locker count found', data: { totalLockers, availableLockers, notAvailableLockers, reservedLockers } });
    } catch (error) {
        console.error(error);
    }
}
);

module.exports = router;
