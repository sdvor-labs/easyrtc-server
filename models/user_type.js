let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	userTypeSchema = new Schema({
		name: String,
	}),
	UserType = mongoose.model('UserType', userTypeSchema);

module.exports = UserType;