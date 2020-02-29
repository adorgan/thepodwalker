var mongoose = require("mongoose");

var emailSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    
});

module.exports = mongoose.model("Email", emailSchema);