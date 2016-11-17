let mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        settingServerSchema = new Schema({
                name: String,
                value: Boolean
            }),
        settingServer =  mongoose.model('settingServer', settingServerSchema);

module.exports = settingServer;