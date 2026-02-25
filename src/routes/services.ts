import express from "express";
import {
  createServiceController,
  getCreatorServicesController,
  getServicesController,
  getSubscriptionsController,
} from "@/controllers";
import { validateCreateService } from "@/middleware";

const router = express.Router();

router
  .route("")
  .post(validateCreateService, createServiceController)
  .get(getServicesController);
router.route("/creator").get(getCreatorServicesController);
router.route("/subscriptions").get(getSubscriptionsController);

export default router;
