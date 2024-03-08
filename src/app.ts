import env from "dotenv";
env.config();
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoute from "./routes/post_route";
import userRoute from "./routes/user_route";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";

const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose.connect(url!).then(() => {
            const app = express();
            const corsOptions = {
                origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
                credentials: true,
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
                allowedHeaders: "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
            };
            app.use(cors(corsOptions))
            app.use(cookieParser());
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));

            app.use("/post", postRoute);
            app.use("/auth", authRoute);
            app.use("/user", userRoute);
            app.use("/file", fileRoute);
            app.use("/public", express.static("public"));

            resolve(app);
        });
    });
    return promise;
};

export default initApp;
