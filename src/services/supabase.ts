import { supabase } from "@/utils";
import {
  AdminPayoutRequest,
  CashfreeBeneficiaries,
  CreateBeneficiaryInput,
  CreateServiceInput,
  CreatorPendingPayoutResponse,
  CreatorService,
  CreatorSubscription,
  CreatorSubscriptionCreateInput,
  CreatorSubscriptionResponse,
  Payment,
  Payout,
  PayoutTransferStatus,
  Service,
  Subscription,
  TCreateServiceInput,
  User,
} from "@/types";

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? ([] as User[]);
};

export const getServicesByCreator = async (
  creatorId: string,
): Promise<Service[]> => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("creator_id", creatorId);

  if (error) throw error;
  return data ?? ([] as Service[]);
};

export const getPaymentsByUser = async (userId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("id, order_id, amount, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Payment[]) ?? ([] as Payment[]);
};

export const findPaymentByOrderId = async (
  orderId: string,
): Promise<Payment | null> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data as Payment | null;
};

export const createPayment = async (payload: {
  order_id: string;
  user_id: string;
  amount: number;
  status: string;
  gateway_payment_id: string;
}): Promise<Payment> => {
  const { data, error } = await supabase
    .from("payments")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
};

export const subscriptionExists = async (
  userId: string,
  serviceId: string,
): Promise<boolean> => {
  const { data } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("service_id", serviceId)
    .single();

  return !!data as boolean;
};

export const createSubscription = async (payload: {
  user_id: string;
  service_id: string;
  payment_id: string;
}): Promise<Subscription> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
};

export const createService = async (payload: {
  title: string;
  description?: string;
  price: number;
  currency: string;
  creator_id: string;
}): Promise<Service> => {
  const { data, error } = await supabase
    .from("services")
    .insert(payload)
    .select()
    .single();

  console.log("Service created:", data);
  console.log("Error:", error);

  if (error) throw error;
  return data as Service;
};

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from("services").select("*");

  if (error) throw error;
  return data as Service[];
};

export const getServicesPerCreator = async (
  creatorId: string,
): Promise<Service[]> => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("creator_id", creatorId);

  if (error) throw error;

  return data as Service[];
};

export const getSubscriptionsPerCreator = async (
  creatorId: string,
): Promise<CreatorSubscriptionResponse[]> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      created_at,
      user_id,
      users!inner (
        id,
        name
      ),
      payments (
        id,
        amount,
        status
      ),
      payout_id,
      services!inner (
        id,
        title,
        price,
        currency,
        creator_id
      )
    `,
    )
    .eq("services.creator_id", creatorId);

  if (error) throw error;

  return data as any[];
};

export const getUserSubscriptions = async (userId: string) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      created_at,
      payments (
        id,
        amount,
        status,
        gateway_payment_id
      ),
      services (
        title,
        description
      )
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const getCreatorPendingPayoutAmount = async (
  creatorId: string,
): Promise<CreatorPendingPayoutResponse[]> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      payments!inner (
        amount,
        status
      ),
      services!inner (
        creator_id
      )
    `,
    )
    .eq("services.creator_id", creatorId)
    .is("payout_id", null)
    .eq("payments.status", "SUCCESS");

  if (error) throw error;

  console.log(data);

  return data as any;
};

export const createCreatorBeneficiary = async (
  input: CreateBeneficiaryInput,
) => {
  const { beneficiary_id, user_id } = input;
  const { data, error } = await supabase
    .from("cashfree_beneficiaries")
    .insert({
      beneficiary_id,
      user_id,
    })
    .select();

  if (error) throw error;

  return data[0] as CashfreeBeneficiaries;
};

export const createPayout = async (input: Payout): Promise<Payout> => {
  const { data, error } = await supabase.from("payouts").insert(input).select();

  if (error) throw error;

  return data[0] as Payout;
};

export const getLatestBeneficary = async (
  userId: string,
): Promise<CashfreeBeneficiaries> => {
  const { data, error } = await supabase
    .from("cashfree_beneficiaries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data[0] as CashfreeBeneficiaries;
};

export const getPayoutDetails = async (payoutId: string): Promise<Payout> => {
  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("id", payoutId);

  if (error) throw error;

  return data[0] as Payout;
};

export const updatePayout = async (input: Payout): Promise<Payout> => {
  const { data, error } = await supabase
    .from("payouts")
    .update(input)
    .eq("id", input.id)
    .select();

  if (error) throw error;

  return data[0] as Payout;
};

export const updateSubscriptions = async (input: {
  subscriptionIds: string[];
  payout_id: string;
}): Promise<void> => {
  const { subscriptionIds, payout_id } = input;

  if (!subscriptionIds.length) return;

  const { error } = await supabase
    .from("subscriptions")
    .update({ payout_id })
    .in("id", subscriptionIds);

  if (error) throw error;
};

export const getPayoutRequestsService = async (
  status?: PayoutTransferStatus,
): Promise<AdminPayoutRequest[]> => {
  let query = supabase
    .from("payouts")
    .select(
      `
      id,
      amount,
      status,
      created_at,
      approved_at,
      failure_reason,
      beneficiary_id,
      users (
        id,
        name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as any[];
};

export const createCreatorService = async (
  input: TCreateServiceInput,
): Promise<CreatorService> => {
  const { title, description, price, currency, duration } = input;
  const { data, error } = await supabase
    .from("creator_services")
    .insert({
      title,
      description,
      price,
      currency,
      duration,
    })
    .select();

  if (error) throw error;

  return data[0] as CreatorService;
};

export const getCreatorServices = async (): Promise<CreatorService[]> => {
  const { data, error } = await supabase.from("creator_services").select(`
    id,
    title,
    description,
    price,
    duration,
    currency,
    created_at,
    creator_subscriptions(count)
  `);

  if (error) throw error;

  return data.map((service: any) => ({
    ...service,
    subscriptionCount: service.creator_subscriptions?.[0]?.count || 0,
  }));
};

export const creatorSubscription = async (
  input: CreatorSubscriptionCreateInput,
): Promise<CreatorSubscription> => {
  const { service_id, payment_id, user_id, expires_at } = input;
  const { data, error } = await supabase
    .from("creator_subscriptions")
    .insert(<CreatorSubscription>{
      service_id,
      payment_id,
      user_id,
      expires_at,
    })
    .select();

  if (error) throw error;

  return data[0] as CreatorSubscription;
};

export const getCreatorServiceById = async (
  id: string,
): Promise<CreatorService> => {
  const { data, error } = await supabase
    .from("creator_services")
    .select(
      `
      id,
      title,
      description,
      price,
      duration,
      currency,
      created_at
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as CreatorService;
};

export const getCreatorSubscriptions = async (
  userId: string,
): Promise<CreatorSubscription[]> => {
  const { data, error } = await supabase
    .from("creator_subscriptions")
    .select(
      `
      id,
      service_id,
      payment_id,
      user_id,
      expires_at,
      created_at,
      creator_services (
        id,
        title,
        description,
        price,
        duration,
        currency,
        created_at
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as CreatorSubscription[];
};
