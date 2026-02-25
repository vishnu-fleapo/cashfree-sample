import express from "express";
import { createBeneficiary, createTransfer } from "@/controllers";
import { validateBeneficiary, validateTransfer } from "@/middleware";

const router = express.Router();

router.post("/beneficiary", validateBeneficiary, createBeneficiary);
router.post("/transfer", validateTransfer, createTransfer);

export default router;
