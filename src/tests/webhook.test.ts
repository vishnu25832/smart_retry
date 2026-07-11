import request from "supertest";
import app from "../app";

describe("Webhook API", () => {
  let webhookId: string;

  it("should reject an invalid URL", async () => {
    const res = await request(app).post("/webhooks/send").send({
      url: "abc",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should create a webhook", async () => {
    const res = await request(app).post("/webhooks/send").send({
      url: "https://webhook.site/test",
      payload: {
        name: "Vishnu",
      },
      headers: {},
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    webhookId = res.body.data.id;

    expect(webhookId).toBeDefined();
  });

  it("should get webhook by id", async () => {
    const res = await request(app).get(`/webhooks/${webhookId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(webhookId);
  });

  it("should return dead webhooks", async () => {
    const res = await request(app).get("/webhooks/dead");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should not replay non-dead webhook", async () => {
    const res = await request(app).post(`/webhooks/${webhookId}/replay`);

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("should return 404 for unknown webhook", async () => {
    const res = await request(app).get(
      "/webhooks/00000000-0000-0000-0000-000000000000"
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});