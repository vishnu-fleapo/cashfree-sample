import express from "express";
import {
    createBeneficiary,
    createTransfer
} from "../controllers/payout.js";

import {
    validateBeneficiary,
    validateTransfer
} from "../middleware/validation.js";

const router = express.Router();

router.post("/beneficiary", validateBeneficiary, createBeneficiary);
router.post("/transfer", validateTransfer, createTransfer);

export default router;