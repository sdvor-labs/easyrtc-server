let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        logFailedTokenizeSchema = new Schema({
                userInfo: String,
                date: Date,
                userAgent: String,
                error: String
            }),
        logFailedTokenize =  mongoose.model('logFailedTokenize', logFailedTokenizeSchema);

module.exports = logFailedTokenize;
