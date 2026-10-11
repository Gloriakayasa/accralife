import { WorldLocation } from './Types';

export const ACCRA_LOCATIONS: Record<string, WorldLocation> = {
  osu_apartment: {
    id: 'osu_apartment',
    name: "Player's Osu Compound",
    description: 'Your cozy self-contained apartment in Osu. Rest, style up, and plan your Accra hustle!',
    themeMusic: 5,
    indoor: true,
    exits: [
      { name: 'Step Out to Oxford Street', x: 135, y: 195, w: 50, h: 25, targetLocation: 'oxford_street', targetX: 150, targetY: 120 }
    ],
    interactables: [
      { id: 'bed', name: 'Comfortable Bed', x: 25, y: 55, w: 78, h: 40, action: 'sleep' },
      { id: 'fridge', name: 'Kitchen Fridge', x: 245, y: 55, w: 39, h: 40, action: 'eat' },
      { id: 'wardrobe', name: 'Wardrobe & Mirror', x: 185, y: 55, w: 39, h: 40, action: 'groom' },
      { id: 'tv', name: 'Television & Afrobeats', x: 25, y: 130, w: 46, h: 27, action: 'watch_tv' },
      { id: 'laptop', name: 'Laptop / Studio Beats', x: 235, y: 130, w: 56, h: 27, action: 'produce_music' }
    ],
    npcs: []
  },

  oxford_street: {
    id: 'oxford_street',
    name: 'Oxford Street, Osu',
    description: 'The pulsing neon heart of Accra! Packed with street food, music, boutiques, and endless vibes.',
    themeMusic: 2,
    indoor: false,
    exits: [
      { name: 'Your Apartment', x: 135, y: 35, w: 50, h: 20, targetLocation: 'osu_apartment', targetX: 160, targetY: 175 },
      { name: 'Chop Bar', x: 10, y: 80, w: 30, h: 45, targetLocation: 'chop_bar', targetX: 260, targetY: 130 },
      { name: 'East Legon Club', x: 280, y: 80, w: 30, h: 45, targetLocation: 'east_legon_club', targetX: 40, targetY: 130 },
      { name: 'Labadi Beach', x: 270, y: 190, w: 45, h: 25, targetLocation: 'labadi_beach', targetX: 50, targetY: 140 },
      { name: 'Jamestown', x: 5, y: 190, w: 45, h: 25, targetLocation: 'jamestown', targetX: 250, targetY: 140 }
    ],
    interactables: [
      { id: 'trotro', name: 'Yellow Taxi / Tro-tro', x: 80, y: 145, w: 78, h: 40, action: 'hail_cab' },
      { id: 'sofa', name: 'Street Lounge Bench', x: 190, y: 80, w: 60, h: 30, action: 'rest_bench' },
      { id: 'food_plate', name: 'Suya / Kebab Grill', x: 50, y: 85, w: 25, h: 25, action: 'buy_kebab' }
    ],
    npcs: ['ama', 'kwame']
  },

  jamestown: {
    id: 'jamestown',
    name: 'Jamestown Harbour',
    description: 'Historic coastal community with the British Lighthouse, fishing canoes, boxing gyms, and raw creativity.',
    themeMusic: 4,
    indoor: false,
    exits: [
      { name: 'Oxford Street', x: 265, y: 125, w: 45, h: 30, targetLocation: 'oxford_street', targetX: 30, targetY: 180 },
      { name: 'Makola Market', x: 10, y: 125, w: 45, h: 30, targetLocation: 'makola_market', targetX: 250, targetY: 140 }
    ],
    interactables: [
      { id: 'palm_tree', name: 'Coastal Palm Tree', x: 60, y: 70, w: 20, h: 40, action: 'sea_breeze' },
      { id: 'trotro', name: 'Fishing Boat Dock', x: 140, y: 140, w: 78, h: 40, action: 'view_ocean' }
    ],
    npcs: ['kojo']
  },

  labadi_beach: {
    id: 'labadi_beach',
    name: 'Labadi Beach Resort',
    description: 'Golden Atlantic sand, crashing waves, reggae sound systems, and cold coconuts.',
    themeMusic: 4,
    indoor: false,
    exits: [
      { name: 'Oxford Street', x: 10, y: 125, w: 45, h: 30, targetLocation: 'oxford_street', targetX: 250, targetY: 180 },
      { name: 'Airport City', x: 265, y: 125, w: 45, h: 30, targetLocation: 'airport_city', targetX: 40, targetY: 140 }
    ],
    interactables: [
      { id: 'palm_tree', name: 'Coconut Palm', x: 45, y: 70, w: 20, h: 40, action: 'drink_coconut' },
      { id: 'sofa', name: 'Beach Sun Lounger', x: 110, y: 85, w: 60, h: 30, action: 'sunbathe' },
      { id: 'dj_booth', name: 'Beach Dance Stage', x: 200, y: 75, w: 70, h: 40, action: 'azonto_dance_game' }
    ],
    npcs: ['kofi']
  },

  east_legon_club: {
    id: 'east_legon_club',
    name: 'East Legon VIP Club',
    description: 'Ultra-exclusive nightclub and champagne lounge where Accra’s power players and stars celebrate.',
    themeMusic: 3,
    indoor: true,
    exits: [
      { name: 'Oxford Street', x: 10, y: 125, w: 35, h: 35, targetLocation: 'oxford_street', targetX: 250, targetY: 90 },
      { name: 'Airport City', x: 275, y: 125, w: 35, h: 35, targetLocation: 'airport_city', targetX: 250, targetY: 140 }
    ],
    interactables: [
      { id: 'dj_booth', name: 'DJ Decks & Dance Floor', x: 120, y: 60, w: 80, h: 45, action: 'azonto_dance_game' },
      { id: 'bar_counter', name: 'Cocktail Bar Counter', x: 25, y: 65, w: 60, h: 40, action: 'bartender_shift' },
      { id: 'sofa', name: 'VIP Leather Booth', x: 215, y: 70, w: 65, h: 35, action: 'vip_lounge' }
    ],
    npcs: ['abena']
  },

  makola_market: {
    id: 'makola_market',
    name: 'Makola Market',
    description: 'The vibrant trading heart of Ghana. Bustling stalls selling Kente cloth, fresh spices, and the latest drip.',
    themeMusic: 2,
    indoor: false,
    exits: [
      { name: 'Jamestown', x: 265, y: 125, w: 45, h: 30, targetLocation: 'jamestown', targetX: 30, targetY: 140 },
      { name: 'Chop Bar', x: 10, y: 125, w: 45, h: 30, targetLocation: 'chop_bar', targetX: 50, targetY: 140 }
    ],
    interactables: [
      { id: 'table', name: 'Kente & Fabric Stall', x: 60, y: 80, w: 45, h: 30, action: 'buy_kente' },
      { id: 'table', name: 'MoMo / Cash Transfer Spot', x: 175, y: 80, w: 45, h: 30, action: 'momo_agent' }
    ],
    npcs: []
  },

  airport_city: {
    id: 'airport_city',
    name: 'Airport City Skyline',
    description: 'Modern glass towers, luxury hotels, tech startups, and the headquarters of international brands.',
    themeMusic: 1,
    indoor: false,
    exits: [
      { name: 'Labadi Beach', x: 10, y: 125, w: 45, h: 30, targetLocation: 'labadi_beach', targetX: 240, targetY: 140 },
      { name: 'East Legon Club', x: 265, y: 125, w: 45, h: 30, targetLocation: 'east_legon_club', targetX: 250, targetY: 140 }
    ],
    interactables: [
      { id: 'sofa', name: 'Rooftop Lounge Seating', x: 80, y: 85, w: 60, h: 30, action: 'networking_lounge' },
      { id: 'trotro', name: 'Executive Mercedes', x: 180, y: 140, w: 78, h: 40, action: 'executive_ride' }
    ],
    npcs: ['akosua']
  },

  chop_bar: {
    id: 'chop_bar',
    name: "Auntie Muni's Chop Bar",
    description: 'Famous local restaurant with bubbling cauldrons of Ghana Jollof, hot Waakye, fried plantains, and goat soup.',
    themeMusic: 1,
    indoor: true,
    exits: [
      { name: 'Oxford Street', x: 265, y: 125, w: 45, h: 30, targetLocation: 'oxford_street', targetX: 40, targetY: 90 },
      { name: 'Makola Market', x: 10, y: 125, w: 45, h: 30, targetLocation: 'makola_market', targetX: 30, targetY: 140 }
    ],
    interactables: [
      { id: 'food_plate', name: 'Jollof & Waakye Counter', x: 40, y: 65, w: 60, h: 40, action: 'eat_jollof' },
      { id: 'bar_counter', name: 'Kitchen Order Line', x: 130, y: 65, w: 70, h: 40, action: 'chop_bar_shift' },
      { id: 'table', name: 'Wooden Chop Bar Bench', x: 220, y: 75, w: 50, h: 30, action: 'dine_bench' }
    ],
    npcs: ['uncle_ebo']
  }
};
