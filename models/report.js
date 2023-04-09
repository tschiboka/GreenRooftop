const Joi = require("joi");                                        // Use Joi for Validation
Joi.objectId = require('joi-objectid')(Joi);                       // Use for Validating MongoDB ObjectIDs
const mongoose = require("mongoose");                              // Database Handling
const schema = new mongoose.Schema({
    deviceID: {                                                      // USERID: FOREIGN KEY
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true,
    },
    moisture: {
        type: Number,
        required: true,
    },
    light: {
        type: Number,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    tank: {
        type: Number,
        required: true,
    },
});

const Report = mongoose.model("Report", schema);                       // Create Model

function validateReport(report) {
    const schema = Joi.object({
        deviceID: Joi.objectId().required(),
        moisture: Joi.number().required(),
        light: Joi.number().required(),
        humidity: Joi.number().required(),
        temperature: Joi.number().required(),
        tank: Joi.number().required(),
    });

    return schema.validate(report);
}

exports.Report = Report;
exports.validateReport = validateReport;