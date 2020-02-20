const mongoose = require('mongoose')
const Schema = mongoose.Schema

var trackSchema = new Schema({
    instrument: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true},
    file_path: String
})


var Track = mongoose.model('Track', trackSchema)
module.exports = Track