let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let userSchema = new Schema({
  name: String,
  surname: String,
  lastname: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  mobile: String,
  status: [{type: Schema.Types.ObjectId, ref: 'UserStatus'}],
  company: [{type: Schema.Types.ObjectId, ref: 'Comapany'}],
  user_type: [{type: Schema.Types.ObjectId, ref: 'UserType'}],
  created_at: Date,
  last_online: Date,
  updated_at: Date,
  additional_info: String
});


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;