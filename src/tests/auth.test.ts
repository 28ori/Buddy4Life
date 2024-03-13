import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import User from "../models/user_model";

let app: Express;

const user = {
    email: "testUser@test.com",
    firstName: "Ben",
    lastName: "Cohen",
    password: "1234567890",
};

beforeAll(async () => {
    console.log("Before all tests");
    app = await initApp();
    await User.deleteMany({ email: user.email });
});

afterAll(async () => {
    console.log("After all tests");
    await User.deleteMany({ email: user.email });
    await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe("Auth tests", () => {
    test("Test Register", async () => {
        const response = await request(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(201);
    });

    test("Test Register exist email", async () => {
        const response = await request(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(406);
    });

    test("Test Register missing password", async () => {
        const response = await request(app).post("/auth/register").send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(422);
    });

    test("Test Login", async () => {
        const response = await request(app).post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);

        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
    });

    test("Test forbidden access without token", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(401);
    });

    test("Test access with valid token", async () => {
        const response = await request(app)
            .get("/post")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    });

    test("Test access with invalid token", async () => {
        const response = await request(app)
            .get("/post")
            .set("Authorization", "JWT 12345" + accessToken);
        expect(response.statusCode).toBe(401);
    });

    test("Test refresh token", async () => {
        const response = await request(app)
            .get("/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`)
            .send();
        expect(response.statusCode).toBe(200);

        const newAccessToken = response.body.accessToken;
        newRefreshToken = response.body.refreshToken;
        expect(newAccessToken).toBeDefined();
        expect(newRefreshToken).toBeDefined();

        const response2 = await request(app)
            .get("/post")
            .set("Authorization", "JWT " + newAccessToken);
        expect(response2.statusCode).toBe(200);
    });

    test("Test Logout", async () => {
        const response = await request(app)
            .get("/auth/logout")
            .set("Cookie", `refreshToken=${newRefreshToken}`)
            .send();
        expect(response.statusCode).toBe(204);
    });
});
