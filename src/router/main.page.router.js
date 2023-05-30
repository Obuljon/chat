import { Router } from "express";
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)),'../..');

const router = new Router()

router.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
router.get("/signup", (req, res) => {
    res.sendFile(__dirname + '/public/sign-up.html')
})
router.get("/signin", (req, res) => {
    res.sendFile(__dirname + '/public/sign-in.html')
})

export default router


