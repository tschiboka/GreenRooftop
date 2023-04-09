const express = require("express");                                // RESTful Middleware
const router = express.Router();                                   // Router Middleware
const { User, validateUser } = require("../models/user");
const { Device, validateDevice } = require("../models/device");

// Empty App Requrest
router.post("/", async (req, res) => {                                       
    const userID  = req.body.userID;
    const { error, value } = validateDevice({ userID });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ success: false, message: "Could not find user with id:" + userID });

    const device = new Device(req.body);
    await device.save();

    res.json({ success: true });
});


module.exports = router;
