import { Router } from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import Registration from "../controller/api.registration.cantroller.js"
const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)),'../..');

const router = new Router()

router.post("/signup",Registration.signup);
router.post("/signin",Registration.signin);



export default router