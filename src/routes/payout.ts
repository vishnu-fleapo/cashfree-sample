import express from "express";
import {
  createBeneficiary,
  createTransfer,
  getPayoutRequests,
  requestPayout,
} from "@/controllers";
import { validateBeneficiary } from "@/middleware";

const router = express.Router();

router.post("/beneficiary", validateBeneficiary, createBeneficiary);
router.post("/approve/:id", createTransfer);
router.post("/request/:id", requestPayout);
router.get("/requests", getPayoutRequests);

export default router;
