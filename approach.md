# Implementation Approach

## Objective

Build a reliable webhook delivery system capable of handling transient failures using retries while avoiding data loss.

---

## Design Decisions

### Persistent Queue

Instead of storing jobs in memory, all webhook deliveries are persisted in SQLite using Prisma.

Advantages:

- Survives application restarts
- Easy debugging
- Simple deployment

---

### Background Scheduler

A dedicated scheduler continuously checks for pending deliveries.

Benefits:

- Non-blocking API responses
- Asynchronous processing
- Separation of request handling and delivery

---

### Exponential Backoff

Retry intervals increase exponentially to reduce pressure on downstream services.

Example:

- Retry 1 → 2 sec
- Retry 2 → 4 sec
- Retry 3 → 8 sec
- Retry 4 → 16 sec
- Retry 5 → 32 sec

---

### Dead Letter Queue

Deliveries exceeding the retry limit are moved to the Dead Letter Queue.

Benefits:

- Prevents infinite retries
- Enables manual inspection
- Supports replay

---

### Validation

Incoming requests are validated using Zod before entering the business logic layer.

---

### Testing

API endpoints are tested using Jest and Supertest to verify expected behavior.