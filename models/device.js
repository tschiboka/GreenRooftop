const Joi = require("joi");                                        // Use Joi for Validation
Joi.objectId = require('joi-objectid')(Joi);                       // Use for Validating MongoDB ObjectIDs
const mongoose = require("mongoose");                              // Database Handling
const schema = new mongoose.Schema({
    userID: {                                                      // USERID: FOREIGN KEY
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Device = mongoose.model("Device", schema);                       // Create Model

function validateDevice(device) {
    const schema = Joi.object({
        userID: Joi.objectId().required()
    });

    return schema.validate(device);
}


exports.Device = Device;
exports.validateDevice = validateDevice;