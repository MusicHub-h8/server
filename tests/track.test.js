const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const jwt = require("jsonwebtoken");

const { User, Track, Room } = require("../models");

let access_token = null;
let createdRoomId = null;
let createdTrackId = null;

beforeAll(async () => {
  const { _id } = await User.findOne({ email: "johndoe@gmail.com" });
  access_token = jwt.sign({ _id }, process.env.SECRET);
  const { _id: roomId } = await Room.create({
    music_title: "Laskar Pelangi",
    userIds: [],
    description: "Kuy jamming bareng",
    isOpen: true,
    roomOwner: _id
  });
  createdRoomId = roomId;
});

describe("Track Operations", () => {
  test("Should return status 201 on uploading a new track, complete with the track details", async done => {
    try {
      const res = await request
        .post("/tracks/" + createdRoomId)
        .field("instrument", "Bass")
        .attach("track", "./tests/1901_bass.mp3")
        .set("access_token", access_token);
      createdTrackId = res.body._id;
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("instrument");
      expect(res.body).toHaveProperty("userId");
      expect(res.body).toHaveProperty("roomId");
      expect(res.body).toHaveProperty("file_path");
      done();
    } catch (err) {
      console.log(err);
    }
  });
  // =====================================================================================================
  test("Should return status 200 on deleting a track, with success message", async done => {
    const res = await request
      .delete("/tracks/" + createdTrackId)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Delete Successful");
    done();
  });
});

afterAll(() => {
  Track.findOneAndDelete({ roomId: createdRoomId })
    .then()
    .catch(console.log);
});
