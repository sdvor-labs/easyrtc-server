/**
 * @author Nikita Kotov
 * @file company
 * @description Model for company collection
 */ 
let mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 *	Objcet schema for company mogoose object
 *	@typedef companySchema
 *	@type {object}
 *	@property {string} name - name of company
 *	@property {string} address - location of company
 *	@property {string} site - url site company
 *	@property {string} additional_info - additional information about company
 */
let companySchema = new Schema({
	name: String,
	address: String,
	site: String,
	additional_info: String
});

let Company = mongoose.model('Company', companySchema);
/**
 * Object Company for work with collection companies
 * @exports Company
 */
module.exports = Company;