const { Room, User } = require("../models/");

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
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { pendingInvites: req.params.roomId }, new: true }
    )
      .then(user => {
        console.log(user);
        res.status(200).json(user);
      })
      .catch(err => {
        next(err);
      });
  }

  static acceptInvite(req, res, next) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { pendingInvites: req.params.roomId }, new: true }
    )
      .then(user => {
        return Room.findOneAndUpdate(
          { _id: req.params.roomId },
          {
            $push: { userIds: req.params.userId }
          }
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
