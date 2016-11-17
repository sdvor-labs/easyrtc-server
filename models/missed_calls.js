let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        missedCallsSchema = new Schema({
                userInfo: String,
                date: Date,
                easyRtcToken: String
            }),
        missedCalls =  mongoose.model('missedCalls', missedCallsSchema);

module.exports = missedCalls;