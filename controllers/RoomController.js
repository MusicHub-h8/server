const { Room, User } = require("../models/");
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
    Room.deleteOne({ _id: req.params.id })
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
}

module.exports = RoomController;
