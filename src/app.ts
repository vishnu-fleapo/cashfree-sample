import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { paymentRoutes, payoutRoutes, servicesRoutes } from "./routes";
import { verifyWebhookSignature } from "@/middleware/webhook";

config();
const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  verifyWebhookSignature,
  (_req, res) => {
    res.send("OK");
  },
);

app.use(express.json());

app.use("/api/payment", paymentRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/services", servicesRoutes);

app.get("/", (_req, res) => {
  res.send("🚀 Cashfree Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
