import repository from "../repositories/webhook.repository";
import deliveryService from "../services/delivery.service";

class RetryScheduler {
  async start() {
    console.log("🚀 Retry Scheduler Started");

    while (true) {
      try {
        const jobs = await repository.findPendingJobs();

        if (jobs.length > 0) {
          await Promise.allSettled(
            jobs.map((job) =>
              deliveryService.processWebhook(job)
            )
          );
        }
      } catch (error) {
        console.error(error);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );
    }
  }
}

export default new RetryScheduler();