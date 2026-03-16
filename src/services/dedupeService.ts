export class DedupeService {
  private readonly ids = new Set<string>();

  seen(id: string): boolean {
    if (this.ids.has(id)) {
      return true;
    }

    this.ids.add(id);
    return false;
  }

  count(): number {
    return this.ids.size;
  }
}
