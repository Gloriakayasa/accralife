import { CharacterAppearance, PlayerStats, PlayerCareer, InventoryItem, Relationship, Quest } from './Types';
import { ACCRA_NPCS } from './NPCData';
import { ACCRA_QUESTS } from './QuestData';

export class Player {
  public appearance: CharacterAppearance = {
    gender: 'male',
    skinTone: 1, // rich ebony / bronze
    hairColor: 0,
    styleOutfit: 0,
    name: 'Kofi'
  };

  public stats: PlayerStats = {
    energy: 90,
    hunger: 80,
    hygiene: 85,
    fun: 75,
    social: 70,
    style: 60
  };

  public cash: number = 150; // Ghana Cedis GH₵
  public career: PlayerCareer = {
    track: 'music_producer',
    title: 'Bedroom Beatmaker',
    level: 1,
    salary: 40
  };

  public day: number = 1;
  public hour: number = 12;
  public minute: number = 0;
  private timeAccumulator: number = 0;

  public currentLocationId: string = 'osu_apartment';
  public x: number = 150;
  public y: number = 140;
  public targetX: number = 150;
  public targetY: number = 140;
  public dir: 'down' | 'up' | 'left' | 'right' = 'down';
  public action: 'idle' | 'walk' | 'talk' | 'dance' = 'idle';

  public inventory: InventoryItem[] = [
    { id: 'sunglasses', name: 'Retro Shades', description: 'Stylish shades from Osu boutique', category: 'fashion', value: 25 },
    { id: 'kebab', name: 'Suya Skewer', description: 'Spicy seasoned beef skewer', category: 'food', value: 10 }
  ];

  public relationships: Record<string, Relationship> = {};
  public quests: Record<string, Quest> = {};

  constructor() {
    this.initRelationships();
    this.initQuests();
  }

  private initRelationships(): void {
    for (const [id] of Object.entries(ACCRA_NPCS)) {
      this.relationships[id] = {
        npcId: id,
        friendship: 10,
        romance: 0,
        status: 'Stranger'
      };
    }
  }

  private initQuests(): void {
    this.quests = JSON.parse(JSON.stringify(ACCRA_QUESTS));
  }

  public updateTime(deltaSeconds: number): void {
    this.timeAccumulator += deltaSeconds;
    // 1 real second = 1 in-game minute
    while (this.timeAccumulator >= 1.0) {
      this.timeAccumulator -= 1.0;
      this.minute += 1;
      if (this.minute >= 60) {
        this.minute = 0;
        this.hour += 1;
        if (this.hour >= 24) {
          this.hour = 0;
          this.day += 1;
        }
      }

      // Minute decay rates
      this.stats.hunger = Math.max(0, this.stats.hunger - 0.04);
      this.stats.energy = Math.max(0, this.stats.energy - 0.03);
      this.stats.hygiene = Math.max(0, this.stats.hygiene - 0.02);
      this.stats.fun = Math.max(0, this.stats.fun - 0.03);
      this.stats.social = Math.max(0, this.stats.social - 0.02);
    }
  }

  public modifyStat(stat: keyof PlayerStats, amount: number): void {
    this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat] + amount));
  }

  public completeQuest(questId: string): boolean {
    const q = this.quests[questId];
    if (q && !q.completed) {
      q.completed = true;
      this.cash += q.rewardCash;
      this.modifyStat('style', q.rewardStyle);
      return true;
    }
    return false;
  }
}
