import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export class JsonlStore<T> {
  constructor(private readonly filePath: string) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  write(record: T): void {
    appendFileSync(this.filePath, `${JSON.stringify(record)}\n`, "utf8");
  }
}
