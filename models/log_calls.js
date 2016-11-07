let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        logEntryCallSchema = new Schema({
                callStart: String,
                callEnd: String,
                employeeToken: String,
                customerToken: String,
                description: String
            }),
        logEntryCall =  mongoose.model('logEntryCall', logEntryCallSchema);

module.exports = logEntryCall;

