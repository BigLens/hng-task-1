import { StoredString } from '../types';

class StringStore {
  private strings: Map<string, StoredString> = new Map();

  add(storedString: StoredString): void {
    this.strings.set(storedString.id, storedString);
  }

  exists(id: string): boolean {
    return this.strings.has(id);
  }

  getById(id: string): StoredString | undefined {
    return this.strings.get(id);
  }

  getAll(): StoredString[] {
    return Array.from(this.strings.values());
  }

  delete(id: string): boolean {
    return this.strings.delete(id);
  }
}

export const stringStore = new StringStore();
