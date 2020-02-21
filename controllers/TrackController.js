const { Track } = require("../models/index");

class TrackController {
  static upload(req, res, next) {
    Track.create({
      instrument: req.body.instrument,
      userId: req.currentUserId,
      roomId: req.params.roomId,
      file_path: req.file.cloudStoragePublicUrl
    })
      .then(result => {
        res.status(201).json(result);
      })
      .catch(err => {
        next(err);
      });
  }
}

module.exports = TrackController;
