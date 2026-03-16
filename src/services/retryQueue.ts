import { DeadLetterQueue } from "./deadLetterQueue.js";
import { logger } from "../utils/logger.js";

interface QueueJob<T> {
  id: string;
  payload: T;
  attempts: number;
}

export class RetryQueue<T> {
  private readonly jobs: QueueJob<T>[] = [];
  private processing = false;

  constructor(
    private readonly maxRetries: number,
    private readonly dlq: DeadLetterQueue,
    private readonly handler: (payload: T) => Promise<void>
  ) {}

  enqueue(id: string, payload: T): void {
    this.jobs.push({ id, payload, attempts: 0 });
    void this.process();
  }

  size(): number {
    return this.jobs.length;
  }

  private async process(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.jobs.length > 0) {
      const current = this.jobs.shift();
      if (!current) {
        continue;
      }

      try {
        await this.handler(current.payload);
      } catch (error) {
        current.attempts += 1;

        if (current.attempts >= this.maxRetries) {
          this.dlq.push({
            eventId: current.id,
            reason: error instanceof Error ? error.message : "unknown error",
            payload: current.payload,
            failedAt: new Date().toISOString()
          });
          logger.error({ eventId: current.id }, "Moved event to dead-letter queue");
        } else {
          this.jobs.push(current);
          logger.warn({ eventId: current.id, attempts: current.attempts }, "Retrying event");
        }
      }
    }

    this.processing = false;
  }
}
