import express from "express";
import { verifyToken } from "../middleware/jwtverify.js";
const router = express.Router();
import { createOrder,verifyPayment } from "../controller/Orders.js";
router.use(verifyToken)
router.post("/createOrder", createOrder);
router.post("/verifyPayment", verifyPayment);
export default router