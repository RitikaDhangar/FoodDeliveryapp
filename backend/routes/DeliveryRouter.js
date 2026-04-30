
import express from "express";
import { DeliveryOrder } from "../controller/DeliveryController.js";

const router = express.Router();

router.get("/deliveryorder", DeliveryOrder);

export default router;