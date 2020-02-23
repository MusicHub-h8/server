const { Room, User, Track } = require("../models/");
const ObjectID = require("mongoose").Types.ObjectId;

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
        next(err);
      });
  }
  static delete(req, res, next) {
    Room.deleteOne({ _id: req.params.roomId })
      .then(_ => {
        res.status(200).json({ message: "Delete Successful" });
      })
      .catch(err => {
        next(err);
      });
  }

  static invite(req, res, next) {
    User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { pendingInvites: ObjectID(req.params.roomId) }
      },
      { new: true }
    )
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => {
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
        return Room.findByIdAndUpdate(
          req.params.roomId,
          {
            $push: { userIds: ObjectID(req.params.userId) }
          },
          { new: true }
        );
      })
      .then(room => {
        res.status(200).json(room);
      })
      .catch(err => {
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
        next(err);
      });
  }

  static fetchMyRooms(req, res, next) {
    let owned = "";
    let involved = "";
    Room.find({ roomOwner: req.currentUserId })
      .sort("-createdAt")
      .then(result => {
        owned = result;
        return Room.find({ userIds: req.currentUserId });
      })
      .then(rooms => {
        involved = rooms;
        res.status(200).json({ owned, involved });
      })
      .catch(err => {
        next(err);
      });
  }

  static getRoomDetail(req, res, next) {
    let room = {};
    Room.findById(req.params.id)
      .then(data => {
        room.detail = data;
        return Track.find({ roomId: req.params.id });
      })
      .then(tracks => {
        room.tracks = tracks;
        res.status(200).json(room);
      })
      .catch(next);
  }
}

module.exports = RoomController;
