let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let statusSchema = new Schema({
	name: String,
	set_at: Date
});

var Status = mongoose.model('Status', statusSchema);

module.exports = Status;