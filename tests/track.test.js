const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const jwt = require("jsonwebtoken");

const { User, Track } = require("../models");

let access_token = null;

beforeAll(async () => {
  const { _id } = User.findOne({ email: "johndoe@gmail.com" });
  access_token = jwt.sign({ _id }, process.env.SECRET);
});

describe("Track Operations", () => {
  test("Should return status 201 on uploading a new track, complete with the track details", async done => {
    const res = await request
      .post("/tracks")
      .send({
        instrument: "Piano",
        roomId: "AWESOME_ROOM_ID",
        file_path: "http://testdummy.com"
      })
      .set("access_token", access_token);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("instrument");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("roomId");
    expect(res.body).toHaveProperty("file_path");
  });
});

afterAll(() => {
  Track.findOneAndDelete({ roomId: "AWESOME_ROOM_ID" })
    .then()
    .catch(console.log);
});
