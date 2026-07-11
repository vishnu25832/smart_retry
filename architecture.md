# System Architecture

## Overview

The Smart Retry Queue is designed using a layered architecture that separates API handling, business logic, persistence, and background processing.

```
                Client
                   │
                   ▼
            Express Routes
                   │
                   ▼
             Controllers
                   │
                   ▼
              Services
                   │
                   ▼
           Repository Layer
                   │
                   ▼
                Prisma ORM
                   │
                   ▼
                 SQLite
```

---

## Components

### Controller Layer

Responsible for:

- Receiving HTTP requests
- Returning HTTP responses
- Delegating business logic to services

---

### Service Layer

Responsible for:

- Webhook processing
- Replay logic
- Retry decisions
- Validation of business rules

---

### Repository Layer

Responsible for:

- Database access
- CRUD operations
- Query abstraction using Prisma

---

### Background Scheduler

Runs continuously and:

- Fetches pending jobs
- Delivers webhooks
- Calculates retry delays
- Updates delivery status
- Moves failed deliveries to the Dead Letter Queue

---

## Retry Flow

```
Create Webhook
      │
      ▼
PENDING
      │
      ▼
PROCESSING
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Success   Failure
 │         │
 ▼         ▼
Delivered Retry
               │
               ▼
      Max Retries
               │
               ▼
      Dead Letter Queue
               │
               ▼
           Replay API
```

---

## Design Principles

- Layered architecture
- Separation of concerns
- Persistent queue
- Idempotent retry processing
- Extensible service layer