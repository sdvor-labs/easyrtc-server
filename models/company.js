/**
 * @author Nikita Kotov
 * @file company
 * @description Model for company collection
 */ 
let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	companySchema = new Schema({
		name: String,
		address: String,
		site: String,
		additional_info: String
	}),
	Company = mongoose.model('Company', companySchema);
/**
 * Object Company for work with collection companies
 * @exports Company
 */
module.exports = Company;