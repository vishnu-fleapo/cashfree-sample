import { Request, Response } from "express";
import {
  createOrderService,
  createPayment,
  createSubscription,
  findPaymentByOrderId,
  verifyOrderService,
} from "@/services";
import { CreateOrderBody, VerifyOrderParams } from "@/types";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
): Promise<Response> => {
  try {
    const { orderAmount, customerId, customerPhone, serviceId } = req.body;

    const orderId = `order_${Date.now()}`;

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

    if (data.payment_status !== "SUCCESS" || !data.is_captured) {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const { payment_amount, payment_status, order_id, customer_details } = data;

    const userId = customer_details!.customer_id!;
    const serviceId = data.order_tags!.serviceId!;
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
      service_id: serviceId,
      amount: payment_amount,
      status: payment_status,
    });

    const subscription = await createSubscription({
      user_id: userId,
      service_id: serviceId,
      payment_id: payment.id,
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
