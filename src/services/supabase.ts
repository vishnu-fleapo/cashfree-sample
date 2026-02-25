import { supabase } from "@/utils";
import { Payment, Service, Subscription, User } from "@/types";

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

export const getUserSubscriptions = async (
  userId: string,
): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data as Subscription[]) ?? ([] as Subscription[]);
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
  service_id: string;
  amount: number;
  status: string;
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
  console.log("Creating service with payload:", payload);
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
): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      payments (*),
      services (*)
    `,
    )
    .eq("services.creator_id", creatorId);

  if (error) throw error;

  return data as Subscription[];
};

// export const seedUsersAndCreators = async () => {
//   const users = [
//     {
//       name: "User Three",
//       email: "user3@example.com",
//       role: "user",
//     },
//     {
//       name: "User Four",
//       email: "user4@example.com",
//       role: "user",
//     },
//     {
//       name: "Creator Three",
//       email: "creator3@example.com",
//       role: "creator",
//     },
//     {
//       name: "Creator Four",
//       email: "creator4@example.com",
//       role: "creator",
//     },
//   ];

//   const { error: userError, data: userData } = await supabase
//     .from("users")
//     .upsert(users, { onConflict: "id" })
//     .select();

//   if (userError) throw userError;

//   return userData;
// };

// seedUsersAndCreators()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
