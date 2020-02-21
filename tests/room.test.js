require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const { User, Room } = require("../models");
const jwt = require("jsonwebtoken");

let access_token = null;
let createdRoomId = null;
let idToInvite = null;

beforeAll(async () => {
  const { _id } = await User.create({
    email: "jimmyjames@gmail.com",
    display_name: "jimmyjames",
    avatar: "www.google.com",
    genre: "Pop",
    instruments: ["bass"]
  });
  access_token = jwt.sign({ _id }, process.env.SECRET);
  const { _id: toInvite } = await User.findOne({ email: "johndoe@gmail.com" });
  idToInvite = toInvite;
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
    createdRoomId = res.body._id;
    done();
  });

  // ==========================================================================================================

  test("Should return status 200 on new member invite with his/her data as proof", async done => {
    const res = await request
      .post(`/rooms/${createdRoomId}/invite/${idToInvite}`)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.pendingInvites.length).not.toEqual(0);
    done();
  });

  // // ==========================================================================================================

  test("Should return status 200 on invitation accept and room new status", async done => {
    const res = await request
      .patch(`/rooms/${createdRoomId}/invite/${idToInvite}`)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.userIds.length).not.toEqual(1);
  });

  // ==========================================================================================================
  test("Should return status 200 on deleting a room, with success message", async done => {
    const res = await request
      .delete("/rooms/" + createdRoomId)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Delete Successful");
    done();
  });
});

// afterAll(() => {
//   Room.findOneAndDelete({ music_title: "Hysteria" })
//     .then()
//     .catch(console.log);
// });
