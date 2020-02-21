const { User } = require("../models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");
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
                let genreTopArtist = result.items[0].genres[0].split(" ");
                return User.create({
                  display_name: data.id,
                  email: data.email,
                  avatar: data.images[0].url,
                  genre: genreTopArtist[1]
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
}

module.exports = UserController;
