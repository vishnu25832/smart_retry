# Smart Retry Queue

A production-inspired webhook delivery system built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **SQLite**.

The application accepts webhook requests, stores them persistently, delivers them asynchronously using a background scheduler, retries failed deliveries with exponential backoff, and moves permanently failed deliveries to a Dead Letter Queue (DLQ). Failed deliveries can later be replayed manually.

---

## Features

- Persistent webhook queue using SQLite + Prisma
- Background retry scheduler
- Exponential backoff retry strategy
- Dead Letter Queue (DLQ)
- Replay failed webhooks
- RESTful APIs
- Request validation using Zod
- Layered architecture
- Automated API testing using Jest & Supertest
- Structured logging using Pino

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | REST API |
| TypeScript | Type Safety |
| Prisma | ORM |
| SQLite | Database |
| Jest | Testing |
| Supertest | API Testing |
| Axios | HTTP Client |
| Zod | Validation |
| Pino | Logging |

---

# Project Structure

```
smart-retry-queue
│
├── prisma
│   ├── migrations
│   └── schema.prisma
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── repositories
│   ├── routes
│   ├── scheduler
│   ├── services
│   ├── tests
│   ├── utils
│   ├── validators
│   ├── app.ts
│   └── server.ts
│
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
└── tsconfig.json
```

---

# Architecture

```
Client
   │
   ▼
Express Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Prisma
   │
   ▼
SQLite
```

Background Scheduler

```
Pending Queue
      │
      ▼
Scheduler
      │
      ▼
HTTP Delivery
      │
 ┌────┴─────┐
 │          │
 ▼          ▼
Success    Failure
 │          │
 ▼          ▼
Delivered  Retry
               │
               ▼
       Max Retries Reached
               │
               ▼
        Dead Letter Queue
               │
               ▼
         Replay Endpoint
```

---

# Retry Strategy

The retry mechanism uses exponential backoff.

Example:

| Attempt | Delay |
|---------|-------|
| 1 | 2 seconds |
| 2 | 4 seconds |
| 3 | 8 seconds |
| 4 | 16 seconds |
| 5 | 32 seconds |

After the maximum retry limit is reached, the webhook is moved to the Dead Letter Queue.

---

# API Endpoints

## Create Webhook

```
POST /webhooks/send
```

Request

```json
{
  "url": "https://example.com/webhook",
  "payload": {
    "event": "booking.created"
  },
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

---

## Get Webhook

```
GET /webhooks/:id
```

---

## Dead Letter Queue

```
GET /webhooks/dead
```

---

## Replay Webhook

```
POST /webhooks/:id/replay
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npm run generate
```

Run database migrations

```bash
npm run migrate
```

Start development server

```bash
npm run dev
```

Run tests

```bash
npm test
```

---

# Docker

Docker configuration files are included.

Build

```bash
docker compose build
```

Run

```bash
docker compose up
```

---

# Testing

Automated integration tests cover:

- Invalid webhook requests
- Successful webhook creation
- Get webhook by ID
- Get Dead Letter Queue
- Replay validation
- Unknown webhook handling

---

# Future Improvements

- Redis-backed queue
- RabbitMQ / Kafka integration
- Worker scaling
- Authentication
- Rate limiting
- Metrics dashboard
- OpenTelemetry tracing
- Prometheus monitoring

---

# Author

**Vishnu Vardhan B**

Backend Developer

Node.js • TypeScript • Prisma • Express