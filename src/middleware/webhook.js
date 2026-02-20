import crypto from "crypto";

export const verifyWebhookSignature = (req, res, next) => {
    try {
        const signature = req.headers["x-webhook-signature"];
        const timestamp = req.headers["x-webhook-timestamp"];
        const body = req.body.toString();

        const signedPayload = timestamp + body;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
            .update(signedPayload)
            .digest("base64");

        if (signature !== expectedSignature) {
            return res.status(400).send("Invalid signature");
        }

        req.webhookData = JSON.parse(body);
        next();

    } catch (error) {
        res.status(500).send("Webhook verification failed");
    }
};