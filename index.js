
var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
    try {
        await mongoose.connect("mongodb+srv://Abdullah:Fakat%4012345@fakatlockers.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000")
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

})()

const router = require('./routes/index');
app.use('/', router);


// app.use(function (req, res, next) {
//     console.log(req.body)
//     next(createError(404)); // middleware 
// });

const PORT = 5001;
app.listen(PORT, console.log(`Server running port ${PORT}`));


