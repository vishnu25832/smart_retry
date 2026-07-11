import express from "express";
import dotenv from "dotenv";

import webhookRoutes from "./routes/webhook.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Retry Queue API Running 🚀",
  });
});

app.use("/webhooks", webhookRoutes);

app.use(errorHandler);

export default app;