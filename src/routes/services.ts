import express from "express";
import {
  createServiceController,
  getCreatorServicesController,
  getServicesController,
  getSubscriptionsController,
  getUserSubscriptionsController,
} from "@/controllers";
import { validateCreateService } from "@/middleware";

const router = express.Router();

router
  .route("")
  .post(validateCreateService, createServiceController)
  .get(getServicesController);
router.route("/creator").get(getCreatorServicesController);
router.route("/subscriptions").get(getSubscriptionsController);
router.route("/user").get(getUserSubscriptionsController);

export default router;
