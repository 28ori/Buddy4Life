import env from "dotenv";
env.config();
import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoute from "./routes/post_route";
import userRoute from "./routes/user_route";
import authRoute from "./routes/auth_route";

const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose.connect(url!).then(() => {
            const app = express();

            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "*");
                res.header("Access-Control-Allow-Headers", "*");
                next();
            });

            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));

            app.use("/post", postRoute);
            app.use("/auth", authRoute);
            app.use("/user", userRoute);

            resolve(app);
        });
    });
    return promise;
};

export default initApp;
