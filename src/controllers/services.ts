import { Request, Response } from "express";
import {
  createService,
  getServices,
  getServicesPerCreator,
  getSubscriptionsPerCreator,
  getUserSubscriptions,
} from "@/services";
import { CreateServiceInput } from "@/types";

export const createServiceController = async (
  req: Request<{}, {}, CreateServiceInput>,
  res: Response,
) => {
  try {
    const { userId, ...body } = req.body;
    const service = await createService({
      creator_id: userId,
      ...body,
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create service" });
  }
};

export const getServicesController = async (_req: Request, res: Response) => {
  try {
    const services = await getServices();
    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get services" });
  }
};

export const getSubscriptionsController = async (
  _req: Request<{}, {}, {}, { userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = _req.query;
    const subscriptions = await getSubscriptionsPerCreator(userId);
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get subscriptions" });
  }
};

export const getCreatorServicesController = async (
  req: Request<{}, {}, {}, { userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.query;
    const services = await getServicesPerCreator(userId);
    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get services" });
  }
};

export const getUserSubscriptionsController = async (
  req: Request<{}, {}, {}, { userId: string }>,
  res: Response,
): Promise<Response> => {
  try {
    const { userId } = req.query;
    const data = await getUserSubscriptions(userId);

    return res.status(200).json(data);
  } catch (error) {
    console.error("getUserSubscriptionsController error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch subscriptions",
    });
  }
};
