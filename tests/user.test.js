require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

describe("User Operations", () => {
  test("Should return user's access token on spotify login", done => {
    // console.log(process.env.SPOTIFY_TOKEN);
    request
      .post("/users/login")
      .set({
        spotify_token: process.env.SPOTIFY_TOKEN
      })
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("access_token");
        done();
      })
      .catch(console.log);
    done();
  });
});
