import express from "express";
import {
  createCreatorSubscriptionOrder,
  createOrder,
  verifyOrder,
} from "@/controllers";
import { validateCreateOrder } from "@/middleware";

const router = express.Router();

router.post("/create-order", validateCreateOrder, createOrder);
router.post(
  "/creator-subscription",
  validateCreateOrder,
  createCreatorSubscriptionOrder,
);
router.get("/verify/:orderId", verifyOrder);

export default router;
