import { CreateServiceInput } from "@/types";
import { Request, Response, NextFunction } from "express";

export const validateCreateOrder = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { orderAmount, customerId, customerPhone } = req.body as {
    orderAmount: number;
    customerId: string;
    customerPhone: string;
  };

  if (!orderAmount || !customerId || !customerPhone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (orderAmount <= 0) {
    return res.status(400).json({ error: "Invalid order amount" });
  }

  next();
};

export const validateBeneficiary = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { beneficiaryId, name, bankAccount, ifsc } = req.body as {
    beneficiaryId: string;
    name: string;
    bankAccount: string;
    ifsc: string;
  };

  if (!beneficiaryId || !name || !bankAccount || !ifsc) {
    return res.status(400).json({ error: "Missing beneficiary details" });
  }

  next();
};

export const validateTransfer = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { beneficiaryId, amount } = req.body as {
    beneficiaryId: string;
    amount: number;
  };

  if (!beneficiaryId || !amount) {
    return res.status(400).json({ error: "Missing transfer details" });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: "Invalid transfer amount" });
  }

  next();
};

export const validateCreateService = (
  req: Request<{}, {}, CreateServiceInput>,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { price, title, userId } = req.body;

  if (!title || !price || !userId) {
    return res.status(400).json({ error: "Missing service details" });
  }

  if (price <= 0) {
    return res.status(400).json({ error: "Invalid service price" });
  }

  next();
};
