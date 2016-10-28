let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let userTypeSchema = new Schema({
	name: String,
});

let UserType = mongoose.model('UserType', userTypeSchema);

module.exports = UserType;