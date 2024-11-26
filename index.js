
var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB URI (directly hardcoded)
const MONGO_URI = 'mongodb+srv://Abdullah:Fakat%4012345@fakatclouddb.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';


const connectDB = async () => {
    try {
        // Connect to Cosmos DB using the URI from .env
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        console.log('Connected to Cosmos DB successfully');
    } catch (err) {
        console.error('Error connecting to Cosmos DB:', err.message);
        process.exit(1); // Exit the process if the connection fails
    }
};
connectDB();

const router = require('./routes/index');
app.use('/', router);


// app.use(function (req, res, next) {
//     console.log(req.body)
//     next(createError(404)); // middleware 
// });

const PORT = 5001;
app.listen(PORT, console.log(`Server running port ${PORT}`));


