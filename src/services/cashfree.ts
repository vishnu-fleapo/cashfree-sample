import { cashfreePGInstance, cashfreePayoutInstance } from "@/utils";
import { AxiosResponse } from "axios";
import {
  CreateOrderPayload,
  CashfreeResponse,
  CashfreePaymentVerify,
} from "@/types";

export const createOrderService = (
  data: CreateOrderPayload,
): Promise<AxiosResponse<CashfreeResponse>> =>
  cashfreePGInstance.post("/orders", data);

export const verifyOrderService = (
  orderId: string,
): Promise<AxiosResponse<CashfreePaymentVerify>> =>
  cashfreePGInstance.get(`/orders/${orderId}`);

export const createBeneficiaryService = (
  data: unknown,
): Promise<AxiosResponse<CashfreeResponse>> =>
  cashfreePayoutInstance.post("/beneficiary", data);

export const createTransferService = (
  data: unknown,
): Promise<AxiosResponse<CashfreeResponse>> =>
  cashfreePayoutInstance.post("/transfers", data);
