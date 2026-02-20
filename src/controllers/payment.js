import { createOrderService, verifyOrderService } from "../services/cashfree.js";

export const createOrder = async (req, res) => {
    try {
        const orderId = "order_" + Date.now();

        const response = await createOrderService({
            order_id: orderId,
            order_amount: req.body.orderAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: req.body.customerId,
                customer_phone: req.body.customerPhone,
            },
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Order creation failed" });
    }
};

export const verifyOrder = async (req, res) => {
    try {
        const response = await verifyOrderService(req.params.orderId);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Verification failed" });
    }
};
