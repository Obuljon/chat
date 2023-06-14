import express from "express";
import session from "express-session";
import  mongoose from "mongoose";
import validator from "express-validator";
import flash from "express-flash";
import moment from "moment";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import sharedSession  from "express-socket.io-session"

import { initSocket } from './src/socket/socket.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/chat", { useNewUrlParser:true, useUnifiedTopology:true });
app.set('views', './src/views');
app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(validator()); 
 const sessionMiddleware = session({
    secret: "qwertyuiop",
    cookie: { maxAge: 1000 * 60 * 60 },
    saveUninitialized:true,
    resave:false,
})
app.use(sessionMiddleware);

app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.session.user || false;
    req.socket.session = req.session.user
    res.locals.message = req.flash();
    res.locals.moment = moment;
    next();
});

import mainpage from "./src/router/main.page.router.js";
import Registration from "./src/router/api.registration.router.js";
import mainrouter from "./src/router/main.router.js"
app.use("/api",Registration)
app.use("/api", mainrouter)
app.use(mainpage);

app.use((req, res)=>{
    res.status(404).sendFile(__dirname + '/public/404.html');
})
io.use(sharedSession(sessionMiddleware, {
    autoSave: true // Sessiya o'zgarganda avtomatik saqlab qolish
  }));
initSocket(httpServer);

httpServer.listen(app.get('port'), () => {
    console.info(`Server is running on PORT: ${app.get('port')}`);
});