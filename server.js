const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express(); // Initialize the app before using it

// CORS options
const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin (your frontend origin)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions)); // Use the cors middleware with options

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userAuth', {
    // No need to use deprecated options anymore
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
const users = require('./routes/users');
const websites = require('./routes/websites');
const packages = require('./routes/packages');
const orders = require('./routes/orders');

app.use('/api/users', users);
app.use('/api/websites', websites);
app.use('/api/packages', packages);
app.use('/api/orders', orders);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});