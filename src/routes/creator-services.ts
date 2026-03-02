import { Router } from "express";
import {
  createService,
  getServices,
  getCreatorSubscriptionsController,
} from "@/controllers";

const router = Router();

router.route("/").post(createService).get(getServices);
router.route("/subscriptions").get(getCreatorSubscriptionsController);

export default router;
