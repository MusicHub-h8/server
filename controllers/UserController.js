const { User } = require("../models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const genreCounter = require("../helpers/genreCounter");

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
            res.status(200).json({ access_token });
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
                console.log("masuk sini");
                let genre = genreCounter(result);
                let image = data.images[0]
                  ? data.images[0].url
                  : "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
                return User.create({
                  display_name: data.id,
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
                res.status(200).json({ access_token });
              });
          }
        });
      })
      .catch(err => {
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
        next(err);
      });
  }
}

module.exports = UserController;
