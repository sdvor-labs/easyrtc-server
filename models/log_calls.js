let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        logEntryCallSchema = new Schema({
                callStart: Date,
                callDuratuion: String,
                callEnd: Date,
                employeeToken: String,
                customerToken: String
            }),
        logEntryCall =  mongoose.model('logEntryCall', logEntryCallSchema);

module.exports = logEntryCall;

