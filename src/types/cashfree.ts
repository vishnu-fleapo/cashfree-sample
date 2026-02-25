import e from "express";

export type CreateBeneficiaryBody = {
  beneficiaryId: string;
  name: string;
  bankAccount: string;
  ifsc: string;
  vpa?: string;

  email?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export type CreateTransferBody = {
  beneficiaryId: string;
  amount: number;
};

export type CreateOrderBody = {
  orderAmount: number;
  customerId: string;
  customerPhone: string;
  serviceId?: string;
};

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
  };
};

export type CashfreeResponse<T = unknown> = {
  data: T;
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
  CANCELLED = "CANCELLED",
}

export enum ECashfreePaymentGroup {
  UPI = "upi",
  CARD = "card",
  NETBANKING = "netbanking",
  WALLET = "wallet",
  PAYLATER = "paylater",
}

export type CashfreePaymentVerify = {
  cf_payment_id: string;
  order_id: string;
  entity: "payment";

  payment_status: ECashfreePaymentStatus;
  payment_amount: number;
  payment_currency: "INR";
  payment_group: ECashfreePaymentGroup;

  is_captured: boolean;
  payment_time: string;
  payment_completion_time?: string;

  bank_reference?: string;
  auth_id?: string;
  payment_message?: string;

  customer_details?: {
    customer_id: string;
  };

  order_tags?: {
    serviceId?: string;
  };
};
