const { Room } = require("../models/index");

class RoomController {
  static create(req, res, next) {
    console.log("masuk create");
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
    Room.delete({ _id: req.params.id })
      .then(_ => {
        res.status(200).json({ message: "Delete successful" });
      })
      .catch(err => {
        next(err);
      });
  }
}

module.exports = RoomController;
