import { Router } from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import mainCantroller from "../controller/main.cantroller.js";


import multer from "multer";
const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)),'../..');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/file/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename for the uploaded file
    },
  });
const router = new Router()
const upload = multer({ storage: storage });

router.get("/chat_:id",mainCantroller.thechat)
router.get("/myfriends",mainCantroller.myfriends)
router.get("/rooms", mainCantroller.rooms)
// router.get("/shopimage",mainCantroller.shopimage)

router.post("/updatafile",upload.single('file'),mainCantroller.updatafile)
router.post("/search", mainCantroller.search)

export default router