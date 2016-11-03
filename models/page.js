let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    pageSchema = new Schema({
        name: {
                type: String,
                required: true,
                unique: true,
            },
        title: {
                type: String,
                required: true
            },
        subtitle: {
            type: String,
            require: true
        },
        update: {
                type: Date,
                default: Date.now
            },
        text: {
            type: String,
            require: true,
            default: 'Page is empty'
        }
    }),
    Page= mongoose.model('Page', pageSchema);

module.exports = Page;