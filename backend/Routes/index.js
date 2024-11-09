import express from "express";
const indexRoute = express.Router();

import userRoute from "./userRoute.js";
import uploadRoute from "./uploadRoute.js";

indexRoute.use("/users", express.json(),userRoute);
indexRoute.use("/upload", uploadRoute);

export default indexRoute;