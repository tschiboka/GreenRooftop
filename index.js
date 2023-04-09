const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();

const cors = require('cors');                                      // CORS Settings

// Cross-Origin Shared Resources
app.use(express.json({
    type: ['application/json', 'text/plain']
}));

app.use(cors({
    methods: 'GET, POST, PUT, DELETE',
    //origin: ['http://127.0.0.1:5501', 'http://localhost:5001', 'localhost:5001', "localhost"] // Allowed Origins
    origin: "*"
}));

const PORT = process.env.PORT || 5500;                             // PORT
const report = require("./routes/report");
const users = require("./routes/user");
const devices = require("./routes/device");
app.use("/api/report", report);
app.use("/api/users", users);
app.use("/api/devices", devices);

// Listen Port
console.log("GREEN ROOFTOP API");
const server = app.listen(PORT, () => {                             // Display Log
    console.log(`PORT:        ${ PORT }`);
});


// Database Connection
const dbString = process.env.DB_STRING;
mongoose.connect(dbString)
    .then(() => console.log(`Connected to DB`))
    .catch(err => console.log(`Could NOT Connect to DB: ${ err }`));