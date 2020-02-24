const { Track } = require("../models");

module.exports = function(req, res, next) {
  Track.findOne({ _id: req.params.id })
    .then(track => {
      if (track.userId.toString() == req.currentUserId.toString()) {
        next();
      } else {
        res
          .status(401)
          .json({ message: "You are not authorized to do this action" });
      }
    })
    .catch(err => {
      /* istanbul ignore next */
      next(err);
    });
};
