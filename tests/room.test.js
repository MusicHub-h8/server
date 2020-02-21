require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const { User, Room } = require("../models");
const jwt = require("jsonwebtoken");

let access_token = null;
let createdRoomId = null;
let idToInvite = null;
let unauthorizedAccessToken = null;

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

  // const { _id: unauthorizedId } = await User.create({
  //   email: "bobby@gmail.com",
  //   display_name: "bobby",
  //   avatar: "www.google.com",
  //   genre: "Rock",
  //   instruments: ["Drums"]
  // });
  // unauthorizedAccessToken = jwt.sign(
  //   { _id: unauthorizedId },
  //   process.env.SECRET
  // );
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
    expect(res.body.userIds.length).not.toEqual(0);
    done();
  });
  // ==========================================================================================================
  test("Should return status 200 on removing a member", async done => {
    const res = await request
      .patch(`/rooms/${createdRoomId}/remove/${idToInvite}`)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.userIds.indexOf(idToInvite)).toEqual(-1);
    done();
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

describe("Error Handling", () => {
  test("Providing invalid/no token will return proper error message and status code 400", async done => {
    const res = await request.post("/rooms").send({
      music_title: "Hysteria",
      description: "Pop Rock, I WANT YOU NOW, LAST CHANCE TO LOSE CONTROL"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      "Your Authorization token is either empty or invalid"
    );
    done();
  });

  test("Providing empty field(s) will return proper error message and status code 400", async done => {
    const res = await request.post("/rooms").set("access_token", access_token);
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0]).toEqual("Path `music_title` is required.");
    done();
  });

  test("Editing, deleting or removing without privilege will return proper error message and status code 400", async done => {
    const res = await request
      .patch(`/rooms/5e4f7702f710bd1dcc2eed62/remove/${idToInvite}`)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual(
      "You are not authorized to do this action"
    );
    done();
  });
});

afterAll(() => {
  Room.findOneAndDelete({ music_title: "Laskar Pelangi" })
    .then()
    .catch(console.log);
});
