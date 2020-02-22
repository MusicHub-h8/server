const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const axios = require("axios");
const { User } = require("../models");
jest.mock("axios");

let access_token = null;

beforeAll(async () => {
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
            id: "agusbambang",
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
      expect(res.statusCode).toEqual(200);
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
});

afterAll(() => {
  User.findOneAndDelete({ email: "agus.bambang@gmail.com" })
    .then(() => {
      return User.findOneAndDelete({ email: "jimmy.james@gmail.com" });
    })
    .then()
    .catch(console.log);
});
