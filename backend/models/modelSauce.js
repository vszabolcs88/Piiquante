//***Creating a data schema that contains the fields for each Sauce***
const mongoose = require('mongoose');

//This model allows you to enforce your data structure and makes read and write operations to the database
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type:Number, required: true },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
    userId: { type: String, required: true },
});

//Export that schema as a Mongoose model
module.exports = mongoose.model('modelSauce', sauceSchema);