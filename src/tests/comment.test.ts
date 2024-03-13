import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import Post, { Gender, IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;

const user: IUser = {
    email: "test@gmail.com",
    password: "123456",
    firstName: "Or",
    lastName: "Cohen",
    imageUrl: "none",
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

const comment = {
    text: "my test coment"
}


let userAccessToken = "";

let createdPost: IPost;

let commentId: string;

beforeAll(async () => {
    console.log("Before all tests");

    app = await initApp();

    await Post.deleteMany({ title: "Dog Post Test" });

    await User.deleteMany({ email: user.email });

    const userRegisterResponse = await request(app).post("/auth/register").send(user);
    user._id = userRegisterResponse.body._id;
    const userLoginResponse = await request(app).post("/auth/login").send(user);
    userAccessToken = userLoginResponse.body.accessToken;

    const response = await request<IPost>(app)
    .post("/post")
    .set("Authorization", "JWT " + userAccessToken)
    .send(post);
    createdPost = response.body;


});

afterAll(async () => {
    console.log("After all tests");

    await User.deleteMany({ email: user.email });

    await Post.deleteMany({ title: "Dog Post Test" });
    await Post.deleteMany({ ownerId: user._id });

    await mongoose.connection.close();
});

describe("Post tests", () => {

    test("Test create comment", async () => {

        const response = await request<IPost>(app)
            .post(`/post/${createdPost._id}/comment`)
            .set("Authorization", "JWT " + userAccessToken)
            .send(comment);
        commentId = response.body._id;

        expect(response.statusCode).toBe(200);
        expect(response.body.text).toBe(comment.text);
    });

    test("Update sepecific comment", async () => {
        const newText = "comment changed"
        const response = await request(app)
            .put(`/post/${createdPost._id}/comment/${commentId}`)
            .set("Authorization", "JWT " + userAccessToken)
            .send({text: newText});
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toStrictEqual(newText);
    });

    test("Test delete user's comment", async () => {
        const response = await request(app)
            .delete(`/post/${createdPost._id}/comment/${commentId}`)
            .set("Authorization", "JWT " + userAccessToken);

        expect(response.statusCode).toBe(200);
    });
});
