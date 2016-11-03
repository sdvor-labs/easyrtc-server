let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        logAnswersSchema = new Schema({
                pollsType: String,
                date: Date,
                answersToPolls: [],
                employeeRtcToken: String,
                custometRtcToken: String
            }),
        logAnswers =  mongoose.model('logAnswers', logAnswersSchema);

module.exports = logAnswers;

