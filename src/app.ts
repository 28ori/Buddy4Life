import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userPostsRoute from "./routes/user_post_route";
import userRoute from "./routes/user_route";
import authRoute from "./routes/auth_route";
import dogRoute from "./routes/dog_api_route"

//for-DEV
// import cors from "cors";
// const allowedOrigins = ['http://localhost:5173'];

// const options: cors.CorsOptions = {
//   origin: allowedOrigins
// };


const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {

    
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
  //for-dev
    // app.use(cors(options));
  //   app.use(function(req, res, next) {
  //     res.setHeader('Access-Control-Allow-Origin', '*');
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  //     res.setHeader('Access-Control-Allow-Credentials', 'true');
  //     next();
  // });
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/post", userPostsRoute);
      app.use("/auth", authRoute);
      app.use("/user", userRoute);
      app.use("/dog", dogRoute);

      resolve(app);
    });
  });
    console.log("initApp ending")
  return promise;
};

export default initApp;