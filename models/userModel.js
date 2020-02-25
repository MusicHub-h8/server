const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  display_name: String,
  email: String,
  avatar: String,
  genre: String,
  instruments: Array,
  pendingInvites: [{ type: Schema.Types.ObjectId, ref: "Room" }]
});

var User = mongoose.model("User", userSchema);
module.exports = User;
