export class StringsManager {
  private tables: Record<string, string[]> = {};
  public loaded: boolean = false;

  public async load(): Promise<void> {
    try {
      const res = await fetch('/data/strings.json');
      if (res.ok) {
        this.tables = await res.json();
        this.loaded = true;
      }
    } catch (e) {
      console.warn('Failed to load strings.json:', e);
    }
  }

  public get(tableIdx: number, stringIdx: number): string {
    const table = this.tables[String(tableIdx)];
    if (!table || stringIdx >= table.length) {
      return '';
    }
    return table[stringIdx] || '';
  }

  public format(raw: string, playerName: string = 'Kofi', isFemale: boolean = false): string {
    let result = raw;
    result = result.replace(/%s/g, playerName);
    if (isFemale) {
      result = result.replace(/\\m([^\\]*)\\m/g, '').replace(/\\f([^\\]*)\\f/g, '$1');
    } else {
      result = result.replace(/\\f([^\\]*)\\f/g, '').replace(/\\m([^\\]*)\\m/g, '$1');
    }
    result = result.replace(/\\x[0-9a-fA-F]{2}/g, '');
    result = result.replace(/\\c[0-9]/g, '');
    return result;
  }
}
