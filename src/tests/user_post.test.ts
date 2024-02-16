import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;
const user1: IUser = {
    email: "test@gmail.com",
    password: "123456",
    lastName: "Cohen",
    firstName: "Or",
    imageUrl: "none",
};

const user2: IUser = {
    email: "test2@gmail.com",
    password: "12345",
    lastName: "Bon",
    firstName: "Ben",
    imageUrl: "good-picture",
};

let user1AccessToken = "";
let user2AccessToken = "";

let post1_id = "";

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await Post.deleteMany();

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
    await mongoose.connection.close();
});

const post1: IPost = {
    title: "myFirstPost",
    category: "adoptionRequest",
    breed: "somebreed",
    description: "A good dog",
    ownerId: "12345",
    age: 10,
    color: "brown",
    city: "NYC",
};

describe("User post tests", () => {
    const addPost = async (post: IPost) => {
        const response = await request(app)
            .post("/post")
            .set("Authorization", "JWT " + user1AccessToken)
            .send(post);
        post1_id = response.body._id;
        expect(response.statusCode).toBe(201);
        // expect(response.body.owner).toBe(user._id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.description).toBe(post.description);
        expect(response.body.category).toBe(post.category);
        expect(response.body.breed).toBe(post.breed);
        expect(response.body.age).toBe(post.age);
        expect(response.body.color).toBe(post.color);
        expect(response.body.city).toBe(post.city);
    };

    const deletePost = async (post: IPost, post_id: string, userAccessToken: string) => {
        const response = await request(app)
            .delete(`/post/${post_id}`)
            .set("Authorization", "JWT " + userAccessToken)
            .send(post);

        expect(response.statusCode).toBe(200);
        // expect(response.body.owner).toBe(user._id);
        expect(response.body._id).toBe(post_id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.description).toBe(post.description);
        expect(response.body.category).toBe(post.category);
        expect(response.body.breed).toBe(post.breed);
        expect(response.body.age).toBe(post.age);
        expect(response.body.color).toBe(post.color);
        expect(response.body.city).toBe(post.city);
    };

    test("Test Get All User posts - empty response", async () => {
        const response = await request(app)
            .get("/post")
            .set("Authorization", "JWT " + user1AccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test("Test Post User post", async () => {
        addPost(post1);
    });

    test("Test Get All Users posts with one post in DB", async () => {
        const response = await request(app)
            .get("/post")
            .set("Authorization", "JWT " + user1AccessToken);
        expect(response.statusCode).toBe(200);
        await console.log("response of get all: " + JSON.stringify(response.body));
        const rc = response.body[0];
        expect(rc.title).toBe(post1.title);
        expect(rc.ownerId).toBe(user1._id);
        expect(rc.title).toBe(post1.title);
        expect(rc.description).toBe(post1.description);
        expect(rc.category).toBe(post1.category);
        expect(rc.breed).toBe(post1.breed);
        expect(rc.age).toBe(post1.age);
        expect(rc.color).toBe(post1.color);
        expect(rc.city).toBe(post1.city);
    });

    test("Test try to delete a post of other user - should fail", async () => {
        const response = await request(app)
            .delete(`/post/${post1_id}`)
            .set("Authorization", "JWT " + user2AccessToken);

        expect(response.statusCode).not.toBe(200);
    });

    test("Test delete user's post", async () => {
        deletePost(post1, post1_id, user1AccessToken);
    });
});
