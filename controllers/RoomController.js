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
    Room.deleteOne({ _id: req.params.roomId })
      .then(_ => {
        res.status(200).json({ message: "Delete Successful" });
      })
      .catch(err => {
        next(err);
      });
  }

  static invite(req, res, next) {
    console.log(req.params.roomId, "ini room id");
    console.log(ObjectID(req.params.roomId), "ini object room id");

    User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { pendingInvites: req.params.roomId }
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
        $pull: { pendingInvites: req.params.roomId }
      },
      { new: true }
    )
      .then(user => {
        console.log(user);
        return Room.findByIdAndUpdate(
          req.params.roomId,
          {
            $push: { userIds: req.params.userId }
          },
          { new: true }
        );
      })
      .then(room => {
        console.log(room);
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
        $pull: { userIds: req.params.userId }
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
      .then(result => {
        owned = result;
        return Room.find({ userIds: req.currentUserId.toString() });
      })
      .then(rooms => {
        involved = rooms;
        res.status(200).json({ owned, involved });
      })
      .catch(err => {
        next(err);
      });
  }
}

module.exports = RoomController;
