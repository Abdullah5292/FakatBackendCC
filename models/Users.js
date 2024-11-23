const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/,
    },
    password: String,
    firstName: String,
    lastName: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Bachelors: String,
    Graduation_year: String,
    Phone_num: Number,
    CNIC: String,
    ERP: Number,
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    resetPasswordToken: {
        type: String
    }
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;