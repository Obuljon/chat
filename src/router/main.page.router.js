import { Router } from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import Registration from "../controller/api.registration.cantroller.js"

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)),'../..');

const router = new Router()

router.get("/", Registration.isAuth, (req, res) => {
    res.render('index', {tetle:"home page"})
})
router.get("/signup", (req, res) => {
    res.sendFile(__dirname + '/public/sign-up.html')
})
router.get("/signin", (req, res) => {
    res.sendFile(__dirname + '/public/sign-in.html')
})
router.get("/logout",(req, res) => {
        delete req.session.user;
        res.redirect("/");
});

export default router


