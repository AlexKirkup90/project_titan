import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { terraWebhookSchema, subjectiveLogSchema } from "../schemas/ingestion.js";
import { JsonlStore } from "../storage/eventStore.js";
import { DeadLetterQueue } from "../services/deadLetterQueue.js";
import { DedupeService } from "../services/dedupeService.js";
import { RetryQueue } from "../services/retryQueue.js";

const terraStore = new JsonlStore<Record<string, unknown>>("data/terra_events.jsonl");
const subjectiveStore = new JsonlStore<Record<string, unknown>>("data/subjective_logs.jsonl");
const dlq = new DeadLetterQueue();
const dedupe = new DedupeService();

const queue = new RetryQueue(env.MAX_RETRIES, dlq, async (payload: Record<string, unknown>) => {
  const parsed = terraWebhookSchema.parse(payload);
  // Simulate durable storage write.
  terraStore.write({ ...parsed, received_at: parsed.received_at ?? new Date().toISOString() });
});

const router = Router();

router.post("/webhooks/terra", (req, res) => {
  const parseResult = terraWebhookSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid Terra webhook payload",
      details: parseResult.error.flatten()
    });
  }

  const event = parseResult.data;

  if (dedupe.seen(event.id)) {
    return res.status(202).json({
      status: "duplicate_ignored",
      event_id: event.id
    });
  }

  queue.enqueue(event.id, req.body as Record<string, unknown>);

  return res.status(202).json({
    status: "accepted",
    event_id: event.id,
    queue_depth: queue.size()
  });
});

router.post("/logs/subjective", (req, res) => {
  const parseResult = subjectiveLogSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid subjective log payload",
      details: parseResult.error.flatten()
    });
  }

  subjectiveStore.write({ ...parseResult.data, created_at: new Date().toISOString() });
  return res.status(201).json({ status: "created" });
});

router.get("/internal/dlq", (_req, res) => {
  return res.status(200).json({
    count: dlq.all().length,
    records: dlq.all()
  });
});

router.get("/internal/metrics", (_req, res) => {
  return res.status(200).json({
    unique_events_seen: dedupe.count(),
    queue_depth: queue.size(),
    dlq_count: dlq.all().length
  });
});

export { router as ingestionRouter };
