import express from "express";
const router = express.Router();
import { createUser, loginUser } from "../controller/userRegister.js";
router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
export default router;