let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    userSchema = new Schema({
      name: String,
      surname: String,
      lastname: String,
      username: {
        type: String,
        required: true,
        unique: true
      },
      hashedPassword: {
        type: String,
        required: true
      },
      salt: {
        type:String,
        required: true
      },
      admin: Boolean,
      location: String,
      mobile: String,
      status: [{type: Schema.Types.ObjectId, ref: 'UserStatus'}],
      company: [{type: Schema.Types.ObjectId, ref: 'Comapany'}],
      user_type: [{type: Schema.Types.ObjectId, ref: 'UserType'}],
      created_at: Date,
      last_online: Date,
      updated_at: Date,
      additional_info: String,
        token: String,
    });

userSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

let User = mongoose.model('User', userSchema);

module.exports = User;