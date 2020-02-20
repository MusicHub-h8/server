const mongoose = require('mongoose')
const Schema = mongoose.Schema

var roomSchema = new Schema({
    music_title: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    url: String,
    description: String,
    isOpen: Boolean

})


var Room = mongoose.model('Room', roomSchema)
module.exports = Room