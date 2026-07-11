import app from "./app";
import logger from "./utils/logger";
import retryScheduler from "./scheduler/retry.scheduler";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);

  retryScheduler.start();
});