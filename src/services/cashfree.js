import {
    cashfreePGInstance,
    cashfreePayoutInstance
} from "../utils/axios-instance.js";

export const createOrderService = async (data) =>
    cashfreePGInstance.post("/orders", data);

export const verifyOrderService = async (orderId) =>
    cashfreePGInstance.get(`/orders/${orderId}`);

export const createBeneficiaryService = async (data) =>
    cashfreePayoutInstance.post("/beneficiary", data);

export const createTransferService = async (data) =>
    cashfreePayoutInstance.post("/transfers", data);