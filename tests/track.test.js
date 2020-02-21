require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
let access_token = null;
let room_id = null;
const axios = require("axios");

beforeAll(async () => {
  access_token = await axios({
    method: "POST",
    headers: {
      spotify_token: process.env.SPOTIFY_TOKEN
    }
  }).data.access_token;

  room_id = await axios({
    method: "POST",
    headers: {
      access_token
    }
  }).data._id;
});

describe("Track Operations", () => {
  test("Should return status 201 on uploading a new track, complete with the track details", async done => {
    const res = await request.post("/tracks").send({
      instrument: "Piano",
      roomId: room_id,
      file_path: "http://testdummy.com"
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("instrument");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("roomId");
    expect(res.body).toHaveProperty("file_path");
  });
});
