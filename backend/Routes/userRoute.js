// userRoutes.js
import express from "express";
import { registeruser, loginuser, finduser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRoute = express.Router();

userRoute.post("/register", registeruser);
userRoute.post("/login", loginuser);
userRoute.get("/", authMiddleware, finduser);

export default userRoute;
