// Accra Life 3D - Epic Narrative & Storyline Engine
// "From Osu Hustler to East Legon Mogul" - Multi-Chapter Ghanaian RPG Campaign that rivals Lagos Life!

import { gameState } from './state.js';
import { audio } from './audio.js';

export const STORY_CHAPTERS = [
    {
        id: 1,
        title: "The Osu Hustle",
        subtitle: "Street Cred & Survival",
        district: "osu",
        description: "Arrive in Osu with empty pockets. Earn Auntie Muni's trust, outwit the street loan shark Sly Nana, and make your Afrobeat debut at Bloom Bar!"
    },
    {
        id: 2,
        title: "The Bukom Pride",
        subtitle: "Jamestown Boxing & Heritage",
        district: "jamestown",
        description: "Step into historic Jamestown where boxing is religion. Train under veteran Coach Bukom, defeat 'The Bulldozer', and claim the Ga warrior boxing honor."
    },
    {
        id: 3,
        title: "The Golden Coast",
        subtitle: "Labadi Glamour & Romance",
        district: "labadi",
        description: "Enter high society at Labadi Beach. Win the heart of fashion influencer Serwaa, manage VIP beach cabanas, and host the massive 'Detty December' festival rave."
    },
    {
        id: 4,
        title: "Silicon Accra",
        subtitle: "East Legon FinTech Empire",
        district: "east_legon",
        description: "Partner with tech billionaire Dr. Kobby Boateng to launch ChalePay Mobile Money. Foil corporate sabotage by rival executive Anita and achieve IPO glory."
    },
    {
        id: 5,
        title: "The King of Accra",
        subtitle: "Penthouse Throne & Climax",
        district: "penthouse",
        description: "Move into your skyline luxury penthouse. Unite all 4 district factions to defeat Sly Nana's syndicate once and for all and be crowned the King of Accra!"
    }
];

export const STORY_QUESTS = {
    // === CHAPTER 1: THE OSU HUSTLE ===
    osu_arrival: {
        id: 'osu_arrival',
        chapter: 1,
        title: 'Arrival on Oxford Street',
        district: 'osu',
        targetNpc: 'auntie_muni',
        objectiveText: 'Talk to Auntie Muni at her Waakye Stall in Osu',
        reward: { cedis: 200, clout: 40, item: 'waakye' },
        dialogue: {
            speaker: "Auntie Muni",
            title: "Queen of Oxford Street Waakye",
            avatar: "🍛",
            lines: [
                "Akwaba, my child! Welcome to Osu Oxford Street! You look hungry and tired from your journey.",
                "In Accra, no one starves while Auntie Muni is cooking! Take this hot plate of Waakye with fried plantain, wele, and black shito pepper.",
                "Listen to me carefully: Accra is full of gold, but you must be sharp! That greedy boy 'Sly Nana' has been extorting everyone on this street. Stand tall, work hard, and never fear him."
            ],
            choices: [
                {
                    text: "Thank you Auntie Muni! I will make you proud and earn an honest living.",
                    affinity: 15,
                    consequence: "Auntie Muni smiles warmly and blesses your journey. (+15 Relationship)",
                    rewardDelta: { cedis: 50, clout: 15 }
                },
                {
                    text: "Tell me more about this Sly Nana. If he crosses me, we will settle it!",
                    affinity: 10,
                    consequence: "Auntie Muni chuckles at your bold fire. (+10 Clout)",
                    rewardDelta: { clout: 25 }
                }
            ]
        }
    },

    osu_shakedown: {
        id: 'osu_shakedown',
        chapter: 1,
        title: "Sly Nana's Threat",
        district: 'osu',
        targetNpc: 'sly_nana',
        objectiveText: 'Confront Sly Nana near Oxford Street corner',
        reward: { cedis: 350, clout: 80 },
        dialogue: {
            speaker: "Sly Nana",
            title: "Oxford Street Syndicate Boss",
            avatar: "🕶️",
            lines: [
                "Eii! Look at this new fish swimming in my waters! You think Oxford Street is free real estate, chale?",
                "Every hustler, vendor, and DJ pays Sly Nana a 300 Cedis street license fee every Friday. Pay up now, or my boys will make your stay in Osu very uncomfortable!"
            ],
            choices: [
                {
                    text: "[Street Wit] 'Auntie Muni's elder brother sits on the Ga Traditional Council. Touch me and your syndicate is finished!'",
                    affinity: -5,
                    consequence: "Sly Nana flinches! The Ga Council has serious power. He backs off with clenched teeth! (+100 Street Cred)",
                    rewardDelta: { clout: 100 }
                },
                {
                    text: "[Challenge] 'I don't pay extortion. Meet me at Bloom Bar tonight — if I out-dance your best guy, you leave Osu alone!'",
                    affinity: -10,
                    consequence: "Sly Nana smirks. 'Deal! DJ Switch will watch you embarrass yourself!' (+50 Clout)",
                    rewardDelta: { clout: 80, cedis: 100 }
                },
                {
                    text: "[Strategic MoMo Payoff] 'Take 50 Cedis MoMo peace token for now. Let's do business.'",
                    affinity: 10,
                    consequence: "Sly Nana pockets the MoMo transfer. You buy valuable time. (+50 Cedis bonus later)",
                    cost: 50,
                    rewardDelta: { clout: 20 }
                }
            ]
        }
    },

    osu_bloom_debut: {
        id: 'osu_bloom_debut',
        chapter: 1,
        title: 'Bloom Bar Afrobeat Debut',
        district: 'osu',
        targetNpc: 'dj_switch',
        objectiveText: 'Meet DJ Switch on the Bloom Bar DJ Stage & Perform Azonto',
        reward: { cedis: 500, clout: 150, unlockDistrict: 'jamestown' },
        dialogue: {
            speaker: "DJ Switch",
            title: "Bloom Bar Resident Virtuoso",
            avatar: "🎧",
            lines: [
                "Yoo chale! The crowd tonight at Bloom Bar is massive! Sly Nana told everyone you were coming to dance.",
                "The decks are loaded with heavy Amapiano and Ghanaian Highlife drums! Hop on the stage, hit that authentic Azonto groove, and let's shut down Oxford Street!"
            ],
            choices: [
                {
                    text: "[Burst into Azonto Groove!] 'Watch my footwork and elbow flick! Accra let's go!'",
                    affinity: 25,
                    consequence: "The Bloom Bar crowd erupts in cheers! Sly Nana's boys are silenced! You are the talk of Osu! (+150 Clout & Unlocked Jamestown)",
                    rewardDelta: { clout: 150, cedis: 200 }
                },
                {
                    text: "[Hypeman Style] 'Grab the mic and hype up the crowd before hitting the dance moves!'",
                    affinity: 20,
                    consequence: "DJ Switch scratches the turntables into frenzy! Oxford street goes wild! (+120 Clout)",
                    rewardDelta: { clout: 120, cedis: 150 }
                }
            ]
        }
    },

    // === CHAPTER 2: THE BUKOM PRIDE (JAMESTOWN) ===
    jamestown_gym: {
        id: 'jamestown_gym',
        chapter: 2,
        title: 'The Bukom Boxing Initiation',
        district: 'jamestown',
        targetNpc: 'coach_bukom',
        objectiveText: 'Travel to Jamestown and talk to Coach Bukom at the Boxing Ring',
        reward: { cedis: 400, clout: 100 },
        dialogue: {
            speaker: "Coach Bukom (Uncle Ebo)",
            title: "Ga Boxing Champion Trainer",
            avatar: "🥊",
            lines: [
                "Welcome to Jamestown, young blood. Here beneath the historic British lighthouse, we don't do fake talk.",
                "Azumah Nelson, Ike Quartey, Joshua Clottey — all world champions started right here in this Bukom dirt ring.",
                "If you want respect in Accra, you must show heart! My top fighter, Kpakpo 'The Bulldozer', thinks you're just another soft Osu party boy. Are you ready to spar?"
            ],
            choices: [
                {
                    text: "'Put the gloves on me Coach! I have Ga blood in my veins and fire in my heart.'",
                    affinity: 20,
                    consequence: "Coach Bukom nods with deep Ga warrior pride! (+20 Relationship, +80 Clout)",
                    rewardDelta: { clout: 80 }
                },
                {
                    text: "'I fight with brains and speed. The Bulldozer won't lay a glove on me.'",
                    affinity: 15,
                    consequence: "Coach grins. 'Speed is good, but keep your hands up!' (+60 Clout)",
                    rewardDelta: { clout: 60 }
                }
            ]
        }
    },

    jamestown_spar: {
        id: 'jamestown_spar',
        chapter: 2,
        title: 'Sparring The Bulldozer',
        district: 'jamestown',
        targetNpc: 'the_bulldozer',
        objectiveText: 'Step into the ring and defeat The Bulldozer',
        reward: { cedis: 750, clout: 250, outfitUnlock: 'batakari' },
        dialogue: {
            speaker: "The Bulldozer",
            title: "Reigning Champion of Bukom",
            avatar: "💪",
            lines: [
                "Hahaha! Look at this little insect Coach found on Oxford Street!",
                "In 30 seconds I will knock your sunglasses straight into the Gulf of Guinea! Protect yourself at all times!"
            ],
            choices: [
                {
                    text: "[Lightning Slip & Counter Hook] Duck under his wild right swing and deliver a precision liver punch!",
                    affinity: 30,
                    consequence: "BOOM! The Bulldozer gasps and drops to one knee! The gym falls dead silent, then erupts in thunderous roar! (+250 Clout & Northern Batakari Smock Unlocked!)",
                    rewardDelta: { clout: 250, cedis: 300 }
                },
                {
                    text: "[Ga Stamina Clinch] Absorb his power, wear him down on the ropes, and finish with a clean uppercut!",
                    affinity: 25,
                    consequence: "The Bulldozer tires out and concedes! Coach Bukom raises your hand as champion! (+200 Clout)",
                    rewardDelta: { clout: 200, cedis: 250 }
                }
            ]
        }
    },

    jamestown_lighthouse: {
        id: 'jamestown_lighthouse',
        chapter: 2,
        title: 'The Gulf of Guinea Secret',
        district: 'jamestown',
        targetNpc: 'coach_bukom',
        objectiveText: 'Meet Coach Bukom at the Lighthouse to meet your secret admirer',
        reward: { cedis: 600, clout: 180, unlockDistrict: 'labadi' },
        dialogue: {
            speaker: "Coach Bukom",
            title: "Ga Boxing Champion Trainer",
            avatar: "⚓",
            lines: [
                "Incredible fight, champion! You've brought real honor to Jamestown today.",
                "Someone very influential was watching you from the lighthouse balcony. Her name is Serwaa — she's a top fashion and music executive from London and East Legon.",
                "She wants to meet you at Labadi Beach tonight for an exclusive VIP cocktail. Get down to the coast, dress sharp, and don't be late!"
            ],
            choices: [
                {
                    text: "'Thank you Coach! Jamestown will always be my home and fortress.'",
                    affinity: 20,
                    consequence: "Coach Bukom hands you a victory purse. Fast travel to Labadi Beach is now unlocked! (+180 Clout)",
                    rewardDelta: { clout: 180, cedis: 200 }
                }
            ]
        }
    },

    // === CHAPTER 3: THE GOLDEN COAST (LABADI BEACH) ===
    labadi_vip: {
        id: 'labadi_vip',
        chapter: 3,
        title: 'Labadi VIP Beach Lounge',
        district: 'labadi',
        targetNpc: 'serwaa',
        objectiveText: 'Meet Serwaa at the Coconut Cocktail Bar in Labadi Beach',
        reward: { cedis: 800, clout: 220 },
        dialogue: {
            speaker: "Serwaa",
            title: "High Society Influencer & Executive",
            avatar: "💎",
            lines: [
                "Well, well... the Bukom boxing champion has arrived in style! You look even sharper in person than in the ring.",
                "Accra has plenty of talkers, but very few people with real grit, rhythm, and vision. I've been looking for someone genuine to partner with on big projects across Ghana.",
                "Tell me the truth: what drives you? Are you here just for temporary Cedis, or to build a real legacy in this city?"
            ],
            choices: [
                {
                    text: "[Sincere Ambition] 'I started with empty pockets in Osu. I'm here to build a legacy that empowers our people.'",
                    affinity: 25,
                    consequence: "Serwaa looks into your eyes with genuine admiration. (+25 Serwaa Affinity, +150 Clout)",
                    rewardDelta: { clout: 150, cedis: 200 }
                },
                {
                    text: "[Charming Hustler] 'I want the best of everything — the luxury penthouse, the tech empire, and you by my side.'",
                    affinity: 20,
                    consequence: "Serwaa laughs playfully and sips her fresh coconut drink. 'Bold words! Let's see if you can back them up.' (+20 Affinity)",
                    rewardDelta: { clout: 120, cedis: 150 }
                }
            ]
        }
    },

    labadi_romance: {
        id: 'labadi_romance',
        chapter: 3,
        title: 'Sunset on the Gulf of Guinea',
        district: 'labadi',
        targetNpc: 'serwaa',
        objectiveText: 'Walk along the Labadi Boardwalk with Serwaa at sunset',
        reward: { cedis: 1000, clout: 280 },
        dialogue: {
            speaker: "Serwaa",
            title: "High Society Influencer & Executive",
            avatar: "🌅",
            lines: [
                "Look at this ocean horizon... nothing beats sunset in Accra with the warm breeze.",
                "Chief Mensah and his corrupt resort syndicate have been trying to bully me into selling my beach festival permits.",
                "With you beside me, I feel unstoppable. Will you stand with me to host the greatest 'Detty December' festival this city has ever witnessed?"
            ],
            choices: [
                {
                    text: "[Take Her Hand] 'Chief Mensah will never touch a single permit of yours. We run this festival together.'",
                    affinity: 35,
                    consequence: "Serwaa holds your hand tightly. Relationship reaches 'Devoted Partners' level! (+35 Affinity, +200 Clout)",
                    rewardDelta: { clout: 200, cedis: 300 }
                },
                {
                    text: "[Master Strategist] 'We will invite the international diaspora and make this festival so big that no one can touch us.'",
                    affinity: 30,
                    consequence: "Serwaa is impressed by your strategic foresight! (+30 Affinity, +250 Clout)",
                    rewardDelta: { clout: 250, cedis: 300 }
                }
            ]
        }
    },

    labadi_rave: {
        id: 'labadi_rave',
        chapter: 3,
        title: 'Detty December Beach Rave',
        district: 'labadi',
        targetNpc: 'serwaa',
        objectiveText: 'Host the Beach Festival Rave & Perform the Kupe Slide',
        reward: { cedis: 1500, clout: 350, unlockDistrict: 'east_legon' },
        dialogue: {
            speaker: "Serwaa",
            title: "High Society Influencer & Executive",
            avatar: "🎉",
            lines: [
                "The festival is completely SOLD OUT! Over five thousand people on the sand with neon lights, bonfire, and coconut cocktails!",
                "DJ Switch just dropped the headline Afrobeat anthem! Grab the center stage, bust out the Kupe Slide, and let's make history!"
            ],
            choices: [
                {
                    text: "[Execute Flawless Kupe Slide!] Slide across the beach sand in perfect sync with the rhythm!",
                    affinity: 30,
                    consequence: "Fireworks light up the Atlantic night sky! You are officially an Accra Celebrity! (+350 Clout & East Legon Unlocked!)",
                    rewardDelta: { clout: 350, cedis: 500 }
                }
            ]
        }
    },

    // === CHAPTER 4: SILICON ACCRA (EAST LEGON) ===
    east_legon_fintech: {
        id: 'east_legon_fintech',
        chapter: 4,
        title: 'The ChalePay Unicorn',
        district: 'east_legon',
        targetNpc: 'dr_kobby',
        objectiveText: 'Travel to East Legon & Meet Dr. Kobby Boateng at the Tech Hub',
        reward: { cedis: 1800, clout: 300 },
        dialogue: {
            speaker: "Dr. Kobby Boateng",
            title: "FinTech Tycoon & Founder of ChalePay",
            avatar: "💻",
            lines: [
                "Serwaa has told me extraordinary things about you! Welcome to East Legon, my friend.",
                "Here at ChalePay, we are building the fastest mobile money payment gateway across West Africa. We connect MTN MoMo, Telecel Cash, and bank cards in sub-second settlements.",
                "Silicon Valley investors are flying in this week with a 50 Million Dollar term sheet. I need a co-founder with real street connections and unmatched hustle to lead the consumer rollout. Are you in?"
            ],
            choices: [
                {
                    text: "[Accept Co-Founder Role] 'I know what the streets need from Osu to Kumasi. Let's build the biggest FinTech in Africa.'",
                    affinity: 25,
                    consequence: "Dr. Kobby shakes your hand firmly and grants you equity shares in ChalePay! (+25 Affinity, +300 Clout)",
                    rewardDelta: { clout: 300, cedis: 800 }
                },
                {
                    text: "[Tech Innovation] 'Let's integrate instant QR payments for market mummies and street food vendors too!'",
                    affinity: 30,
                    consequence: "Dr. Kobby's eyes light up! 'Brilliant! Financial inclusion is our secret weapon!' (+30 Affinity, +400 Clout)",
                    rewardDelta: { clout: 400, cedis: 1000 }
                }
            ]
        }
    },

    east_legon_sabotage: {
        id: 'east_legon_sabotage',
        chapter: 4,
        title: 'Corporate Espionage',
        district: 'east_legon',
        targetNpc: 'dr_kobby',
        objectiveText: 'Expose rogue executive Anita at the East Legon Tech Hub Desk',
        reward: { cedis: 2500, clout: 450, outfitUnlock: 'suit' },
        dialogue: {
            speaker: "Dr. Kobby Boateng",
            title: "FinTech Tycoon & Founder of ChalePay",
            avatar: "🚨",
            lines: [
                "Chale, we have an emergency! Our server audit flagged unauthorized transactions siphoning MoMo reserves to an offshore Cayman account.",
                "It's Anita, our VP of Operations! She's secretly partnered with none other than Sly Nana's syndicate to sabotage our launch!",
                "She's at the poolside desk right now attempting to delete the audit logs. We must act immediately!"
            ],
            choices: [
                {
                    text: "[Cyber Freeze] Lock down the admin credentials and freeze her illicit offshore wallet on the blockchain!",
                    affinity: 30,
                    consequence: "Access revoked! All stolen funds recovered! Anita is caught red-handed! (+450 Clout & Luxury CEO Blazer Unlocked!)",
                    rewardDelta: { clout: 450, cedis: 1200 }
                },
                {
                    text: "[Legal Confrontation] Present the cryptographic audit trail directly to the board and police authorities!",
                    affinity: 25,
                    consequence: "Anita breaks down in tears and surrenders all passwords. ChalePay is saved! (+400 Clout)",
                    rewardDelta: { clout: 400, cedis: 1000 }
                }
            ]
        }
    },

    east_legon_launch: {
        id: 'east_legon_launch',
        chapter: 4,
        title: 'The Billion Cedi IPO',
        district: 'east_legon',
        targetNpc: 'dr_kobby',
        objectiveText: 'Celebrate the ChalePay Launch Poolside in East Legon',
        reward: { cedis: 3500, clout: 600, unlockDistrict: 'penthouse' },
        dialogue: {
            speaker: "Dr. Kobby Boateng",
            title: "FinTech Tycoon & Founder of ChalePay",
            avatar: "🍾",
            lines: [
                "WE DID IT! ChalePay just processed over 100 Million Cedis on launch day! We are officially a Ghanaian Tech Unicorn!",
                "The board voted unanimously: as Managing Co-Founder, you've earned your rightful place at the pinnacle of this country.",
                "Here are the keys to the top-floor Penthouse Suite in Airport City overlooking all of Accra. You've earned it, my brother!"
            ],
            choices: [
                {
                    text: "[Accept the Penthouse Keys] 'From an empty pocket in Osu to the skyline of Accra... we are just getting started!'",
                    affinity: 35,
                    consequence: "Champagne corks pop poolside in East Legon! Title upgraded to 'East Legon Boss'! (+600 Clout & Unlocked Penthouse!)",
                    rewardDelta: { clout: 600, cedis: 2000 }
                }
            ]
        }
    },

    // === CHAPTER 5: THE KING OF ACCRA (PENTHOUSE) ===
    penthouse_takeover: {
        id: 'penthouse_takeover',
        chapter: 5,
        title: 'Keys to the Skyline',
        district: 'penthouse',
        targetNpc: 'serwaa',
        objectiveText: 'Enter your Penthouse & Rest on your VIP Master Bed',
        reward: { cedis: 3000, clout: 500 },
        dialogue: {
            speaker: "Serwaa",
            title: "Your High Society Partner",
            avatar: "👑",
            lines: [
                "Welcome home, my love! Look out that panoramic glass window — all of Accra is glowing below you.",
                "From the lights of Oxford Street to the ocean waves of Labadi, everyone knows your name now.",
                "Take a deep rest on your king-size bed to fully restore your energy. But be ready — word on the street is that Sly Nana is desperate and plotting one final move."
            ],
            choices: [
                {
                    text: "'Let him come. With you, Auntie Muni, Coach Bukom, and Dr. Kobby behind me, nothing can shake us.'",
                    affinity: 30,
                    consequence: "Serwaa smiles with complete confidence in you. Energy fully restored to 100%! (+500 Clout)",
                    rewardDelta: { clout: 500, cedis: 1000 }
                }
            ]
        }
    },

    penthouse_showdown: {
        id: 'penthouse_showdown',
        chapter: 5,
        title: 'The Grand Showdown',
        district: 'penthouse',
        targetNpc: 'sly_nana',
        objectiveText: 'Confront Sly Nana at the Penthouse Skyline Suite',
        reward: { cedis: 5000, clout: 1000, outfitUnlock: 'kente' },
        dialogue: {
            speaker: "Sly Nana",
            title: "Defeated Syndicate Leader",
            avatar: "⚡",
            lines: [
                "Eii Kwame! How did an ordinary street boy from Osu take over this entire city?!",
                "I controlled the streets for ten years! Now Auntie Muni laughs at me, Coach Bukom barred my thugs from Jamestown, and your ChalePay app cut off all our extortion money!",
                "I came here with my last boys to end this... but Coach Bukom, Dr. Kobby, and the police already surrounded the building. What are you going to do with me?"
            ],
            choices: [
                {
                    text: "[Merciful Mogul] 'I don't need revenge. Disband your gang and work as Head of Security & Logistics for ChalePay.'",
                    affinity: 40,
                    consequence: "Sly Nana drops to his knees in profound gratitude! He pledges lifelong loyalty to you! (+1,000 Clout, Karma: Saint of Accra)",
                    rewardDelta: { clout: 1000, cedis: 2500 }
                },
                {
                    text: "[Ga Justice] 'Hand him over to the Ga Council and the Police. The streets of Accra belong to honest hustlers now!'",
                    affinity: 35,
                    consequence: "Sly Nana is marched away in handcuffs! Osu and Jamestown celebrate in the streets! (+1,000 Clout, Karma: Enforcer of Law)",
                    rewardDelta: { clout: 1000, cedis: 2500 }
                }
            ]
        }
    },

    penthouse_gala: {
        id: 'penthouse_gala',
        chapter: 5,
        title: 'The Mogul Victory Gala',
        district: 'penthouse',
        targetNpc: 'serwaa',
        objectiveText: 'Host the Grand Victory Gala & Dance Azonto with your Allies',
        reward: { cedis: 10000, clout: 2000, gems: 100 },
        dialogue: {
            speaker: "Serwaa & Allies",
            title: "The United Council of Accra",
            avatar: "🏆",
            lines: [
                "Auntie Muni, DJ Switch, Coach Bukom, The Bulldozer, Dr. Kobby, and Serwaa all raise their glasses to you!",
                "'To Kwame! The undisputed King of Accra! 👑🇬🇭'",
                "You arrived with 50 Cedis in your pocket and conquered the streets with heart, rhythm, and vision! The entire city of Accra is yours!"
            ],
            choices: [
                {
                    text: "[Raise the Golden Glass & Dance!] 'For Accra! For Ghana! We reign forever!'",
                    affinity: 50,
                    consequence: "YOU HAVE CONQUERED ACCRA LIFE! Crowned 'King of Accra', +10,000 Cedis, +100 Gold Gems, and 2x Permanent Multiplier Unlocked!",
                    rewardDelta: { clout: 2000, cedis: 10000, gems: 100 }
                }
            ]
        }
    }
};

export class StoryManager {
    constructor() {
        this.initStoryState();
    }

    initStoryState() {
        if (!gameState.data.story) {
            gameState.data.story = {
                chapter: 1,
                currentQuestId: 'osu_arrival',
                completedQuests: [],
                relationships: {
                    auntie_muni: 15,
                    dj_switch: 5,
                    sly_nana: -10,
                    coach_bukom: 0,
                    the_bulldozer: -20,
                    serwaa: 0,
                    dr_kobby: 0
                },
                choices: {}
            };
            gameState.save();
        }
    }

    getCurrentQuest() {
        const questId = gameState.data.story.currentQuestId;
        return STORY_QUESTS[questId] || null;
    }

    getCurrentChapter() {
        const chNum = gameState.data.story.chapter || 1;
        return STORY_CHAPTERS.find(c => c.id === chNum) || STORY_CHAPTERS[0];
    }

    getQuestOrder() {
        return [
            'osu_arrival', 'osu_shakedown', 'osu_bloom_debut',
            'jamestown_gym', 'jamestown_spar', 'jamestown_lighthouse',
            'labadi_vip', 'labadi_romance', 'labadi_rave',
            'east_legon_fintech', 'east_legon_sabotage', 'east_legon_launch',
            'penthouse_takeover', 'penthouse_showdown', 'penthouse_gala'
        ];
    }

    isNpcQuestTarget(npcId) {
        const q = this.getCurrentQuest();
        return q && q.targetNpc === npcId;
    }

    completeQuest(questId, choiceDelta = {}) {
        const quest = STORY_QUESTS[questId];
        if (!quest) return;

        // Apply base rewards
        if (quest.reward.cedis) gameState.earnCedis(quest.reward.cedis);
        if (quest.reward.clout) gameState.addClout(quest.reward.clout);
        if (quest.reward.gems) gameState.earnGems(quest.reward.gems);
        if (quest.reward.outfitUnlock) gameState.unlockOutfit(quest.reward.outfitUnlock);

        // Apply choice deltas
        if (choiceDelta.cedis) gameState.earnCedis(choiceDelta.cedis);
        if (choiceDelta.clout) gameState.addClout(choiceDelta.clout);
        if (choiceDelta.gems) gameState.earnGems(choiceDelta.gems);

        // Record completion
        if (!gameState.data.story.completedQuests.includes(questId)) {
            gameState.data.story.completedQuests.push(questId);
        }

        // Advance to next quest
        const order = this.getQuestOrder();
        const currIdx = order.indexOf(questId);
        if (currIdx !== -1 && currIdx < order.length - 1) {
            const nextQuestId = order[currIdx + 1];
            gameState.data.story.currentQuestId = nextQuestId;
            const nextQ = STORY_QUESTS[nextQuestId];
            if (nextQ && nextQ.chapter > gameState.data.story.chapter) {
                gameState.data.story.chapter = nextQ.chapter;
            }
        }

        audio.playLevelUp();
        gameState.save();
    }
}

export const storyEngine = new StoryManager();
