const express = require("express");                                // RESTful Middleware
const router = express.Router();                                   // Router Middleware
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');                          // Mail Sending
const { User, validateUser } = require("../models/user");
const { Device, validateDevice } = require("../models/device");
const { Report, validateReport } = require("../models/report");
require('dotenv').config();



router.get("/:id", async (req, res) => {
    // Try Cast Device ID
    const id = req.params.id;
    const isValidID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidID) return res.status(400).json({
        success: false,
        message: "Invalid Device ID: " + id
    });

    // Find Device
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ success: false, message: "Could NOT Find Device with ID:" + id });

    const reports = await Report.find({ deviceID: id}).limit(100);
    
    res.json({ success: true, data: reports });
});




router.get("/", async (req, res) => {
    const reports = await Report.find();
    res.json({ success: true, data: reports });
});



router.post("/", async (req, res) => {                                       
    let { id, moisture, light, humidity, temperature, tank } = { ...req.query };

    // Try Cast Device ID
    const isValidID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidID) return res.status(400).json({
        success: false,
        message: "Invalid Device ID: " + id
    }); 
    
    // Find Device
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ success: false, message: "Could NOT Find Device with ID:" + id });
    
    const { error, value } = validateReport({ deviceID: id, moisture, light, humidity, temperature, tank });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const report = new Report({ deviceID: id, moisture, light, humidity, temperature, tank, created: Date.now() });
    await report.save();

    // Send Alert If Moisture Is Under 5%
    if (Number(moisture) < 5 && Number(tank) === 0) {
        const user = await User.findById(device.userID);
        const email_address = process.env.EMAIL_ADDRESS;
        const email_password = process.env.EMAIL_PASSWORD;
        const email_server = process.env.EMAIL_SERVER;
        console.log(email_address, email_password, email_server);
        
        const mailOptions = {                                          // Email Specifications
            from: process.env.EMAIL_ADDRESS,                                       
            to: user.email,                                            // From Request
            subject: 'Green Rooftop | Device Alert',
            html: `
                <h1>Your Green Rooftop Requires Attention</h1>
                <h2>The Current Moisture Level Is Critical and Water Tank Empty</h2>
                <p>
                    The last report of the device returned the following readings:
                    <ul>
                        <li>Moisture: ${ moisture }</li>
                        <li>Light: ${ light }</li>
                        <li>Humidity: ${ humidity }</li>
                        <li>Temperature: ${ temperature }</li>
                        <li>Water Tank: ${ Number(tank) === 0 ? "Empty" : "Full" }</li>
                    </ul>
                    <br />
                    If you find your soil well hidrated or the rainwater tank is full, please make sure that all sensors are connected properly!
                </p>
                <h2>Green Rooftop Team</h2>`
        };
    
        const transporter = nodemailer.createTransport({
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            },
            secure: true,
            port: 465,
            tls: { rejectUnauthorized: false },
            host: 'smtp.gmail.com',
        });
        
        await transporter.sendMail(mailOptions);
        // if (sent.accepted[0]) res.status(201).json({ success: true, message: "Confirmation Email Sent!" });
        // if (!sent.accepted[0]) res.status(500).json({ success: true, message: "Could Not Send Confirmation Email!" });
    }

    res.json({ success: true });
});


module.exports = router;
