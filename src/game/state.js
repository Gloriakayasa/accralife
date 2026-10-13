// Accra Life 3D - State Management & Player Economy Engine
// Reactive state with localStorage persistence and Cloud Firestore sync hooks

export class GameState {
    constructor() {
        this.listeners = [];
        this.data = this.loadInitialState();

        // Passive hunger / energy tick every 30 seconds
        setInterval(() => this.passiveStatTick(), 30000);
    }

    loadInitialState() {
        const saved = localStorage.getItem('accralife_save_v2');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Corrupt save, resetting state:', e);
            }
        }

        return {
            name: "Kwame",
            gender: "male",
            cedis: 500, // In-game cash
            gems: 25,   // Premium Gold Gems
            energy: 100, // 0 - 100
            hunger: 80,  // 0 - 100
            clout: 120,  // Reputation
            level: 1,
            title: "Osu Hustler",
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
            hasVIPPass: false
        };
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

    // --- Currency & Economy ---
    addCedis(amount) {
        this.data.cedis = Math.max(0, this.data.cedis + amount);
        this.addClout(Math.floor(amount * 0.1));
        this.save();
        return this.data.cedis;
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

    spendGems(amount) {
        if (this.data.gems < amount) return false;
        this.data.gems -= amount;
        this.save();
        return true;
    }

    // --- Stats & Energy ---
    useEnergy(amount) {
        if (this.data.hasVIPPass) return true; // VIPs have infinite energy
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
        this.data.hunger = Math.min(100, this.data.hunger + hungerGain);
        this.data.energy = Math.min(100, this.data.energy + energyGain);
        this.save();
    }

    addClout(amount) {
        this.data.clout += amount;
        // Level up checks
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

    // --- Lucky Wheel Daily Cooldown ---
    canSpinLuckyWheel() {
        const now = Date.now();
        const diff = now - (this.data.lastWheelSpinTime || 0);
        return diff >= 24 * 60 * 60 * 1000; // 24 hours
    }

    recordLuckyWheelSpin() {
        this.data.lastWheelSpinTime = Date.now();
        this.save();
    }
}

export const gameState = new GameState();
