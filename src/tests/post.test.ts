import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import Post, { Gender, IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;

const user1: IUser = {
    email: "test@gmail.com",
    password: "123456",
    firstName: "Or",
    lastName: "Cohen",
    imageUrl: "none",
};

const user2: IUser = {
    email: "test2@gmail.com",
    password: "12345",
    firstName: "Ben",
    lastName: "Bon",
    imageUrl: "good-picture",
};

const post = {
    title: "Dog Post Test",
    description: "Sharing my experiences with my dog",
    dogInfo: {
        name: "Rex",
        breed: "Golden Retriever",
        gender: Gender.MALE,
        age: 3,
        weight: 30,
        height: 24,
        color: "Golden",
    },
    city: "Dogville",
};

let user1AccessToken = "";
let user2AccessToken = "";

let createdPost: IPost;

beforeAll(async () => {
    console.log("Before all tests");

    app = await initApp();

    await Post.deleteMany({ title: "Dog Post Test" });

    await User.deleteMany({ email: user1.email });
    await User.deleteMany({ email: user2.email });

    const user1RegisterResponse = await request(app).post("/auth/register").send(user1);
    user1._id = user1RegisterResponse.body._id;
    const user1LoginResponse = await request(app).post("/auth/login").send(user1);
    user1AccessToken = user1LoginResponse.body.accessToken;

    const user2RegisterResponse = await request(app).post("/auth/register").send(user2);
    user2._id = user2RegisterResponse.body._id;
    const user2LoginResponse = await request(app).post("/auth/login").send(user2);
    user2AccessToken = user2LoginResponse.body.accessToken;
});

afterAll(async () => {
    console.log("After all tests");

    await User.deleteMany({ email: user1.email });
    await User.deleteMany({ email: user2.email });

    await Post.deleteMany({ title: "Dog Post Test" });
    await Post.deleteMany({ ownerId: user1._id });

    await mongoose.connection.close();
});

describe("Post tests", () => {
    test("Test get all user posts - empty response", async () => {
        const response = await request(app)
            .get(`/post?ownerId=${user1._id}`)
            .set("Authorization", "JWT " + user1AccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test("Test delete non existing post", async () => {
        const response = await request(app)
            .delete("/post/65e331f152905ddf4fd05fff")
            .set("Authorization", "JWT " + user1AccessToken)
            .send();
        expect(response.statusCode).toBe(200);
    });

    test("Test create post", async () => {
        const response = await request<IPost>(app)
            .post("/post")
            .set("Authorization", "JWT " + user1AccessToken)
            .send(post);
        createdPost = response.body;

        expect(response.statusCode).toBe(201);
        expect(response.body.ownerId).toBe(user1._id);
    });

    test("Test get all user posts", async () => {
        const response = await request(app)
            .get(`/post?ownerId=${user1._id}`)
            .set("Authorization", "JWT " + user1AccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([createdPost]);
    });

    test("Test get specific post", async () => {
        const response = await request(app)
            .get(`/post/${createdPost._id}`)
            .set("Authorization", "JWT " + user1AccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(createdPost);
    });

    test("Test edit post", async () => {
        const response = await request<IPost>(app)
            .put(`/post/${createdPost._id}`)
            .set("Authorization", "JWT " + user1AccessToken)
            .send({ ...post, description: "new description" });
        createdPost = response.body;

        expect(response.statusCode).toBe(200);
        expect(response.body.ownerId).toBe(user1._id);
    });

    test("Test try to delete a post of other user", async () => {
        const response = await request(app)
            .delete(`/post/${createdPost._id}`)
            .set("Authorization", "JWT " + user2AccessToken);

        expect(response.statusCode).toBe(401);
    });

    test("Test delete user's post", async () => {
        const response = await request(app)
            .delete(`/post/${createdPost._id}`)
            .set("Authorization", "JWT " + user1AccessToken);

        expect(response.statusCode).toBe(200);
    });
});
