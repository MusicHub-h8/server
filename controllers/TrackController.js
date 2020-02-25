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
        /* istanbul ignore next */
        req.socket.broadcast.emit("new_track", result);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static delete(req, res, next) {
    Track.deleteOne({ _id: req.params.id })
      .then(_ => {
        /* istanbul ignore next */
        req.socket.broadcast.emit("delete_track", result);
        res.status(200).json({ message: "Delete Successful" });
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }
}

module.exports = TrackController;
