const Users = require('../models/Users');
const Lockers = require('../models/Lockers');
const Bookings = require('../models/Bookings');


var express = require('express');
const Review = require('../models/Reviews'); // Import the Review model
var router = express.Router();
//Create a new review for that booking
router.post('/addReview', async (req, res) => {
    try {

        // Extract data from request body
        const { User_id, Booking_id,Locker_id, rating, Comment } = req.body;

        // Check if user exists
        const user = await Users.findOne({_id:User_id});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the same user is making the request, unless it's an admin
        if (User_id !== user._id && !user.admin) {
            return res.json({ error: 'Unauthorized' });
        }
        const booking = await Bookings.findById(Booking_id);
        if (!booking) {
            return res.json({ error: 'Booking not found' });
        }
        // Check if the booking is completed
        if (booking.Booking_Status !== 'Approved') {
            return res.json({ error: 'Booking is not completed' });
        }
        // Check if the bookingid already has a review
        if (Booking_Id.Review) {
            return res.json({ error: 'Booking already has a review' });
        }
        const { graduation, discipline } = user; // Fetch graduation and discipline from user

        // Create the review
        const date = new Date(); // Current date and time
        const review = new Review({
            userId,
            bookingId,
            rating,
            comment,
            date,
            graduation,
            disicpline,
        });
       // Save the review
       await review.save();

       res.json({ message: 'Review posted successfully', data: review });
    }
    catch (error) {
        console.error(error);
    }
});
module.exports = router
