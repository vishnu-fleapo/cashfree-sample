export type CreateServiceInput = {
  userId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
};

export type GetUserSubscriptionsResponse = {
  id: string;
  created_at: Date;
  payments: {
    id: string;
    paymentId: string;
    amount: string;
    status: string;
    gateway_payment_id: string;
  };
  services: {
    title: string;
    description?: string;
  };
};
