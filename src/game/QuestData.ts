import { Quest } from './Types';

export const ACCRA_QUESTS: Record<string, Quest> = {
  welcome_accra: {
    id: 'welcome_accra',
    title: 'Settle in Accra',
    description: 'Explore Oxford Street and talk to Ama the fashion stylist.',
    targetLocation: 'oxford_street',
    targetNpc: 'ama',
    rewardCash: 50,
    rewardStyle: 15,
    completed: false
  },

  eat_local: {
    id: 'eat_local',
    title: 'Authentic Jollof',
    description: 'Visit Auntie Muni’s Chop Bar and taste hot Ghana Jollof with Uncle Ebo.',
    targetLocation: 'chop_bar',
    targetNpc: 'uncle_ebo',
    rewardCash: 30,
    rewardStyle: 10,
    completed: false
  },

  club_drip: {
    id: 'club_drip',
    title: 'East Legon Drip',
    description: 'Upgrade your style and head to East Legon VIP Club.',
    targetLocation: 'east_legon_club',
    targetNpc: 'abena',
    rewardCash: 100,
    rewardStyle: 25,
    completed: false
  },

  dance_battle: {
    id: 'dance_battle',
    title: 'Labadi Azonto Battle',
    description: 'Hit Labadi Beach and win the seaside dance rhythm contest!',
    targetLocation: 'labadi_beach',
    rewardCash: 120,
    rewardStyle: 30,
    completed: false
  },

  produce_hit: {
    id: 'produce_hit',
    title: 'Studio Hit Track',
    description: 'Make a hot demo track on your laptop in Osu and pitch it to Kofi.',
    targetLocation: 'labadi_beach',
    targetNpc: 'kofi',
    rewardCash: 150,
    rewardStyle: 40,
    completed: false
  }
};
