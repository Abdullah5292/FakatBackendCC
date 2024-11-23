const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    Booking_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bookings'
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    Rating: Number,

    Lockerid: 
    {   type: mongoose.Schema.Types.ObjectId,
        ref: 'Lockers'
    
    },
    Comment: String,
    Date: 
    {   type: Date,
        default: Date.now
    },
    
    Graduation: String,
    Discipline: String

});

const Reviews = mongoose.model('Reviews', ReviewSchema);

module.exports = Reviews;

