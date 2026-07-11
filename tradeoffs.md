# Tradeoffs

## SQLite instead of PostgreSQL

Chosen because:

- Lightweight
- Zero configuration
- Suitable for local development

Tradeoff:

- Limited scalability compared to PostgreSQL.

---

## Polling Scheduler

A polling scheduler was implemented instead of event-driven workers.

Advantages:

- Simpler implementation
- Easy to understand

Tradeoff:

- Less efficient than message queue systems.

---

## Prisma ORM

Advantages:

- Type safety
- Better developer experience
- Simplified database access

Tradeoff:

- Slight abstraction overhead compared to raw SQL.

---

## Replay API

Replay is implemented as a manual operation.

Advantages:

- Prevents accidental retries
- Gives operators control

Tradeoff:

- Requires manual intervention.