import axios from "axios";
import repository from "../repositories/webhook.repository";
import { getRetryDelay } from "../utils/backoff";

class DeliveryService {
  async processWebhook(job: any) {
    await repository.markProcessing(job.id);

    try {
      const response = await axios.post(
        job.url,
        JSON.parse(job.payload),
        {
          headers: JSON.parse(job.headers || "{}"),
          timeout: 5000,
          validateStatus: () => true,
        }
      );

      await repository.createAttemptLog(
        job.id,
        job.attemptCount + 1,
        response.status,
        JSON.stringify(response.data)
      );

      // Success
      if (response.status >= 200 && response.status < 300) {
        await repository.markDelivered(job.id);
        console.log(`✅ Delivered ${job.id}`);
        return;
      }

      // Permanent failure
      if (response.status === 410) {
        await repository.markDead(job.id, "410 Gone");
        console.log(`❌ Marked DEAD (410): ${job.id}`);
        return;
      }

      // Retry
      const attempt = job.attemptCount + 1;
      const delay = getRetryDelay(attempt);

      if (delay === -1) {
        await repository.markDead(
          job.id,
          `Max retries exceeded (${response.status})`
        );
        return;
      }

      await repository.updateRetry(
        job.id,
        attempt,
        new Date(Date.now() + delay),
        `HTTP ${response.status}`
      );

      console.log(`🔄 Retry ${attempt} scheduled`);
    } catch (error: any) {
      const attempt = job.attemptCount + 1;

      await repository.createAttemptLog(
        job.id,
        attempt,
        undefined,
        undefined,
        error.message
      );

      const delay = getRetryDelay(attempt);

      if (delay === -1) {
        await repository.markDead(job.id, error.message);
        return;
      }

      await repository.updateRetry(
        job.id,
        attempt,
        new Date(Date.now() + delay),
        error.message
      );

      console.log(`🔄 Retry ${attempt} scheduled`);
    }
  }
}

export default new DeliveryService();