import { CharacterAppearance, PlayerStats, PlayerCareer, InventoryItem, Relationship, Quest } from '../game/Types';

export interface SaveData {
  version: number;
  appearance: CharacterAppearance;
  stats: PlayerStats;
  cash: number;
  career: PlayerCareer;
  day: number;
  hour: number;
  minute: number;
  currentLocationId: string;
  playerX: number;
  playerY: number;
  inventory: InventoryItem[];
  relationships: Record<string, Relationship>;
  quests: Record<string, Quest>;
}

export class SaveManager {
  private static STORAGE_KEY = 'accralife_save_v1';

  public static hasSave(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  public static saveGame(data: SaveData): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Failed to save game:', e);
      return false;
    }
  }

  public static loadGame(): SaveData | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load save data:', e);
      return null;
    }
  }

  public static clearSave(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
