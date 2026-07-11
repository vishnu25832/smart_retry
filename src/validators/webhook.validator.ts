import { z } from "zod";

export const createWebhookSchema = z.object({
  url: z.url("Invalid webhook URL"),

  payload: z.any(),

  headers: z
    .record(z.string(), z.string())
    .optional()
    .default({})
});

export type CreateWebhookDto = z.infer<typeof createWebhookSchema>;