let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ursSchema = new Schema({
    room: [{type: Schema.Types.ObjectId, ref: 'Room'}],
    user: [{type: Schema.Types.ObjectId, ref: 'User'}],
    rtc_token: String,
    username: String,
});

var UserRtcToken = mongoose.model('UserRtcToken', ursSchema);

module.exports = UserRtcToken;