const { Room } = require("../models");

module.exports = function(req, res, next) {
  Room.findOne({ _id: req.params.roomId })
    .then(room => {
      if (room.roomOwner.toString() == req.currentUserId.toString()) {
        next();
      } else if (req.params.userId == req.currentUserId) {
        next();
      } else {
        res
          .status(401)
          .json({ message: "You are not authorized to do this action" });
      }
    })
    .catch(err => {
      next(err);
    });
};
