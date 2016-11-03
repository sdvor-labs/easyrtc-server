let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	logEntrySchema = new Schema({
		type_error: String,
		date: Date,
		action: String,
		description: String
	}),
	logEntry= mongoose.model('LogEntry', logEntrySchema);

module.exports = logEntry;