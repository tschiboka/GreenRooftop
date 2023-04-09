const Joi = require("joi");                                        // Use Joi for Validation
Joi.objectId = require('joi-objectid')(Joi);                       // Use for Validating MongoDB ObjectIDs
const mongoose = require("mongoose");                              // Database Handling
const schema = new mongoose.Schema({
    email: {                                                       // EMAIL: STRING REQUIRED, UNIQUE, MAX: 255
        type: String, 
        required: true, 
        unique: true,
        maxlenght: 255,
        trim: true,
        lowercase: true,
    },         
    userName: {                                                    // USERNAME: STRING, REQUIRED, UNIQUE, MIN: 5, MAX: 20
        type: String, 
        required: true,
        unique: true,
        minlength: 5,
        maxlenght: 20,
        trim: true,
    },
});

const User = mongoose.model("User", schema);                       // Create Model

const userSchema = Joi.object({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    userName: Joi.string().required().min(5).max(20),
  });
  
function validateUser(user) {
    return userSchema.validate(user);
}


exports.User = User;
exports.validateUser = validateUser;