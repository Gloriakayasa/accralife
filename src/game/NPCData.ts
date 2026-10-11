import { NPC } from './Types';

export const ACCRA_NPCS: Record<string, NPC> = {
  ama: {
    id: 'ama',
    name: 'Ama',
    title: 'Fashion Stylist',
    gender: 'female',
    styleOutfit: 1,
    locationId: 'oxford_street',
    x: 210,
    y: 110,
    portraitIdx: 1,
    dialogue: {
      greeting: "Chale, what's up! You are looking fresh on Oxford Street today. Are you ready for Accra vibes?",
      options: [
        {
          text: 'Praise her Afro-chic fashion drip',
          response: "Aww thanks chale! I tailored this myself using authentic Kente and modern cuts. Style is everything here in Accra!",
          relationshipDelta: 15
        },
        {
          text: 'Ask where the best party is tonight',
          response: "East Legon VIP Club is popping tonight! But you must dress sharp or bouncers won't let you inside.",
          relationshipDelta: 10,
          givesQuest: 'club_drip'
        },
        {
          text: 'Buy a designer sunglasses accessory (GH₵ 40)',
          response: "Here you go! Now your style meter is soaring. You look like a certified superstar!",
          relationshipDelta: 20,
          costCash: 40
        }
      ]
    }
  },

  kwame: {
    id: 'kwame',
    name: 'Kwame',
    title: 'Nightlife DJ',
    gender: 'male',
    styleOutfit: 1,
    locationId: 'oxford_street',
    x: 95,
    y: 110,
    portraitIdx: 2,
    dialogue: {
      greeting: "Yow! The city is loud today. Kwame on the decks! You look like you got rhythm.",
      options: [
        {
          text: 'Ask about the Azonto dance battle',
          response: "Head down to Labadi Beach! We have an epic dance battle going down right now on the sand. Go show them your moves!",
          relationshipDelta: 15,
          givesQuest: 'dance_battle'
        },
        {
          text: 'Talk about the latest Highlife & Afrobeats tracks',
          response: "Real music connects the soul, chale! From classic E.T. Mensah to current smash hits, Accra leads the world.",
          relationshipDelta: 10
        },
        {
          text: 'Ask for club VIP tickets',
          response: "I can put you on the VIP guestlist for East Legon club. Just make sure your energy and style are 100%!",
          relationshipDelta: 10
        }
      ]
    }
  },

  kojo: {
    id: 'kojo',
    name: 'Kojo',
    title: 'Jamestown Boxer',
    gender: 'male',
    styleOutfit: 0,
    locationId: 'jamestown',
    x: 100,
    y: 115,
    portraitIdx: 0,
    dialogue: {
      greeting: "Welcome to Jamestown! Where champions are born by the lighthouse. Stay tough, work hard!",
      options: [
        {
          text: 'Ask for boxing & stamina training',
          response: "Sweat builds true grit! Keep your guard up, stay focused, and your energy will never drain easily.",
          relationshipDelta: 15
        },
        {
          text: 'Ask about the historic British lighthouse',
          response: "Built decades ago, it guided ships across the Gulf of Guinea. Climb up to catch the best sunset in all of Ghana.",
          relationshipDelta: 10
        }
      ]
    }
  },

  kofi: {
    id: 'kofi',
    name: 'Kofi',
    title: 'Music Producer',
    gender: 'male',
    styleOutfit: 2,
    locationId: 'labadi_beach',
    x: 150,
    y: 110,
    portraitIdx: 3,
    dialogue: {
      greeting: "Chale! Relaxing by Labadi Beach catching some fresh inspiration for my new album. What you saying?",
      options: [
        {
          text: 'Play him your studio beat demo',
          response: "Yo!! That groove is heavy! The bassline is pure fire! You have serious talent in music production, chale!",
          relationshipDelta: 25,
          givesCash: 80,
          completesQuest: 'produce_hit'
        },
        {
          text: 'Buy fresh coconut water (GH₵ 10)',
          response: "Nothing beats cold coconut water on the beach. Instant energy boost!",
          relationshipDelta: 5,
          costCash: 10
        }
      ]
    }
  },

  abena: {
    id: 'abena',
    name: 'Abena',
    title: 'Corporate Banker',
    gender: 'female',
    styleOutfit: 2,
    locationId: 'east_legon_club',
    x: 160,
    y: 110,
    portraitIdx: 4,
    dialogue: {
      greeting: "Good evening! Celebrating a closed funding round tonight. Networking in Accra moves at lightning speed.",
      options: [
        {
          text: 'Discuss tech startups and MoMo Fintech',
          response: "Ghana is leading mobile money innovation! If you have financial discipline, you can build an empire here.",
          relationshipDelta: 20
        },
        {
          text: 'Toast a champagne flute with her (GH₵ 50)',
          response: "Cheers to success, good health, and big moves in Accra!",
          relationshipDelta: 25,
          costCash: 50
        }
      ]
    }
  },

  akosua: {
    id: 'akosua',
    name: 'Akosua',
    title: 'Media Influencer',
    gender: 'female',
    styleOutfit: 1,
    locationId: 'airport_city',
    x: 130,
    y: 110,
    portraitIdx: 5,
    dialogue: {
      greeting: "Hey superstar! Just wrapped a shoot in Airport City. The camera loves bold people!",
      options: [
        {
          text: 'Take a selfie together for Instagram',
          response: "Love your confidence! Tagged you. Your social clout in the city just went up 100 points!",
          relationshipDelta: 20
        },
        {
          text: 'Ask about career opportunities in media',
          response: "Always be authentic, show your unique Ghanaian flavor, and doors will open up everywhere.",
          relationshipDelta: 10
        }
      ]
    }
  },

  uncle_ebo: {
    id: 'uncle_ebo',
    name: 'Uncle Ebo',
    title: 'Chop Bar Master',
    gender: 'male',
    styleOutfit: 0,
    locationId: 'chop_bar',
    x: 175,
    y: 110,
    portraitIdx: 6,
    dialogue: {
      greeting: "Akwaaba, my child! Nobody leaves Uncle Ebo’s chop bar hungry. Ghana Jollof or rich Waakye?",
      options: [
        {
          text: 'Order a loaded plate of hot Ghana Jollof & Fried Plantain (GH₵ 25)',
          response: "Here is your plate! Rich, spicy, smoky, and made with love. Enjoy every bite, my child!",
          relationshipDelta: 15,
          costCash: 25,
          completesQuest: 'eat_local'
        },
        {
          text: 'Help out in the kitchen during the lunch rush (Job Shift)',
          response: "Eii, bless you! Tie your apron, let's get these hungry customers fed! You will earn good Cedis.",
          relationshipDelta: 20
        }
      ]
    }
  }
};
