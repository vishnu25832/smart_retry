import { Router } from "express";

import {
  createWebhook,
  getWebhook,
  getDeadWebhooks,
  replayWebhook
} from "../controllers/webhook.controller";

import { validate } from "../middleware/validate.middleware";

import { createWebhookSchema } from "../validators/webhook.validator";

const router = Router();

router.post(
  "/send",
  validate(createWebhookSchema),
  createWebhook
);

router.get("/dead", getDeadWebhooks);

router.get("/:id", getWebhook);

router.post("/:id/replay", replayWebhook);

export default router;