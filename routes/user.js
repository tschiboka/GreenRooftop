const express = require("express");                                // RESTful Middleware
const router = express.Router();                                   // Router Middleware
const { User, validateUser } = require("../models/user");

// Empty App Requrest
router.post("/", async (req, res) => {                                       
    const { userName, email } = { ...req.body };
    console.log(userName, email);
    const { error, value } = validateUser(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const user = new User(req.body);
    await user.save();

    res.json({ success: true });
});


module.exports = router;
