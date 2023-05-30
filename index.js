import express from "express";
import session from "express-session";
import  mongoose from "mongoose";
import validator from "express-validator";
import flash from "express-flash";
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/chat", { useNewUrlParser:true, useUnifiedTopology:true });
app.set("port", 3000);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(validator());
app.use(session({
    secret: "qwertyuiop",
    cookie: { maxAge: 1000 * 1800 * 60 },
    saveUninitialized:false,
    resave:false,
}));
app.use(flash());
import mainpage from "./src/router/main.page.router.js";

app.use(mainpage);

app.use((req, res)=>{
    res.status(404).sendFile(__dirname + '/public/404.html');
})

app.listen(app.get('port'), () => {
    console.info(`Server is running on PORT: ${app.get('port')}`);
});