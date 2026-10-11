export interface CharacterAppearance {
  gender: 'male' | 'female';
  skinTone: number; // 0: dark bronze, 1: deep ebony, 2: warm caramel, 3: golden
  hairColor: number;
  styleOutfit: number; // 0: casual, 1: street drip, 2: VIP / club
  name: string;
}

export interface PlayerStats {
  energy: number;   // 0 - 100
  hunger: number;   // 0 - 100
  hygiene: number;  // 0 - 100
  fun: number;      // 0 - 100
  social: number;   // 0 - 100
  style: number;    // 0 - 100
}

export interface PlayerCareer {
  track: 'music_producer' | 'fashion_designer' | 'tech_hustler' | 'hospitality';
  title: string;
  level: number;
  salary: number; // Ghana Cedis GH₵
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: 'food' | 'fashion' | 'gift' | 'tech';
  value: number;
}

export interface Relationship {
  npcId: string;
  friendship: number; // -100 to 100
  romance: number;    // 0 to 100
  status: 'Stranger' | 'Chale' | 'Friend' | 'Best Chale' | 'Dating';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetNpc?: string;
  targetLocation?: string;
  targetAction?: string;
  rewardCash: number;  // GH₵
  rewardStyle: number;
  completed: boolean;
}

export interface InteractableObject {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  action: string;
  isExit?: boolean;
  targetLocation?: string;
  targetX?: number;
  targetY?: number;
}

export interface LocationExit {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  targetLocation: string;
  targetX: number;
  targetY: number;
}

export interface WorldLocation {
  id: string;
  name: string;
  description: string;
  themeMusic: number;
  indoor: boolean;
  exits: LocationExit[];
  interactables: InteractableObject[];
  npcs: string[];
}

export interface DialogueOption {
  text: string;
  response: string;
  relationshipDelta: number;
  givesQuest?: string;
  completesQuest?: string;
  costCash?: number;
  givesCash?: number;
}

export interface DialogueNode {
  greeting: string;
  options: DialogueOption[];
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  gender: 'male' | 'female';
  styleOutfit: number;
  locationId: string;
  x: number;
  y: number;
  portraitIdx: number;
  dialogue: DialogueNode;
}
