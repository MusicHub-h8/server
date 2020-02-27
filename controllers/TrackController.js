const { Track } = require("../models/index");
const fs = require("fs");
const bucketName = process.env.CLOUD_BUCKET;
const filepath = "./uploads/";
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

class TrackController {
  static async upload(req, res, next) {
    let filename = `${req.body.instrument}-${Date.now()}-${
      req.currentUserId
    }.mp3`;
    try {
      let bitmap = Buffer.from(
        req.body.track.replace("data:audio/mp3;base64,", ""),
        "base64"
      );
      fs.writeFileSync(`./uploads/${filename}`, bitmap);
      await storage.bucket(bucketName).upload(filepath + filename, {
        gzip: true,
        metadata: {
          cacheControl: "public, max-age=31536000"
        }
      });
      fs.unlinkSync(`${process.cwd()}/uploads/${filename}`);
      const result = await Track.create({
        instrument: req.body.instrument,
        userId: req.currentUserId,
        roomId: req.params.roomId,
        file_path: `https://storage.googleapis.com/${bucketName}/${filename}`
      });
      if (process.env.NODE_ENV !== "test") {
        req.socket.broadcast.emit(
          `new_track_upload_${req.params.roomId}`,
          result
        );
      }
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    Track.deleteOne({ _id: req.params.id })
      .then(result => {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== "test") {
          /* istanbul ignore next */
          req.socket.broadcast.emit("delete_track", result);
        }
        res.status(200).json({ message: "Delete Successful" });
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }
}

module.exports = TrackController;
