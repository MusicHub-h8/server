const { Room } = require("../models");

module.exports = function(req, res, next) {
  Room.findOne({ _id: req.params.id })
    .then(room => {
      console.log(room);
      if (room.roomOwner.toString() == req.currentUserId.toString()) {
        next();
      } else {
        res
          .status(400)
          .json({ message: "You are not authorized to do this action" });
      }
    })
    .catch(err => {
      next(err);
    });
};
