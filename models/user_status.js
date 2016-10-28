let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let statusSchema = new Schema({
	name: String,
	set_at: Date
});

let Status = mongoose.model('Status', statusSchema);

module.exports = Status;