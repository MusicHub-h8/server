const { User } = require("../models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const genreCounter = require("../helpers/genreCounter");
var faker = require("faker");

class UserController {
  static login(req, res, next) {
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.headers.spotify_token}`
        }
      })
      .then(({ data }) => {
        User.findOne({ email: data.email }).then(user => {
          if (user) {
            const access_token = jwt.sign(
              { _id: user._id },
              process.env.SECRET
            );
            res.status(200).json({ access_token, user });
          } else {
            axios
              .get("https://api.spotify.com/v1/me/top/artists", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${req.headers.spotify_token}`
                }
              })
              .then(({ data: result }) => {
                let genre = genreCounter(result);
                let image = data.images[0]
                  ? data.images[0].url
                  : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d94682f8-fdc9-492d-86c4-844e5ba55c4e/d1hisi9-085f9f5e-9c01-49af-bb7e-33d8af59cba7.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Q5NDY4MmY4LWZkYzktNDkyZC04NmM0LTg0NGU1YmE1NWM0ZVwvZDFoaXNpOS0wODVmOWY1ZS05YzAxLTQ5YWYtYmI3ZS0zM2Q4YWY1OWNiYTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.1vE7epA7X2gKadNmh56v0m8_RZxkRE3sEqBAsbB2DDU";
                return User.create({
                  display_name: data.display_name,
                  email: data.email,
                  avatar: image,
                  genre: genre
                });
              })
              .then(user => {
                const access_token = jwt.sign(
                  { _id: user._id },
                  process.env.SECRET
                );
                res.status(201).json({ access_token, user });
              });
          }
        });
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static getUserDetails(req, res, next) {
    User.findById(req.currentUserId)
      .populate({
        path: "pendingInvites",
        populate: {
          path: "roomOwner",
          model: "User"
        }
      })
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static getRecommendedUser(req, res, next) {
    User.findOne({ _id: req.currentUserId })
      .then(user => {
        return User.find({ genre: user.genre });
      })
      .then(recommendations => {
        let result = recommendations.filter(recommendation => {
          return recommendation._id.toString() !== req.currentUserId.toString();
        });
        res.status(200).json(result);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  static addInstruments(req, res, next) {
    User.findByIdAndUpdate(
      { _id: req.currentUserId },
      {
        instruments: req.body.instruments
      },
      { new: true }
    )
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }

  /* istanbul ignore next */
  static generateDummies(req, res, next) {
    let genres = [
      "EDM",
      "Beats",
      "Pop",
      "Metal",
      "Rock",
      "Reggae",
      "New age",
      "Jazz",
      "Hip-hop",
      "Folk",
      "Electronic",
      "Country",
      "Classical",
      "Blues"
    ];

    for (let i = 0; i < 20; i++) {
      let instruments = [
        "Guitar",
        "Piano",
        "Violin",
        "Bass",
        "Drums",
        "Vocal",
        "Keyboard",
        "Acapella",
        "Saxophone"
      ];
      let randomName = faker.name.findName();
      let randomEmail = faker.internet.email();
      let randomImage = faker.image.avatar();
      let indexGenre = Math.floor(Math.random() * genres.length);
      let indexInstrument = Math.floor(Math.random() * instruments.length);

      User.create({
        display_name: randomName,
        email: randomEmail,
        avatar: randomImage,
        genre: genres[indexGenre],
        instruments: instruments[indexInstrument],
        pendingInvites: []
      })
        .then(() => {
          res.status(201).json({ message: "Dummies successfully created" });
        })
        .catch(console.log);
    }
  }
  static fetchAllUsers(req, res, next) {
    User.find()
      .then(result => {
        res
          .status(200)
          .json(
            result.filter(
              user => user._id.toString() !== req.currentUserId.toString()
            )
          );
      })
      .catch(err => {
        /* istanbul ignore next */
        next(err);
      });
  }
}

module.exports = UserController;
