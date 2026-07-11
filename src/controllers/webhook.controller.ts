import { Request, Response, NextFunction } from "express";
import webhookService from "../services/webhook.service";

export const createWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const webhook = await webhookService.createWebhook(req.body);

    return res.status(201).json({
      success: true,
      message: "Webhook created successfully",
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
};

export const getWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const webhook = await webhookService.getWebhook(req.params.id);

    return res.status(200).json({
      success: true,
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeadWebhooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const webhooks = await webhookService.getDeadWebhooks();

    return res.status(200).json({
      success: true,
      count: webhooks.length,
      data: webhooks,
    });
  } catch (error) {
    next(error);
  }
};

export const replayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const webhook = await webhookService.replayWebhook(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Webhook queued for replay",
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
};