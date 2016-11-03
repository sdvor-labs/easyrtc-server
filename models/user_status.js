let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	statusSchema = new Schema({
		name: String,
		set_at: Date
	}),
	Status = mongoose.model('Status', statusSchema);

module.exports = Status;