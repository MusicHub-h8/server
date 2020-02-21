const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var roomSchema = new Schema({
  music_title: {
    type: String,
    required: true
  },
  userIds: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
  description: String,
  isOpen: Boolean,
  roomOwner: { type: Schema.Types.ObjectId, ref: "User" }
});

var Room = mongoose.model("Room", roomSchema);
module.exports = Room;
