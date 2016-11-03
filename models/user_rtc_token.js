let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ursSchema = new Schema({
        room: [{type: Schema.Types.ObjectId, ref: 'Room'}],
        user: [{type: Schema.Types.ObjectId, ref: 'User'}],
        rtc_token: String,
        username: String,
    }),
    UserRtcToken = mongoose.model('UserRtcToken', ursSchema);

module.exports = UserRtcToken;