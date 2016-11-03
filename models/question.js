let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        questionSchema = new Schema({
            pollsType: String,
            date: Date,
            questionText: String,
            answerOne: String,
            answerTwo: String,
            answerThree: String,
            answerFore: String
        })
        question =  mongoose.model('question', questionSchema);

module.exports = question;
