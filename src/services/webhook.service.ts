import repository, {
  CreateWebhookData,
} from "../repositories/webhook.repository";

class WebhookService {
  async createWebhook(body: CreateWebhookData) {
    if (!body.url || body.url.trim() === "") {
      throw new Error("Webhook URL is required");
    }

    return repository.create(body);
  }

  async getWebhook(id: string) {
    const webhook = await repository.findById(id);

    if (!webhook) {
      throw new Error("Webhook not found");
    }

    return webhook;
  }

  async getDeadWebhooks() {
    return repository.findDeadJobs();
  }

  async replayWebhook(id: string) {
    const webhook = await repository.findById(id);

    if (!webhook) {
      throw new Error("Webhook not found");
    }

    if (webhook.status !== "DEAD") {
      throw new Error("Only DEAD webhooks can be replayed");
    }

    return repository.replay(id);
  }
}

export default new WebhookService();