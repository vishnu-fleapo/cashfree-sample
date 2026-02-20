import express from "express";
import { createOrder, verifyOrder } from "../controllers/payment.js";
import { validateCreateOrder } from "../middleware/validation.js";

const router = express.Router();

router.post("/create-order", validateCreateOrder, createOrder);
router.get("/verify/:orderId", verifyOrder);

export default router;