const mongoose = require('mongoose');

const LockerSchema = new mongoose.Schema({
    Building_Name: {
        type: String,
        enum: ["Adamjee", "Tabba", "Aman", "Student Center"]
    },
    Locker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lockers'
    },
    Locker_Availability: Boolean,
    Locker_Status: {
       type: String,
       enum: ['Available', 'Not Available', 'Reserved'] 
    },
    Locker_num: Number,
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
});

const Lockers = mongoose.model('Lockers', LockerSchema);
module.exports = Lockers;