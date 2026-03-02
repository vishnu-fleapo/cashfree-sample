export type CreateBeneficiaryBody = {
  customerId: string;
  name: string;
  bankAccount: string;
  ifsc: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export type CreateBeneficiaryV2Request = {
  beneficiary_id?: string;
  beneficiary_name: string;
  beneficiary_instrument_details: {
    bank_account_number?: string;
    bank_ifsc?: string;
    vpa?: string;
  };
  beneficiary_contact_details?: {
    beneficiary_email?: string;
    beneficiary_phone?: string;
    beneficiary_country_code?: string;
    beneficiary_address?: string;
    beneficiary_city?: string;
    beneficiary_state?: string;
    beneficiary_postal_code?: string;
  };
};

export type CreateBeneficiaryV2Response = {
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_instrument_details: {
    bank_account_number?: string;
    bank_ifsc?: string;
    vpa?: string;
  };
  beneficiary_contact_details?: {
    beneficiary_email?: string;
    beneficiary_phone?: string;
    beneficiary_country_code?: string;
    beneficiary_address?: string;
    beneficiary_city?: string;
    beneficiary_state?: string;
    beneficiary_postal_code?: string;
  };
  beneficiary_status: string;
  added_on: string;
};

export type CreateTransferBody = {
  payoutId: string;
};

export type CreateOrderBody = {
  orderAmount: number;
  customerId: string;
  customerPhone: string;
  serviceId?: string;
};

export enum EOrderType {
  USER_SUBSCRIPTION = "USER_SUBSCRIPTION",
  CREATOR_SUBSCRIPTION = "CREATOR_SUBSCRIPTION",
}

export type VerifyOrderParams = {
  orderId: string;
};

export type CreateOrderPayload = {
  order_id: string;
  order_amount: number;
  order_currency: "INR";
  customer_details: {
    customer_id: string;
    customer_phone: string;
  };
  order_tags?: {
    serviceId?: string;
    orderType?: EOrderType;
  };
};

export type CashfreeCustomerDetails = {
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone: string;
  customer_uid?: string;
};

export type CashfreeOrderTags = {
  serviceId?: string;
  orderType?: EOrderType;
  [key: string]: string | undefined;
};

export type CashfreeOrder = {
  cf_order_id: string;
  order_id: string;
  entity: "order";
  order_amount: number;
  order_currency: "INR";
  order_status: ECashfreeOrderStatus;
  payment_session_id: string;
  order_expiry_time: string;
  created_at: string;

  customer_details: CashfreeCustomerDetails;
  order_tags?: CashfreeOrderTags;
};

export enum ECashfreeOrderStatus {
  ACTIVE = "ACTIVE",
  PAID = "PAID",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export enum ECashfreePaymentStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
  NOT_ATTEMPTED = "NOT_ATTEMPTED",
  CANCELLED = "CANCELLED",
  FLAGGED = "FLAGGED",
  VOID = "VOID",
  USER_DROPPED = "USER_DROPPED",
}

export enum ECashfreePaymentGroup {
  UPI = "upi",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  NET_BANKING = "net_banking",
  WALLET = "wallet",
  CREDIT_CARD_EMI = "credit_card_emi",
  DEBIT_CARD_EMI = "debit_card_emi",
  CARDLESS_EMI = "cardless_emi",
  PAY_LATER = "pay_later",
}

interface ErrorDetails {
  error_code: string | null;
  error_description: string | null;
  error_reason: string | null;
  error_source: string | null;
  error_code_raw?: string | null;
  error_description_raw?: string | null;
  error_subcode_raw?: string | null;
}

interface PaymentMethod {
  card?: {
    channel: string | null;
    card_number: string;
    card_network: string | null;
    card_type: string;
    card_sub_type: string | null;
    card_country: string | null;
    card_bank_name: string;
    card_network_reference_id?: string;
    instrument_id?: string;
    par?: string;
  };
  upi?: {
    channel: string | null;
    upi_id: string;
  };
  netbanking?: {
    channel: string | null;
    netbanking_bank_code: string;
    netbanking_bank_name: string;
  };
  app?: {
    channel: string;
    upi_id: string | null;
  };
  cardless_emi?: {
    channel: string | null;
    provider: string;
    phone: string;
    emi_details: object | null;
  };
  pay_later?: {
    channel: string | null;
    provider: string;
    phone: string;
  };
}

export type PaymentResponse = {
  cf_payment_id: string;
  order_id: string;
  entity: string;
  payment_status: ECashfreePaymentStatus;
  payment_amount: number;
  payment_currency: string;
  payment_message: string;
  payment_time: string;
  bank_reference: string | null;
  auth_id: string | null;
  is_captured: boolean;
  order_amount: number;
  payment_group: ECashfreePaymentGroup;
  payment_method: PaymentMethod;
  error_details?: ErrorDetails;
};

export type GetPaymentsForOrderResponse = PaymentResponse[];

export enum BeneficiaryResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export enum BeneficiaryVerificationStatus {
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED",
}

export type BeneficiaryResponse = {
  status: BeneficiaryResponseStatus;
  subCode: string;
  message: string;
  data?: {
    beneId: string;
    name: string;
    groupName: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    pincode: string;
    bankAccount: string;
    ifsc: string;
    status: BeneficiaryVerificationStatus;
  };
};

export enum TransferMode {
  BANKTRANSFER = "banktransfer",
  NEFT = "neft",
  IMPS = "imps",
  RTGS = "rtgs",
  UPI = "upi",
  PAYTM = "paytm",
  AMAZONPAY = "amazonpay",
  PHONE = "phone",
}

export enum PayoutTransferStatus {
  WAITING_FOR_APPROVAL = "waiting_for_approval",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
  REJECTED = "REJECTED",
  ERROR = "ERROR",
}

export enum TransferResponseStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  ERROR = "ERROR",
}

export type TransferResponse = {
  status: TransferResponseStatus;
  subCode: string;
  message: string;
  data?: {
    referenceId: string;
    utr: string;
    acknowledged: number;
  };
};

export type GetTransferStatusResponse = {
  status: string;
  subCode: string;
  message: string;
  data?: {
    transfer: {
      transferId: string;
      bankAccount: string;
      ifsc: string;
      beneId: string;
      amount: string;
      status: PayoutTransferStatus;
      utr: string;
      addedOn: string;
      processedOn: string;
      transferMode: string;
      acknowledged: number;
      reason?: string;
    };
  };
};

export enum PaymentWebhookType {
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS_WEBHOOK",
  PAYMENT_USER_DROPPED = "PAYMENT_USER_DROPPED_WEBHOOK",
  PAYMENT_FAILED = "PAYMENT_FAILED_WEBHOOK",
}

export enum EPaymentStatusWebhook {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  USER_DROPPED = "USER_DROPPED",
}

export type PaymentWebhookPayload = {
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_tags?: Record<string, string> | null;
    };
    payment: {
      cf_payment_id: string;
      payment_status: EPaymentStatusWebhook;
      payment_amount: number;
      payment_currency: string;
      payment_message: string;
      payment_time: string;
      bank_reference: string | null;
      auth_id: string | null;
      payment_method: Record<string, any>;
      payment_group: string;
    };
    customer_details: {
      customer_name: string | null;
      customer_id: string;
      customer_email: string;
      customer_phone: string;
    };
    error_details?: {
      error_code: string | null;
      error_description: string | null;
      error_reason: string | null;
      error_source: string | null;
    };
  };
  event_time: string;
  type: PaymentWebhookType;
};

export enum PayoutTransferMode {
  IMPS = "IMPS",
  NEFT = "NEFT",
  RTGS = "RTGS",
  UPI = "UPI",
  BANK = "BANK",
}

export interface TransferBeneficiaryInstrumentDetails {
  bank_account_number?: string;
  ifsc?: string;
  vpa?: string;
}

export interface TransferBeneficiaryDetails {
  beneficiary_id: string;
  beneficiary_instrument_details: TransferBeneficiaryInstrumentDetails;
}

export interface StandardTransferV2Response {
  transfer_id: string;
  cf_transfer_id: string;
  status: PayoutTransferStatus;
  beneficiary_details: TransferBeneficiaryDetails;
  transfer_amount: number;
  transfer_service_charge: number;
  transfer_service_tax: number;
  transfer_mode: string;
  transfer_utr: string;
  fundsource_id: string;
  added_on: Date;
  updated_on: string;
}
export interface PayoutErrorResponse {
  type: string;
  code: string;
  message: string;
}

export interface TransferRequest {
  transfer_id: string;
  transfer_amount: number;
  transfer_currency?: string;
  transfer_mode: TransferMode;
  beneficiary_details: {
    beneficiary_id: string;
  };
  transfer_remarks?: string;
  fundsource_id?: string;
}
