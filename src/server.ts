import initApp from "./app";
// import https from 'https';
import http from 'http';

initApp().then((app) => {

http.createServer(app).listen(process.env.PORT);
});