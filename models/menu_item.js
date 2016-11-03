let mongoose = require('mongoose'),
        Schema = mongoose.Schema;

let menuItemSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        label: {
                type: String,
                require: true,
                unique: true
        },
        visiability: {
            type: Boolean,
            default: true
        },
        page: [{type: Schema.Types.ObjectId, ref: 'Page'}]
    });

let menuItem =  mongoose.model('menuItem', menuItemSchema);

module.exports = menuItem;
