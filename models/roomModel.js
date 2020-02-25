const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var roomSchema = new Schema(
  {
    music_title: {
      type: String,
      required: true
    },
    userIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    description: String,
    isOpen: Boolean,
    roomOwner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

var Room = mongoose.model("Room", roomSchema);
module.exports = Room;
