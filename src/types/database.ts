import services from "@/routes/services";
import { ECashfreePaymentStatus, PayoutTransferStatus } from "./cashfree";

export type UserRole = "creator" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type Service = {
  id: string;
  title: string;
  price: number;
  description?: string;
  currency: string;
  creator_id: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  service_id: string;
  user_id: string;
  created_at: string;
};

export type Payment = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  status: ECashfreePaymentStatus;
  created_at: string;
};

export type Beneficiary = {
  id: string;
  beneficiary_id: string;
  user_id: string;
  created_at: string;
};

export interface PaymentDB {
  id: string;
  order_id: string;
  cf_payment_id: string;
  user_id: string;
  service_id: string;
  amount: number;
  status: ECashfreePaymentStatus;
  payment_method?: string;
  bank_reference?: string;
  created_at: string;
}

export interface SubscriptionDB {
  id: string;
  user_id: string;
  service_id: string;
  payment_id: string;
  payout_id?: string | null;
  created_at: string;
}

export interface CreateBeneficiaryInput {
  beneficiary_id: string;
  user_id: string;
}

export interface CashfreeBeneficiaries {
  id: string;
  beneficiary_id: string;
  user_id: string;
  created_at: string;
}

export interface Payout {
  id: string;
  beneficiary_id: string;
  amount: number;
  user_id: string;
  approved_at: Date;
  status: PayoutTransferStatus;
  failure_reason: string;
  reference_id: string;
  created_at: Date;
  updated_at: Date;
}

export type CreatorPendingPayoutResponse = {
  id: string;
  payments: {
    amount: number;
    status: ECashfreePaymentStatus;
  };
  services: {
    creator_id: string;
  };
};

export interface CreatorSubscription {
  id: string;
  created_at: string;
  user: {
    name: string;
    id: string;
  };
  payments: {
    id: string;
    amount: number;
    status: string;
  } | null;

  services: {
    id: string;
    title: string;
    price: number;
    currency: string;
  };
}

export interface AdminPayoutRequest {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  approved_at: string | null;
  failure_reason: string | null;
  beneficiary_id: string;

  users: {
    id: string;
    name: string;
  } | null;
}
