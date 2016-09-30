let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let companySchema = new Schema({
	name: String,
	address: String,
	site: String,
	additional_info: String
});

var Company = mongoose.model('Company', companySchema);

module.exports = Company;