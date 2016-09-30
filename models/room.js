// grab the things we need
let mongoose = require('mongoose'),
        Schema = mongoose.Schema;

// Create schema for chat-rooms
// main attributes: name (string), visiability (string)
let roomSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        visiability: {
            type: String,
            enum: ['public', 'private'],
            required: true
        }
    });
// the schema is unless so far
// we need to create a model using it
let Room =  mongoose.model('Room', roomSchema);
// make this avaliable to our users in our Node applications
module.exports = Room;

