import { Request, Response } from "express";
import {
  createOrderService,
  createPayment,
  findPaymentByOrderId,
  verifyOrderService,
  getOrderService,
  creatorSubscription,
  getCreatorServiceById,
} from "@/services";
import {
  CreateOrderBody,
  VerifyOrderParams,
  ECashfreePaymentStatus,
  EOrderType,
  CreatorSubscription,
  Subscription,
} from "@/types";
import { generateUUID } from "@/utils";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
): Promise<Response> => {
  try {
    const { orderAmount, customerId, customerPhone, serviceId } = req.body;

    const orderId = generateUUID("ORD");

    const response = await createOrderService({
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
      order_tags: {
        serviceId,
        orderType: EOrderType.USER_SUBSCRIPTION,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Order creation failed" });
  }
};

export const createCreatorSubscriptionOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
): Promise<Response> => {
  try {
    const { orderAmount, customerId, customerPhone, serviceId } = req.body;

    const orderId = generateUUID("ORD");

    const response = await createOrderService({
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
      order_tags: {
        serviceId,
        orderType: EOrderType.CREATOR_SUBSCRIPTION,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Order creation failed" });
  }
};

export const verifyOrder = async (
  req: Request<VerifyOrderParams>,
  res: Response,
): Promise<Response> => {
  try {
    const { orderId } = req.params;

    const { data } = await verifyOrderService(orderId);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "No payments found" });
    }

    const paymentData = data[0];

    const { data: orderData } = await getOrderService(orderId);
    if (
      paymentData.payment_status !== ECashfreePaymentStatus.SUCCESS ||
      !paymentData.is_captured
    ) {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const { payment_amount, payment_status, order_id, cf_payment_id } =
      paymentData;
    const { customer_details, order_tags } = orderData;

    const userId = customer_details!.customer_id!;
    const serviceId = order_tags!.serviceId!;
    const orderType = order_tags!.orderType!;

    if (!serviceId) {
      return res.status(400).json({ error: "Missing service" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Missing user" });
    }

    const existingPayment = await findPaymentByOrderId(orderId);

    if (existingPayment) {
      return res.json({ message: "Payment already processed" });
    }

    const payment = await createPayment({
      order_id,
      user_id: userId,
      gateway_payment_id: cf_payment_id,
      amount: payment_amount,
      status: payment_status,
    });

    const subscription = await handleSubscription({
      orderType,
      userId,
      serviceId,
      paymentId: payment.id,
    });

    return res.json({
      success: true,
      payment,
      subscription,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Verification failed" });
  }
};

const handleSubscription = async (input: {
  orderType: EOrderType;
  userId: string;
  serviceId: string;
  paymentId: string;
}) => {
  const { orderType, userId, serviceId, paymentId } = input;

  switch (orderType) {
    case EOrderType.USER_SUBSCRIPTION:
      return createSubscription({
        user_id: userId,
        service_id: serviceId,
        payment_id: paymentId,
      });
    case EOrderType.CREATOR_SUBSCRIPTION:
      return createCreatorSubscription({
        creator_id: userId,
        service_id: serviceId,
        payment_id: paymentId,
      });
    default:
      return null;
  }
};

const createSubscription = async (input: {
  user_id: string;
  service_id: string;
  payment_id: string;
}): Promise<Subscription> => {
  try {
    const { user_id, service_id, payment_id } = input;
    const subscription = await createSubscription({
      user_id,
      service_id,
      payment_id,
    });

    return subscription;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createCreatorSubscription = async (input: {
  creator_id: string;
  service_id: string;
  payment_id: string;
}): Promise<CreatorSubscription> => {
  try {
    const { creator_id, service_id, payment_id } = input;

    const service = await getCreatorServiceById(service_id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + service.duration);

    const subscription = await creatorSubscription({
      user_id: creator_id,
      service_id,
      payment_id,
      expires_at: expiresAt.toISOString(),
    });

    return subscription;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
