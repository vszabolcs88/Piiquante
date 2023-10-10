//***Create a user model***/

//import mongoose
const mongoose = require('mongoose');
//import mongoose unique validator
const uniqueValidator = require('mongoose-unique-validator')

//create user schema:
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//check the email address before send it to the databasse
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);