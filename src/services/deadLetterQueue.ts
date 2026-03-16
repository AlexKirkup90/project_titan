export interface DeadLetterRecord {
  eventId: string;
  reason: string;
  payload: unknown;
  failedAt: string;
}

export class DeadLetterQueue {
  private readonly records: DeadLetterRecord[] = [];

  push(record: DeadLetterRecord): void {
    this.records.push(record);
  }

  all(): DeadLetterRecord[] {
    return [...this.records];
  }
}
