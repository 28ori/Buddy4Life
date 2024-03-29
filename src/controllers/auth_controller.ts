import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { OAuth2Client } from "google-auth-library";

export const getEncryptedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const getAccessToken = (req: Request) => {
    const authHeader = req.headers["authorization"];
    return authHeader && authHeader.split(" ")[1]; // Bearer <token>
};

export const getRefreshToken = (req: Request) => {
    return req.cookies.refreshToken;
};

const client = new OAuth2Client();

const googleSignin = async (req: Request, res: Response) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email;

        if (email != null) {
            let user = await User.findOne({ email: email });
            if (user == null) {
                user = await User.create({
                    email: email,
                    firstName: payload?.given_name,
                    lastName: payload?.family_name,
                    imageUrl: payload?.picture,
                    password: "googleAuthNoPassword",
                });
            }

            const tokens = await generateTokens(user);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                path: "/",
            });

            res.status(200).send({
                email: user.email,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                ...tokens,
            });
        }
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
};
const generateTokens = async (user: Document & IUser) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    } else {
        user.refreshTokens.push(refreshToken);
    }

    await user.save();
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};

const register = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user != null)
            return res.status(406).send({ message: `Email '${req.body.email}' is already in use.` });

        req.body.password = await getEncryptedPassword(req.body.password);
        const createdUser = await User.create(req.body);
        await generateTokens(createdUser);

        // Prepare response
        const toObjectOptions = {
            transform: function (doc: Document, record: Record<string, unknown>) {
                // Exclude specified fields
                delete record.password;
                delete record.createdAt;
                delete record.updatedAt;
                return record;
            },
        };

        return res.status(201).send(createdUser.toObject(toObjectOptions));
    } catch (err) {
        return res.status(400).send({ message: "Error missing email or password." });
    }
};

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) return res.status(400).send("missing email or password");

    try {
        // Check if there is a user in the DB with the given email
        const user = await User.findOne({ email: email });
        if (user == null) return res.status(401).send({ message: "Email or password incorrect." });

        // Check if the given password is correct
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send({ message: "Email or password incorrect." });

        const tokens = await generateTokens(user);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            path: "/",
        });

        return res.status(200).send(tokens);
    } catch (err) {
        return res.status(400).send("Login proccess failed.");
    }
};

const logout = async (req: Request, res: Response) => {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) return res.sendStatus(204);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { _id: string }) => {
        if (err) {
            res.clearCookie("refreshToken", { httpOnly: true, path: "/" });
            return res.sendStatus(204);
        }

        try {
            const userDb = await User.findOne({ _id: user._id });

            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                res.clearCookie("refreshToken", { httpOnly: true, path: "/" });
                return res.sendStatus(204);
            }

            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            await userDb.save();

            res.clearCookie("refreshToken", { httpOnly: true, path: "/" });
            return res.sendStatus(204);
        } catch (err) {
            res.status(401).send(err.message);
        }
    });
};

const refresh = async (req: Request, res: Response) => {
    const refreshToken = getRefreshToken(req);

    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { _id: string }) => {
        if (err) return res.sendStatus(401);

        try {
            const userDb = await User.findOne({ _id: user._id });

            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }

            // create new access token and refresh token
            const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
            });
            const newRefreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
            });
            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                path: "/",
            });

            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            });
        } catch (err) {
            res.status(401).send(err.message);
        }
    });
};

export default {
    register,
    login,
    logout,
    refresh,
    googleSignin,
};
