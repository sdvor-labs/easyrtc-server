let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userTypeSchema = new Schema({
	name: String,
});

var UserType = mongoose.model('UserType', userTypeSchema);

module.exports = UserType;