import prisma from "../config/prisma";

export interface CreateWebhookData {
  url: string;
  payload: unknown;
  headers?: Record<string, string>;
}

class WebhookRepository {
  async create(data: CreateWebhookData) {
    return prisma.webhookDelivery.create({
      data: {
        url: data.url,
        payload: JSON.stringify(data.payload),
        headers: JSON.stringify(data.headers || {}),
        status: "PENDING",
        attemptCount: 0,
        nextRetryAt: new Date(),
      },
    });
  }

  async findPendingJobs() {
    return prisma.webhookDelivery.findMany({
      where: {
        status: "PENDING",
        nextRetryAt: {
          lte: new Date(),
        },
      },
      orderBy: {
        nextRetryAt: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.webhookDelivery.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  async findDeadJobs() {
    return prisma.webhookDelivery.findMany({
      where: {
        status: "DEAD",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async markProcessing(id: string) {
    return prisma.webhookDelivery.update({
      where: { id },
      data: {
        status: "PROCESSING",
      },
    });
  }

  async markDelivered(id: string) {
    return prisma.webhookDelivery.update({
      where: { id },
      data: {
        status: "DELIVERED",
        lastError: null,
      },
    });
  }

  async markDead(id: string, error: string) {
    return prisma.webhookDelivery.update({
      where: { id },
      data: {
        status: "DEAD",
        lastError: error,
      },
    });
  }

  async updateRetry(
    id: string,
    attemptCount: number,
    nextRetryAt: Date,
    error: string
  ) {
    return prisma.webhookDelivery.update({
      where: { id },
      data: {
        attemptCount,
        nextRetryAt,
        lastError: error,
        status: "PENDING",
      },
    });
  }

  async replay(id: string) {
    return prisma.webhookDelivery.update({
      where: { id },
      data: {
        status: "PENDING",
        attemptCount: 0,
        nextRetryAt: new Date(),
        lastError: null,
      },
    });
  }

  async createAttemptLog(
    deliveryId: string,
    attemptNumber: number,
    statusCode?: number,
    responseBody?: string,
    error?: string
  ) {
    return prisma.attemptLog.create({
      data: {
        deliveryId,
        attemptNumber,
        statusCode,
        responseBody,
        error,
      },
    });
  }
}

export default new WebhookRepository();