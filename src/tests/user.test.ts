import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import User, { IUser } from "../models/user_model";

let app: Express;

const user: IUser = {
    email: "testUser@test.com",
    firstName: "Ben",
    lastName: "Cohen",
    password: "1234567890",
};

let userAccessToken = "";

beforeAll(async () => {
    console.log("Before all tests");
    app = await initApp();
    await User.deleteMany({ email: user.email });

    const userRegisterResponse = await request(app).post("/auth/register").send(user);
    user._id = userRegisterResponse.body._id;
    const userLoginResponse = await request(app).post("/auth/login").send(user);
    userAccessToken = userLoginResponse.body.accessToken;
});

afterAll(async () => {
    console.log("After all tests");
    await User.deleteMany({ email: user.email });
    await mongoose.connection.close();
});

describe("User tests", () => {
    test("Test get user details", async () => {
        const response = await request(app)
            .get(`/user/${user._id}`)
            .set("Authorization", "JWT " + userAccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.firstName).toBe(user.firstName);
        expect(response.body.lastName).toBe(user.lastName);
    });

    test("Test delete user", async () => {
        const response = await request(app)
            .delete(`/post/${user._id}`)
            .set("Authorization", "JWT " + userAccessToken);

        expect(response.statusCode).toBe(200);
    });
});
