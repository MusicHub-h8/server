require("dotenv").config();
const supertest = require("supertest");
const app = require("../app_test");
const request = supertest(app);
const { User, Room } = require("../models");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongoose").Types.ObjectId;

let access_token = null;
let createdRoomId = null;
let idToInvite = null;
let unauthorizedRoomId = null;

beforeAll(async () => {
  const { _id } = await User.create({
    email: "foo.bar@gmail.com",
    display_name: "foobar",
    avatar: "www.yahoo.com",
    genre: "Swing",
    instruments: ["Keyboard"]
  });
  access_token = jwt.sign({ _id }, process.env.SECRET);

  const { _id: toInvite } = await User.create({
    email: "bobby.morse@gmail.com",
    display_name: "bobbymorse",
    avatar: "www.tokopedia.com",
    genre: "Classic",
    instruments: ["Piano"]
  });
  idToInvite = toInvite;

  const { _id: unauthorizedId } = await User.create({
    email: "bustin.jieber@gmail.com",
    display_name: "bustinjieber",
    avatar: "www.youtube.com",
    genre: "Folk",
    instruments: ["Gendang"]
  });
  unauthorizedAccessToken = jwt.sign(
    { _id: unauthorizedId },
    process.env.SECRET
  );

  const { _id: idRoom } = await Room.create({
    music_title: "Somebody to Love",
    description: "Can anybody find meeeeeeeeeeeeeeeeeeee",
    isOpen: true,
    userIds: [],
    roomOwner: unauthorizedId
  });
  unauthorizedRoomId = idRoom;
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
    expect(res.body.pendingInvites[0].toString()).toEqual(
      createdRoomId.toString()
    );
    expect(res.body.pendingInvites.length).not.toEqual(0);
    done();
  });

  // // ==========================================================================================================

  test("Should return status 200 on invitation accept and room new status", async done => {
    const res = await request
      .patch(`/rooms/${createdRoomId}/invite/${idToInvite}`)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.userIds[0]._id.toString()).toEqual(idToInvite.toString());
    expect(res.body.userIds.length).not.toEqual(0);
    done();
  });

  // ==========================================================================================================
  test("Should return status 200 and array of rooms that a user is involved in", async done => {
    const res = await request
      .get("/rooms/me")
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("involved");
    expect(res.body).toHaveProperty("owned");
    done();
  });

  // ==========================================================================================================
  test("Should return status 200 and a rooms details and tracks on route hitting", async done => {
    const res = await request
      .get("/rooms/" + createdRoomId)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.detail).toHaveProperty("music_title");
    expect(res.body.detail).toHaveProperty("userIds");
    expect(res.body.detail).toHaveProperty("description");
    expect(res.body.detail).toHaveProperty("isOpen");
    expect(res.body.detail).toHaveProperty("roomOwner");
    expect(Array.isArray(res.body.tracks)).toEqual(true);
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

  test("Editing, deleting or removing without privilege will return proper error message and status code 401", async done => {
    const res = await request
      .delete(`/rooms/${unauthorizedRoomId}`)
      .set("access_token", access_token);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual(
      "You are not authorized to do this action"
    );
    done();
  });
});

afterAll(() => {
  User.findOneAndDelete({ email: "bobby.morse@gmail.com" })
    .then(() => {
      return User.findOneAndDelete({ email: "foo.bar@gmail.com" });
    })
    .then(() => {
      return Room.findOneAndDelete({ music_title: "Laskar Pelangi" });
    })
    .then(() => {
      return User.findOneAndDelete({ email: "bustin.jieber@gmail.com" });
    })
    .then(() => {
      return Room.findOneAndDelete({ music_title: "Somebody to Love" });
    })
    .catch(console.log);
});
