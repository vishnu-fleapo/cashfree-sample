import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const cashfreePGInstance = axios.create({
  baseURL: process.env.CASHFREE_BASE_URL,
  headers: {
    "x-api-version": "2022-09-01",
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "Content-Type": "application/json"
  }
});

export const cashfreePayoutInstance = axios.create({
  baseURL: "https://sandbox.cashfree.com/payout",
  headers: {
    "x-api-version": "2024-01-01",
    "x-client-id": process.env.CASHFREE_PAYOUT_ID,
    "x-client-secret": process.env.CASHFREE_PAYOUT_SECRET,
    "Content-Type": "application/json"
  }
});