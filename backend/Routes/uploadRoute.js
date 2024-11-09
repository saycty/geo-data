import express from "express";
import {uploadHandler, getUploads, getContent,fileCreate} from '../controllers/fileUpload.js'
import authMiddleware from "../middleware/auth.js";
import multer from 'multer';
const upload = multer({ dest: 'temp-uploads/' });

const uploadRoute = express.Router();

uploadRoute.post("/", authMiddleware, upload.single("file"), uploadHandler); // upload file
uploadRoute.get("/", express.json(), authMiddleware, getUploads); // get all uploads
uploadRoute.get("/:fileId", express.json(),authMiddleware, getContent); // get content of a file
uploadRoute.post("/create", express.json(), authMiddleware, fileCreate); // create a file

export default uploadRoute;
