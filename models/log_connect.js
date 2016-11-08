let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        entryConnectSchema = new Schema({
            clientInfo: Boolean,
            username: String, 
            userfio: String, 
            city: String,
            easyRtcToken: String,
            date: {
                type: Date,
                default: Date.now
            }
        }),
        EntryConnect =  mongoose.model('EntryConnect', entryConnectSchema);

module.exports = EntryConnect;