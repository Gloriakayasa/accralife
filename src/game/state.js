// Accra Life - State Management & Full Life Simulation Engine (Lagos Life Clone)
// Features: Origins ("Borga Nepo" vs "Susu Hustler"), Trotro Transport Empire, Land Guards & Rent, Mayor of Accra

export const ORIGINS = {
    nepo: {
        id: 'nepo',
        title: "Borga / East Legon Nepo",
        emoji: "👶🏾💰",
        tagline: "Daddy knows ministers and Borgas.",
        perks: [
            "Fully furnished East Legon apartment — Daddy pays the rent",
            "Your own Mercedes-Benz 🚙 (just buy fuel)",
            "Branch Manager at Daddy's friend's FinTech bank from day one",
            "₵50,000 pocket money"
        ],
        startingCedis: 50000,
        startingClout: 850,
        startingGems: 100,
        housingId: 'east_legon_villa'
    },
    lapo: {
        id: 'lapo',
        title: "Susu / Jamestown Hustler",
        emoji: "🏦",
        tagline: "Self-made hits different, chale.",
        perks: [
            "₵6,000 Susu loan to start — repay ₵1,200 every week",
            "Hustle skill starts at Level 2",
            "You learn every skill 25% faster",
            "Start in a Jamestown compound room and work your way to East Legon"
        ],
        startingCedis: 6000,
        startingClout: 200,
        startingGems: 25,
        susuLoan: { total: 7200, weekly: 1200, remaining: 7200 },
        housingId: 'jamestown_room'
    }
};

export const TROTRO_MODELS = [
    { id: 'yellow_cab', name: 'Yellow-Orange Taxi', cost: 12000, baseTakings: 450, dailyFuel: 120, dues: 30, seats: 4 },
    { id: 'mercedes_207', name: "Mercedes 207 'Bones' Trotro", cost: 35000, baseTakings: 950, dailyFuel: 260, dues: 60, seats: 16 },
    { id: 'sprinter_bus', name: 'High-Roof Sprinter Trotro', cost: 85000, baseTakings: 2200, dailyFuel: 480, dues: 100, seats: 23 }
];

export const TROTRO_ROUTES = [
    { id: 'circle_kaneshie', name: 'Circle ⇄ Kaneshie Market', demand: 'Very High', multiplier: 1.1 },
    { id: 'accra_madina', name: 'Accra Central ⇄ Madina Zongo', demand: 'High', multiplier: 1.25 },
    { id: 'tema_osu', name: 'Tema Station ⇄ Osu Oxford Street', demand: 'Premium', multiplier: 1.4 },
    { id: 'lapaz_eastlegon', name: 'Lapaz ⇄ East Legon (A&C)', demand: 'Elite', multiplier: 1.6 }
];

export const ACCRA_HOUSING = [
    { id: 'jamestown_room', name: 'Jamestown Single Room', rent: 150, landlord: 'Agya Koo', desc: 'Compound house with communal water barrel. Humble beginnings.' },
    { id: 'madina_selfcontain', name: 'Madina Self-Contained', rent: 600, landlord: 'Madam Faustina', desc: 'Own toilet and bath, reliable prepaid ECG meter.' },
    { id: 'dansoman_flat', name: 'Dansoman 2-Bedroom Flat', rent: 1800, landlord: 'Alhaji Haruna', desc: 'Spacious balcony, fenced compound, water pump.' },
    { id: 'east_legon_villa', name: 'East Legon Executive Villa', rent: 8500, landlord: 'Chief Boateng', desc: 'Swimming pool, automated gate, backup standby generator for Dumsor.' },
    { id: 'airport_penthouse', name: 'Airport Residential Penthouse', rent: 25000, landlord: 'Gold Coast Realty', desc: 'Skyline view of Kotoka International Airport, private elevator, infinity pool.' }
];

export const MAYOR_POLICIES = [
    { id: 'free_trotro', label: 'Free Trotro Day', emoji: '🚌', effect: 'Public transport across Accra is free' },
    { id: 'waakye_subsidy', label: 'Waakye & Gob3 Subsidy', emoji: '🍛', effect: 'Street food and groceries are 30% cheaper' },
    { id: 'steady_light', label: 'Steady Light / No Dumsor', emoji: '💡', effect: 'ECG blackouts cancelled, business energy 100%' },
    { id: 'police_patrol', label: 'More Police Patrols', emoji: '👮🏾', effect: 'Protection around Osu & Circle is 30% stronger' }
];

export class GameState {
    constructor() {
        this.listeners = [];
        this.data = this.loadInitialState();

        // Passive hunger / energy tick every 30 seconds
        setInterval(() => this.passiveStatTick(), 30000);
    }

    loadInitialState() {
        const saved = localStorage.getItem('accralife_save_v2');
        let state = null;
        if (saved) {
            try {
                state = JSON.parse(saved);
            } catch (e) {
                console.warn('Corrupt save, resetting state:', e);
            }
        }

        if (!state) {
            state = {
                name: "Kwame",
                gender: "male",
                origin: null, // 'nepo' or 'lapo'
                cedis: 6000,
                gems: 25,
                energy: 100,
                hunger: 80,
                clout: 200,
                level: 1,
                title: "Accra Hustler",
                district: "osu",
                avatar: {
                    skinTone: 0x3d2314,
                    hairStyle: "braids",
                    hairColor: 0x111111,
                    outfit: "kente",
                    topColor: 0xf59e0b,
                    pantsColor: 0x1e293b,
                    shoesColor: 0xffffff,
                    accessories: ["sunglasses", "gold_chain"]
                },
                inventory: ["waakye", "kelewele"],
                unlockedOutfits: ["kente", "streetwear"],
                unlockedHairs: ["fade", "braids", "afro"],
                dailyStreak: 1,
                lastLoginDate: new Date().toDateString(),
                lastWheelSpinTime: 0,
                hasVIPPass: false,
                trotros: [],
                housing: {
                    id: 'jamestown_room',
                    name: 'Jamestown Single Room',
                    weeklyRent: 150,
                    rentDueDays: 7,
                    landlordName: 'Agya Koo',
                    paidAdvance: false
                },
                plots: [],
                mayor: {
                    currentMayor: {
                        username: '@KwameEastLegon',
                        title: 'Mayor of Accra',
                        message: 'Dumsor is cancelled this week! Waakye subsidies active in Osu!',
                        policy: 'waakye_subsidy',
                        weeklyAllowance: 25000
                    },
                    candidates: [
                        { name: '@KwameEastLegon', votes: 1420, policy: 'waakye_subsidy', slogan: 'More Waakye, Less Drama!' },
                        { name: '@NanaCircleBoss', votes: 980, policy: 'free_trotro', slogan: 'Free Trotros for all Chales!' },
                        { name: '@DrBoatengTech', votes: 760, policy: 'steady_light', slogan: '24/7 Power for Silicon Accra!' }
                    ],
                    playerVote: null
                },
                activePolicies: ['waakye_subsidy']
            };
        }

        // Ensure new properties exist on older save states
        if (!state.trotros) state.trotros = [];
        if (!state.housing) {
            state.housing = {
                id: 'jamestown_room',
                name: 'Jamestown Single Room',
                weeklyRent: 150,
                rentDueDays: 7,
                landlordName: 'Agya Koo',
                paidAdvance: false
            };
        }
        if (!state.plots) state.plots = [];
        if (!state.mayor) {
            state.mayor = {
                currentMayor: {
                    username: '@KwameEastLegon',
                    title: 'Mayor of Accra',
                    message: 'Dumsor is cancelled this week! Waakye subsidies active in Osu!',
                    policy: 'waakye_subsidy',
                    weeklyAllowance: 25000
                },
                candidates: [
                    { name: '@KwameEastLegon', votes: 1420, policy: 'waakye_subsidy', slogan: 'More Waakye, Less Drama!' },
                    { name: '@NanaCircleBoss', votes: 980, policy: 'free_trotro', slogan: 'Free Trotros for all Chales!' },
                    { name: '@DrBoatengTech', votes: 760, policy: 'steady_light', slogan: '24/7 Power for Silicon Accra!' }
                ],
                playerVote: null
            };
        }
        if (!state.activePolicies) state.activePolicies = ['waakye_subsidy'];

        if (!state.story) {
            state.story = {
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
        }

        return state;
    }

    save() {
        localStorage.setItem('accralife_save_v2', JSON.stringify(this.data));
        this.notify();
    }

    subscribe(fn) {
        this.listeners.push(fn);
        fn(this.data);
    }

    notify() {
        for (const fn of this.listeners) {
            fn(this.data);
        }
    }

    // --- ORIGIN SELECTION ("Borga Nepo" vs "Susu Hustler") ---
    chooseOrigin(originKey) {
        const origin = ORIGINS[originKey];
        if (!origin) return;

        this.data.origin = originKey;
        this.data.cedis = origin.startingCedis;
        this.data.clout = origin.startingClout;
        this.data.gems = origin.startingGems;

        if (originKey === 'nepo') {
            this.data.housing = {
                id: 'east_legon_villa',
                name: 'East Legon Executive Villa',
                weeklyRent: 0, // Daddy pays rent
                rentDueDays: 999,
                landlordName: "Daddy's Friend",
                paidAdvance: true
            };
            this.data.title = "East Legon Nepo";
            this.unlockOutfit('suit');
        } else {
            this.data.housing = {
                id: 'jamestown_room',
                name: 'Jamestown Single Room',
                weeklyRent: 150,
                rentDueDays: 7,
                landlordName: 'Agya Koo',
                paidAdvance: false
            };
            this.data.title = "Jamestown Hustler";
            this.data.susuLoan = { ...origin.susuLoan };
            this.unlockOutfit('streetwear');
        }

        this.save();
    }

    // --- TROTRO TRANSPORT EMPIRE ---
    buyTrotro(modelId, routeId, busName) {
        const model = TROTRO_MODELS.find(m => m.id === modelId);
        const route = TROTRO_ROUTES.find(r => r.id === routeId);
        if (!model || !route) return false;
        if (this.data.cedis < model.cost) return false;

        this.spendCedis(model.cost);
        const newTrotro = {
            id: 'trotro_' + Date.now(),
            modelId: model.id,
            modelName: model.name,
            routeId: route.id,
            routeName: route.name,
            customName: busName || `${model.name} (#${this.data.trotros.length + 1})`,
            condition: 100,
            takingsReady: Math.floor(model.baseTakings * route.multiplier),
            dailyFuel: model.dailyFuel,
            dues: model.dues,
            lastCollected: Date.now()
        };

        this.data.trotros.push(newTrotro);
        this.addClout(150);
        this.save();
        return true;
    }

    collectTrotroTakings(trotroId, multiplier = 1) {
        const trotro = this.data.trotros.find(t => t.id === trotroId);
        if (!trotro || trotro.takingsReady <= 0) return 0;

        const netTakings = Math.max(50, Math.floor((trotro.takingsReady - trotro.dailyFuel - trotro.dues) * multiplier));
        this.earnCedis(netTakings);
        this.addClout(35);

        // Wear and tear
        trotro.condition = Math.max(10, trotro.condition - 5);
        // Refresh takings pool
        const model = TROTRO_MODELS.find(m => m.id === trotro.modelId) || TROTRO_MODELS[0];
        const route = TROTRO_ROUTES.find(r => r.id === trotro.routeId) || TROTRO_ROUTES[0];
        trotro.takingsReady = Math.floor(model.baseTakings * route.multiplier * (trotro.condition / 100));
        trotro.lastCollected = Date.now();

        this.save();
        return netTakings;
    }

    repairTrotro(trotroId) {
        const trotro = this.data.trotros.find(t => t.id === trotroId);
        if (!trotro) return false;
        const repairCost = (100 - trotro.condition) * 20;
        if (this.data.cedis < repairCost) return false;

        this.spendCedis(repairCost);
        trotro.condition = 100;
        this.save();
        return true;
    }

    // --- HOUSING, RENT & LAND GUARDS ---
    payRent(twoYearsAdvance = false) {
        const prop = ACCRA_HOUSING.find(h => h.id === this.data.housing.id);
        if (!prop || prop.rent === 0) return true;

        const weeks = twoYearsAdvance ? 104 : 1;
        const totalCost = prop.rent * weeks;
        if (this.data.cedis < totalCost) return false;

        this.spendCedis(totalCost);
        this.data.housing.rentDueDays += (weeks * 7);
        if (twoYearsAdvance) {
            this.data.housing.paidAdvance = true;
            this.addClout(500);
        }
        this.save();
        return true;
    }

    upgradeHousing(housingId, twoYearsAdvance = false) {
        const prop = ACCRA_HOUSING.find(h => h.id === housingId);
        if (!prop) return false;

        const weeks = twoYearsAdvance ? 104 : 4; // 1 month deposit or 2 years advance
        const initialCost = prop.rent * weeks;
        if (this.data.cedis < initialCost) return false;

        this.spendCedis(initialCost);
        this.data.housing = {
            id: prop.id,
            name: prop.name,
            weeklyRent: prop.rent,
            rentDueDays: weeks * 7,
            landlordName: prop.landlord,
            paidAdvance: twoYearsAdvance
        };
        this.addClout(300);
        this.save();
        return true;
    }

    buyLandPlot(location, cost = 25000) {
        if (this.data.cedis < cost) return false;
        this.spendCedis(cost);
        const plot = {
            id: 'plot_' + Date.now(),
            location,
            cost,
            stage: 'foundation', // foundation -> blockwork -> roofing -> completed
            landGuardStatus: Math.random() < 0.4 ? 'disputed' : 'peaceful',
            progress: 25
        };
        this.data.plots.push(plot);
        this.addClout(400);
        this.save();
        return true;
    }

    settleLandGuards(plotId) {
        const plot = this.data.plots.find(p => p.id === plotId);
        if (!plot || plot.landGuardStatus !== 'disputed') return false;
        const settleCost = 3500;
        if (this.data.cedis < settleCost) return false;

        this.spendCedis(settleCost);
        plot.landGuardStatus = 'peaceful';
        this.save();
        return true;
    }

    advanceBuildingStage(plotId) {
        const plot = this.data.plots.find(p => p.id === plotId);
        if (!plot) return false;
        if (plot.landGuardStatus === 'disputed') return false;
        const stageCost = 8000;
        if (this.data.cedis < stageCost) return false;

        this.spendCedis(stageCost);
        if (plot.stage === 'foundation') {
            plot.stage = 'blockwork';
            plot.progress = 50;
        } else if (plot.stage === 'blockwork') {
            plot.stage = 'roofing';
            plot.progress = 75;
        } else if (plot.stage === 'roofing') {
            plot.stage = 'completed';
            plot.progress = 100;
            this.addClout(1200);
        }
        this.save();
        return true;
    }

    // --- MAYOR OF ACCRA ELECTIONS & CITY POLICIES ---
    voteForMayor(candidateName) {
        if (this.data.mayor.playerVote) return false;
        const cand = this.data.mayor.candidates.find(c => c.name === candidateName);
        if (cand) {
            cand.votes += 1;
            this.data.mayor.playerVote = candidateName;
            this.addClout(25);
            this.save();
            return true;
        }
        return false;
    }

    runForMayor(campaignMessage, policyId) {
        const filingFee = 10000;
        if (this.data.cedis < filingFee) return false;
        this.spendCedis(filingFee);

        const myCand = {
            name: '@' + this.data.name,
            votes: 50,
            policy: policyId,
            slogan: campaignMessage || 'For the people of Accra!'
        };
        this.data.mayor.candidates.unshift(myCand);
        this.data.mayor.playerVote = myCand.name;
        this.addClout(1000);
        this.save();
        return true;
    }

    // --- Currency & Economy ---
    addCedis(amount) {
        this.data.cedis = Math.max(0, this.data.cedis + amount);
        this.addClout(Math.floor(amount * 0.1));
        this.save();
        return this.data.cedis;
    }

    earnCedis(amount) {
        return this.addCedis(amount);
    }

    spendCedis(amount) {
        if (this.data.cedis < amount) return false;
        this.data.cedis -= amount;
        this.save();
        return true;
    }

    addGems(amount) {
        this.data.gems = Math.max(0, this.data.gems + amount);
        this.save();
        return this.data.gems;
    }

    earnGems(amount) {
        return this.addGems(amount);
    }

    spendGems(amount) {
        if (this.data.gems < amount) return false;
        this.data.gems -= amount;
        this.save();
        return true;
    }

    unlockOutfit(outfitId) {
        if (!this.data.unlockedOutfits.includes(outfitId)) {
            this.data.unlockedOutfits.push(outfitId);
            this.save();
        }
    }

    // --- Stats & Energy ---
    useEnergy(amount) {
        if (this.data.hasVIPPass) return true;
        if (this.data.energy < amount) return false;
        this.data.energy = Math.max(0, this.data.energy - amount);
        this.save();
        return true;
    }

    refillEnergy(amount = 100) {
        this.data.energy = Math.min(100, this.data.energy + amount);
        this.save();
    }

    feed(hungerGain, energyGain = 10) {
        // Waakye subsidy discount if active policy
        this.data.hunger = Math.min(100, this.data.hunger + hungerGain);
        this.data.energy = Math.min(100, this.data.energy + energyGain);
        this.save();
    }

    addClout(amount) {
        this.data.clout += amount;
        const newLevel = Math.floor(this.data.clout / 300) + 1;
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            if (this.data.level >= 5) this.data.title = "East Legon Boss";
            else if (this.data.level >= 3) this.data.title = "Airport Residential Baller";
            else this.data.title = "Osu Socialite";
        }
        this.save();
    }

    passiveStatTick() {
        if (this.data.hunger > 10) this.data.hunger -= 2;
        if (this.data.energy > 5 && !this.data.hasVIPPass) this.data.energy -= 1;
        this.save();
    }

    canSpinLuckyWheel() {
        const now = Date.now();
        const diff = now - (this.data.lastWheelSpinTime || 0);
        return diff >= 24 * 60 * 60 * 1000;
    }

    recordLuckyWheelSpin() {
        this.data.lastWheelSpinTime = Date.now();
        this.save();
    }
}

export const gameState = new GameState();
