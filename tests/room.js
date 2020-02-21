require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
let access_token = null;
const axios = require("axios");

beforeAll(async () => {
  access_token = await axios({
    method: "POST",
    headers: {
      spotify_token: process.env.SPOTIFY_TOKEN
    }
  }).data.access_token;
});

describe("Room Operations", () => {
  test("Should return status 201 on creating a new room, as well as room data", async done => {
    const res = await request
      .post("/rooms")
      .send({
        music_title: "Hysteria",
        description: "Pop Rock, I WANT YOU NOW, LAST CHANCE TO LOSE CONTROL"
      })
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("music_title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("isOpen");
    expect(res.body).toHaveProperty("userIds");
    expect(res.body).toHaveProperty("roomOwner");
    done();
  });

  // ==========================================================================================================
});
