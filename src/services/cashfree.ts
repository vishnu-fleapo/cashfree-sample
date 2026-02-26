import { cashfreePGInstance, cashfreePayoutInstance } from "@/utils";
import { AxiosResponse } from "axios";
import {
  CreateOrderPayload,
  CashfreeResponse,
  GetPaymentsForOrderResponse,
  CashfreeOrder,
  CreateBeneficiaryV2Request,
  CreateBeneficiaryV2Response,
  StandardTransferV2Response,
  TransferRequest,
} from "@/types";

export const createOrderService = (
  data: CreateOrderPayload,
): Promise<AxiosResponse<CashfreeResponse>> =>
  cashfreePGInstance.post("/pg/orders", data);

export const verifyOrderService = (
  orderId: string,
): Promise<AxiosResponse<GetPaymentsForOrderResponse>> =>
  cashfreePGInstance.get(`/pg/orders/${orderId}/payments`);

export const getOrderService = (
  orderId: string,
): Promise<AxiosResponse<CashfreeOrder>> =>
  cashfreePGInstance.get(`/pg/orders/${orderId}`);

export const createBeneficiaryService = (
  data: CreateBeneficiaryV2Request,
): Promise<AxiosResponse<CreateBeneficiaryV2Response>> =>
  cashfreePayoutInstance.post("/payout/beneficiary", data);

export const createTransferService = (
  data: TransferRequest,
): Promise<AxiosResponse<StandardTransferV2Response>> =>
  cashfreePayoutInstance.post("/payout/transfers", data);
