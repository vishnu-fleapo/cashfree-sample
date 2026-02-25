import express from "express";
import { createOrder, verifyOrder } from "@/controllers";
import { validateCreateOrder } from "@/middleware";

const router = express.Router();

router.post("/create-order", validateCreateOrder, createOrder);
router.get("/verify/:orderId", verifyOrder);

export default router;
