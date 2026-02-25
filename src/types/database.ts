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
  status: string;
  created_at: string;
};

export type Beneficiary = {
  id: string;
  beneficiary_id: string;
  user_id: string;
  created_at: string;
};

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface PaymentDB {
  id: string;
  order_id: string;
  cf_payment_id: string;
  user_id: string;
  service_id: string;
  amount: number;
  status: PaymentStatus;
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
