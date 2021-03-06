const supertest = require("supertest");
const app = require("../app_test");
const request = supertest(app);
const axios = require("axios");
const { User } = require("../models");
jest.mock("axios");

let access_token = null;

beforeAll(async () => {
  const { _id } = await User.create({
    email: "leroy.james@gmail.com",
    display_name: "leroyjames",
    avatar: "www.google.com",
    genre: "Pop",
    instruments: ["bass"]
  });
  axios.get.mockImplementation((url, options) => {
    if (url === "https://api.spotify.com/v1/me") {
      return Promise.resolve({
        data: {
          id: "jimmyjames",
          email: "jimmy.james@gmail.com",
          images: [
            {
              url: "http://www.bing.com"
            }
          ]
        }
      });
    } else if (url === "https://api.spotify.com/v1/me/top/artists") {
      return Promise.resolve({
        data: {
          items: [
            {
              genres: ["Blues"]
            }
          ]
        }
      });
    }
  });
  const res = await request.post("/users/login").set({
    spotify_token: "WOW"
  });
});
describe("User Operations", () => {
  test("Should return user's access token on spotify login & user create (for first time)", async done => {
    axios.get.mockImplementation((url, options) => {
      if (url === "https://api.spotify.com/v1/me") {
        return Promise.resolve({
          data: {
            display_name: "agusbambang",
            email: "agus.bambang@gmail.com",
            images: [
              {
                url: "http://www.google.com"
              }
            ]
          }
        });
      } else if (url === "https://api.spotify.com/v1/me/top/artists") {
        return Promise.resolve({
          data: {
            items: [
              {
                genres: ["Garage Rock"]
              }
            ]
          }
        });
      }
    });
    try {
      const res = await request.post("/users/login").set({
        spotify_token: "WOW"
      });
      expect(res.statusCode).toEqual(201);
      access_token = res.body.access_token;
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("user");
      done();
    } catch (err) {
      console.log(err);
    }
  });
  test("Should return user's access token on spotify login (for existing user)", async done => {
    axios.get.mockImplementation((url, options) => {
      if (url === "https://api.spotify.com/v1/me") {
        return Promise.resolve({
          data: {
            display_name: "jimmyjames",
            email: "jimmy.james@gmail.com",
            images: [
              {
                url: "http://www.bing.com"
              }
            ]
          }
        });
      } else if (url === "https://api.spotify.com/v1/me/top/artists") {
        return Promise.resolve({
          data: {
            items: [
              {
                genres: ["Blues"]
              }
            ]
          }
        });
      }
    });
    try {
      const res = await request.post("/users/login").set({
        spotify_token: "YEY"
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("user");
      done();
    } catch (err) {
      console.log(err);
    }
  });

  test("Should return current user's data", async done => {
    const res = await request.get("/users/me").set({
      access_token
    });
    expect(res.body).toHaveProperty("display_name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("avatar");
    expect(res.body).toHaveProperty("genre");
    expect(res.body).toHaveProperty("instruments");
    expect(res.body).toHaveProperty("pendingInvites");
    done();
  });

  test("Should return status 200 and return user's recommendations", async done => {
    const res = await request.get("/users/recommendations").set({
      access_token
    });
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });
  test("Should return status 200 and return user's data", async done => {
    const res = await request
      .patch("/users/instruments")
      .set({
        access_token
      })
      .send({ instruments: ["guitar"] });
    expect(res.statusCode).toEqual(200);
    done();
  });

  test("Should return status 200 and return allUsers data", async done => {
    const res = await request.get("/users").set({
      access_token
    });
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(typeof res.body[0]).toEqual("object");
    done();
  });
});

afterAll(() => {
  User.findOneAndDelete({ email: "agus.bambang@gmail.com" })
    .then(() => {
      return User.findOneAndDelete({ email: "jimmy.james@gmail.com" });
    })
    .then(() => {
      return User.findOneAndDelete({ email: "leroy.james@gmail.com" });
    })
    .catch(console.log);
});
