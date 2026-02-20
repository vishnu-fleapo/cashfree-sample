import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import paymentRoutes from "./routes/payment.js";
import payoutRoutes from "./routes/payout.js";
import { verifyWebhookSignature } from "./middleware/webhook.js";;

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  verifyWebhookSignature,
  (req, res) => {
    console.log("Webhook Data:", req.webhookData);
    res.send("OK");
  }
);

app.use(express.json());

app.use("/api/payment", paymentRoutes);
app.use("/api/payout", payoutRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Cashfree Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);