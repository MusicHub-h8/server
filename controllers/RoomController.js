const { Room, User, Track } = require("../models/");
const ObjectID = require("mongoose").Types.ObjectId;
const { exec } = require("child_process");

class RoomController {
  static create(req, res, next) {
    Room.create({
      music_title: req.body.music_title,
      description: req.body.description,
      roomOwner: req.currentUserId,
      isOpen: true,
      userIds: []
    })
      .then(room => {
        res.status(201).json(room);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }
  static delete(req, res, next) {
    Room.deleteOne({ _id: req.params.roomId })
      .then(_ => {
        res.status(200).json({ message: "Delete Successful" });
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static invite(req, res, next) {
    User.findById(req.params.userId).then();
    User.findByIdAndUpdate(
      req.params.userId,
      {
        $addToSet: { pendingInvites: ObjectID(req.params.roomId) }
      },
      { new: true }
    )
      .populate("pendingInvites")
      .then(user => {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== "test") {
          /* istanbul ignore next */
          req.socket.broadcast.emit("new_invite", user);
        }
        res.status(200).json(user);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static acceptInvite(req, res, next) {
    User.findByIdAndUpdate(
      req.params.userId,
      {
        $pull: { pendingInvites: ObjectID(req.params.roomId) }
      },
      { new: true }
    )
      .then(user => {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== "test") {
          /* istanbul ignore next */
          req.socket.broadcast.emit("accept_invite", user);
        }
        return Room.findByIdAndUpdate(
          req.params.roomId,
          {
            $push: { userIds: ObjectID(req.params.userId) }
          },
          { new: true }
        )
          .populate("userIds")
          .populate("roomOwner");
      })
      .then(room => {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== "test") {
          /* istanbul ignore next */
          req.socket.broadcast.emit("new_person_enters", room);
        }
        res.status(200).json(room);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static removeMember(req, res, next) {
    Room.findByIdAndUpdate(
      { _id: req.params.roomId },
      {
        $pull: { userIds: ObjectID(req.params.userId) }
      }
    )
      .then(room => {
        res.status(200).json(room);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static fetchMyRooms(req, res, next) {
    let owned = "";
    let involved = "";
    Room.find({ roomOwner: req.currentUserId })
      .populate("roomOwner")
      .sort("-createdAt")
      .then(result => {
        owned = result;
        return Room.find({ userIds: req.currentUserId }).populate("roomOwner");
      })
      .then(rooms => {
        involved = rooms;
        res.status(200).json({ owned, involved });
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static getRoomDetail(req, res, next) {
    let room = {};
    Room.findById(req.params.id)
      .populate("userIds")
      .populate("roomOwner")
      .then(data => {
        room.detail = data;
        return Track.find({ roomId: req.params.id });
      })
      .then(tracks => {
        room.tracks = tracks;
        res.status(200).json(room);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static exportTrack(req, res, next) {
    /* istanbul ignore next */
    Track.find({ roomId: req.params.roomId })
      .then(tracks => {
        let shellCommand = "ffmpeg";
        tracks.forEach(track => {
          shellCommand += ` -i ${track.file_path}`;
        });
        let filename = `${Date.now()}-output.mp3`;
        shellCommand += ` -filter_complex amix=inputs=2:duration=longest downloadable/${filename}`;
        exec(shellCommand, async (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            res.status(201).json({
              file_path: filename
            });
            return;
          }
          // console.log(process.cwd());
        });
      })
      .catch(next);
  }
}

module.exports = RoomController;
