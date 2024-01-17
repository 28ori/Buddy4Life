import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import UserPost, { IUserPost } from "../models/user_post_model";
// import User, { IUser } from "../models/user_model";

let app: Express;
// const user: IUser = {
//   email: "test@student.post.test",
//   password: "1234567890",
// }
// let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await UserPost.deleteMany();

//   await User.deleteMany({ 'email': user.email });
//   const response = await request(app).post("/auth/register").send(user);
//   user._id = response.body._id;
//   const response2 = await request(app).post("/auth/login").send(user);
//   accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

const post1: IUserPost = {
  // _id: "123",
  title: "myFirstPost",
  category: "adoptionRequest",
  breed: "somebreed",
  description: "A good dog",
  userid: "12345",
  age: 10,
  color: "brown",
  city: "NYC"
};




describe("User post tests", () => {
  const addStudentPost = async (post: IUserPost) => {
    const response = await request(app)
      .post("/post")
      // .set("Authorization", "JWT " + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    // expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(post.title);
    expect(response.body.description).toBe(post.description);
    expect(response.body.category).toBe(post.category);
    expect(response.body.breed).toBe(post.breed);
    expect(response.body.age).toBe(post.age);
    expect(response.body.color).toBe(post.color);
    expect(response.body.city).toBe(post.city);
  }

  // const deleteStudentPost = async (post: IUserPost) => {
  //   const response = await request(app)
  //     .delete(`/post/${post._id}`)
  //     // .set("Authorization", "JWT " + accessToken)
  //     .send(post);
  //   expect(response.statusCode).toBe(200);
  //   // expect(response.body.owner).toBe(user._id);
  //   // expect(response.body._id).toBe(post._id);
  //   expect(response.body.title).toBe(post.title);
  //   expect(response.body.description).toBe(post.description);
  //   expect(response.body.category).toBe(post.category);
  //   expect(response.body.breed).toBe(post.breed);
  //   expect(response.body.age).toBe(post.age);
  //   expect(response.body.color).toBe(post.color);
  //   expect(response.body.city).toBe(post.city);
  // }

  test("Test Get All User posts - empty response", async () => {
    const response = await request(app).get("/post");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post User post", async () => {
    addStudentPost(post1);
  });

  test("Test Get All Users posts with one post in DB", async () => {
    const response = await request(app).get("/post");
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(post1.title);
    // expect(rc.owner).toBe(user._id);
    expect(rc.title).toBe(post1.title);
    expect(rc.description).toBe(post1.description);
    expect(rc.category).toBe(post1.category);
    expect(rc.breed).toBe(post1.breed);
    expect(rc.age).toBe(post1.age);
    expect(rc.color).toBe(post1.color);
    expect(rc.city).toBe(post1.city);
  });

  // test("Test delete a post", async () => {
  //   deleteStudentPost(post1)
  // });
  
});