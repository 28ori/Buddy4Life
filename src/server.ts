import initApp from "./app";
import https from "https";
import http from "http";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

initApp().then((app) => {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Buddy4Life",
                version: "1.0.0",
                description: "Buddy4Life REST API server including authentication using JWT and refresh token",
            },
            servers: [{ url: "http://localhost:9000" }],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs, { customSiteTitle: "Buddy4Life" }));

    if (process.env.NODE_ENV !== "production") {
        console.log("development");
        http.createServer(app).listen(process.env.PORT);
    } else {
        console.log("PRODUCTION");
        const options2 = {
            key: fs.readFileSync("./client-key.pem"),
            cert: fs.readFileSync("./client-cert.pem")
          };
          https.createServer(options2, app).listen(process.env.HTTPS_PORT);
    }
});
