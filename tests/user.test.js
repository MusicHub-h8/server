require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

describe("User Operations", () => {
  test("Should return user's access token on spotify login", async done => {
    const res = await request.post("/users/login").set({
      spotify_token: process.env.SPOTIFY_TOKEN
    });
    expect(res.body).toHaveProperty("access_token");
    done();
  });
});
