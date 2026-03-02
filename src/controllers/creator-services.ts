import { Request, Response } from "express";
import { TCreateServiceInput } from "@/types";
import {
  createCreatorService,
  getCreatorServices,
  getCreatorSubscriptions,
} from "@/services";

export const createService = async (
  req: Request<{}, {}, TCreateServiceInput>,
  res: Response,
) => {
  const { title, description, price, currency, duration } = req.body;

  const service = await createCreatorService({
    title,
    description,
    price,
    currency,
    duration,
  });

  return res.json(service);
};

export const getServices = async (_req: Request, res: Response) => {
  const services = await getCreatorServices();
  return res.json(services);
};

export const getCreatorSubscriptionsController = async (
  _req: Request<{}, {}, {}, { userId: string }>,
  res: Response,
) => {
  const { userId } = _req.query;
  const response = await getCreatorSubscriptions(userId);

  return res.json(response);
};
