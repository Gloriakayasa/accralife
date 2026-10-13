// Accra Life 3D - User Interface & Touch Joystick Engine
// Glassmorphic HUD, Touch Controls, Travel Navigator, Wardrobe, Lucky Wheel, and Gig Modals

import { gameState } from './state.js';
import { audio } from './audio.js';
import { monetization } from './monetization.js';
import { storyEngine, STORY_CHAPTERS, STORY_QUESTS } from './story.js';

export class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.joystick = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
        this.initHUD();
        this.initJoystick();
        this.initEventListeners();

        // Subscribe to game state updates
        gameState.subscribe((data) => this.renderHUD(data));
    }

    initHUD() {
        // Find or create UI container
        let hud = document.getElementById('game-hud');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'game-hud';
            document.body.appendChild(hud);
        }

        hud.innerHTML = `
            <!-- Top Navigation & Stats Bar -->
            <header id="hud-top">
                <div class="hud-profile" onclick="window.ui.openWardrobe()">
                    <div class="profile-avatar-circle" id="hud-avatar-circle">🇬🇭</div>
                    <div class="profile-info">
                        <div class="profile-name" id="hud-player-name">Kwame</div>
                        <div class="profile-title" id="hud-player-title">Osu Hustler • Lv.1</div>
                    </div>
                </div>

                <!-- Stats Meters -->
                <div class="hud-meters">
                    <div class="meter-group" title="Energy - Needed for work & dancing">
                        <div class="meter-label">⚡ <span id="hud-energy-val">100%</span></div>
                        <div class="meter-bar"><div id="hud-energy-fill" class="meter-fill energy" style="width: 100%;"></div></div>
                        <button class="meter-plus-btn" onclick="window.ui.triggerEnergyRefill()">+</button>
                    </div>

                    <div class="meter-group" title="Hunger - Eat Waakye or Kelewele to replenish">
                        <div class="meter-label">🍔 <span id="hud-hunger-val">80%</span></div>
                        <div class="meter-bar"><div id="hud-hunger-fill" class="meter-fill hunger" style="width: 80%;"></div></div>
                        <button class="meter-plus-btn" onclick="window.ui.triggerFoodPrompt()">+</button>
                    </div>

                    <div class="meter-group" title="Clout - Respect across Accra">
                        <div class="meter-label">✨ <span id="hud-clout-val">120</span></div>
                        <div class="meter-bar"><div id="hud-clout-fill" class="meter-fill clout" style="width: 40%;"></div></div>
                    </div>
                </div>

                <!-- Currencies & Store Buttons -->
                <div class="hud-currencies">
                    <div class="currency-pill cedis" onclick="window.ui.openMoMoShop()">
                        <span class="currency-icon">🪙</span>
                        <span id="hud-cedis-val">₵500</span>
                        <span class="currency-add">+</span>
                    </div>

                    <div class="currency-pill gems" onclick="window.ui.openMoMoShop()">
                        <span class="currency-icon">💎</span>
                        <span id="hud-gems-val">25</span>
                        <span class="currency-add">+</span>
                    </div>

                    <!-- Rewarded Ad Quick Cash Pill -->
                    <button class="hud-ad-btn" onclick="window.ui.triggerQuickAdCash()" title="Watch 6s Video for Free ₵100 Cedis">
                        📺 +₵100
                    </button>

                    <!-- Lucky Wheel Pill -->
                    <button class="hud-wheel-btn" onclick="window.ui.openLuckyWheel()" title="Daily Accra Lucky Wheel">
                        🎡 Spin
                    </button>

                    <!-- Audio Mute Pill -->
                    <button class="hud-icon-btn" id="hud-audio-btn" onclick="window.ui.toggleAudio()" title="Afrobeats Music">
                        🔊
                    </button>

                    <!-- Account Pill -->
                    <button class="hud-icon-btn" onclick="window.ui.openAccountModal()" title="Cloud Save">
                        👤
                    </button>
                </div>
            </header>

            <!-- Floating Story Objective Widget -->
            <div id="hud-story-widget" onclick="window.ui.openStoryJournal()" title="Click to view Accra Campaign Journal">
                <div class="story-widget-header">
                    <span class="story-widget-badge" id="story-ch-badge">📜 Ch. 1: The Osu Hustle</span>
                    <span class="story-widget-tap">Journal ›</span>
                </div>
                <div class="story-widget-title" id="story-quest-title">👉 Arrival on Oxford Street</div>
                <div class="story-widget-sub" id="story-quest-objective">Talk to Auntie Muni at Waakye Stall</div>
            </div>

            <!-- Bottom Floating Action Navigation Dock -->
            <nav id="hud-dock">
                <button class="dock-btn" onclick="window.ui.openTravelModal()">
                    <span class="dock-icon">🗺️</span>
                    <span class="dock-text">Travel</span>
                </button>

                <button class="dock-btn dock-btn-story" onclick="window.ui.openStoryJournal()">
                    <span class="dock-icon">📜</span>
                    <span class="dock-text">Story</span>
                </button>

                <button class="dock-btn" onclick="window.ui.triggerDanceMenu()">
                    <span class="dock-icon">🕺</span>
                    <span class="dock-text">Azonto</span>
                </button>

                <button class="dock-btn dock-btn-work" onclick="window.ui.triggerCurrentGig()">
                    <span class="dock-icon">💼</span>
                    <span class="dock-text">Work Gig</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openWardrobe()">
                    <span class="dock-icon">👗</span>
                    <span class="dock-text">Drip Shop</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openChatModal()">
                    <span class="dock-icon">💬</span>
                    <span class="dock-text">Chat</span>
                </button>
            </nav>

            <!-- Virtual Analog Joystick for Mobile Phones -->
            <div id="virtual-joystick-zone">
                <div id="joystick-base">
                    <div id="joystick-knob"></div>
                </div>
            </div>

            <!-- Modals Container -->
            <div id="modals-root"></div>
        `;
    }

    renderHUD(data) {
        document.getElementById('hud-player-name').textContent = data.name;
        document.getElementById('hud-player-title').textContent = `${data.title} • Lv.${data.level}`;

        document.getElementById('hud-energy-val').textContent = `${data.energy}%`;
        document.getElementById('hud-energy-fill').style.width = `${data.energy}%`;

        document.getElementById('hud-hunger-val').textContent = `${data.hunger}%`;
        document.getElementById('hud-hunger-fill').style.width = `${data.hunger}%`;

        document.getElementById('hud-clout-val').textContent = `${data.clout}`;
        const cloutPct = Math.min(100, (data.clout % 300) / 3);
        document.getElementById('hud-clout-fill').style.width = `${cloutPct}%`;

        document.getElementById('hud-cedis-val').textContent = `₵${data.cedis.toLocaleString()}`;
        document.getElementById('hud-gems-val').textContent = `${data.gems}`;

        // Update Story Objective Tracker
        const currQuest = storyEngine.getCurrentQuest();
        const currCh = storyEngine.getCurrentChapter();
        const widgetBadge = document.getElementById('story-ch-badge');
        const widgetTitle = document.getElementById('story-quest-title');
        const widgetObj = document.getElementById('story-quest-objective');
        if (widgetBadge && currCh) widgetBadge.textContent = `📜 Ch. ${currCh.id}: ${currCh.title}`;
        if (widgetTitle && currQuest) widgetTitle.textContent = `👉 ${currQuest.title}`;
        if (widgetObj && currQuest) widgetObj.textContent = currQuest.objectiveText;
    }

    // --- Virtual Touch Joystick (Mobile 360-degree analog controls) ---
    initJoystick() {
        const zone = document.getElementById('virtual-joystick-zone');
        const base = document.getElementById('joystick-base');
        const knob = document.getElementById('joystick-knob');
        if (!zone || !base || !knob) return;

        const maxDistance = 45;

        const handleStart = (clientX, clientY) => {
            const rect = base.getBoundingClientRect();
            this.joystick.startX = rect.left + rect.width / 2;
            this.joystick.startY = rect.top + rect.height / 2;
            this.joystick.active = true;
            audio.unlock();
            handleMove(clientX, clientY);
        };

        const handleMove = (clientX, clientY) => {
            if (!this.joystick.active) return;
            const dx = clientX - this.joystick.startX;
            const dy = clientY - this.joystick.startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            const clampedDist = Math.min(dist, maxDistance);
            const knobX = Math.cos(angle) * clampedDist;
            const knobY = Math.sin(angle) * clampedDist;

            knob.style.transform = `translate(${knobX}px, ${knobY}px)`;

            // Normalized direction vector (-1 to 1)
            this.joystick.x = knobX / maxDistance;
            this.joystick.y = knobY / maxDistance;

            if (this.engine) {
                this.engine.setMoveInput(this.joystick.x, this.joystick.y);
            }
        };

        const handleEnd = () => {
            this.joystick.active = false;
            this.joystick.x = 0;
            this.joystick.y = 0;
            knob.style.transform = `translate(0px, 0px)`;
            if (this.engine) {
                this.engine.setMoveInput(0, 0);
            }
        };

        zone.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
            e.preventDefault();
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
            e.preventDefault();
        }, { passive: false });

        zone.addEventListener('touchend', handleEnd);
        zone.addEventListener('touchcancel', handleEnd);

        // Mouse drag fallback for desktop testing
        zone.addEventListener('mousedown', (e) => {
            handleStart(e.clientX, e.clientY);
            const onMouseMove = (ev) => handleMove(ev.clientX, ev.clientY);
            const onMouseUp = () => {
                handleEnd();
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    initEventListeners() {
        // Keyboard controls (WASD & Arrow Keys)
        const keys = { w: false, a: false, s: false, d: false };
        const updateKeyboardMove = () => {
            let x = 0, y = 0;
            if (keys.w || keys.ArrowUp) y -= 1;
            if (keys.s || keys.ArrowDown) y += 1;
            if (keys.a || keys.ArrowLeft) x -= 1;
            if (keys.d || keys.ArrowRight) x += 1;

            if (this.engine && !this.joystick.active) {
                this.engine.setMoveInput(x, y);
            }
        };

        window.addEventListener('keydown', (e) => {
            audio.unlock();
            const k = e.key.toLowerCase();
            if (keys.hasOwnProperty(k) || e.key.startsWith('Arrow')) {
                keys[k] = true;
                keys[e.key] = true;
                updateKeyboardMove();
            }
        });

        window.addEventListener('keyup', (e) => {
            const k = e.key.toLowerCase();
            if (keys.hasOwnProperty(k) || e.key.startsWith('Arrow')) {
                keys[k] = false;
                keys[e.key] = false;
                updateKeyboardMove();
            }
        });
    }

    toggleAudio() {
        const isMuted = audio.toggleMute();
        const btn = document.getElementById('hud-audio-btn');
        btn.textContent = isMuted ? '🔇' : '🔊';
    }

    // --- MODAL: TRAVEL LOCATIONS (Osu, East Legon, Labadi, Jamestown, Penthouse) ---
    openTravelModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>🗺️ Explore Accra Districts</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="travel-grid">
                        <div class="travel-card ${this.engine.world.currentDistrict === 'osu' ? 'active' : ''}" onclick="window.ui.switchLocation('osu')">
                            <div class="travel-img">🌆</div>
                            <div class="travel-title">Osu Oxford Street</div>
                            <div class="travel-desc">Bloom Bar, Afrobeats DJ stage, Chofi & Waakye street stalls</div>
                        </div>

                        <div class="travel-card ${this.engine.world.currentDistrict === 'east_legon' ? 'active' : ''}" onclick="window.ui.switchLocation('east_legon')">
                            <div class="travel-img">🏰</div>
                            <div class="travel-title">East Legon Luxury</div>
                            <div class="travel-desc">Luxury Mansions, Tech Startups, swimming pools, high-yield gigs</div>
                        </div>

                        <div class="travel-card ${this.engine.world.currentDistrict === 'labadi' ? 'active' : ''}" onclick="window.ui.switchLocation('labadi')">
                            <div class="travel-img">🏖️</div>
                            <div class="travel-title">Labadi Beach</div>
                            <div class="travel-desc">Ocean waves, coconut cocktails, beach volleyball, relaxation</div>
                        </div>

                        <div class="travel-card ${this.engine.world.currentDistrict === 'jamestown' ? 'active' : ''}" onclick="window.ui.switchLocation('jamestown')">
                            <div class="travel-img">⚓</div>
                            <div class="travel-title">Jamestown & Lighthouse</div>
                            <div class="travel-desc">Bukom boxing arena, cultural heritage, historic red lighthouse</div>
                        </div>

                        <div class="travel-card ${this.engine.world.currentDistrict === 'penthouse' ? 'active' : ''}" onclick="window.ui.switchLocation('penthouse')">
                            <div class="travel-img">🛋️</div>
                            <div class="travel-title">My Luxury Penthouse</div>
                            <div class="travel-desc">VIP Master bed, private wardrobe closet, skyline balcony</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    switchLocation(districtId) {
        audio.playTap();
        document.querySelector('.modal-overlay')?.remove();
        if (this.engine) {
            this.engine.loadDistrict(districtId);
            gameState.data.district = districtId;
            gameState.save();
        }
    }

    // --- MODAL: WORK GIG & SALARY MULTIPLIER (HIGH EARNING MONETIZATION) ---
    triggerCurrentGig() {
        const district = this.engine.world.currentDistrict;
        let job = { title: "Street Food Vendor", basePay: 150, energyCost: 20 };

        if (district === 'osu') {
            job = { title: "🎧 Bloom Bar Afrobeats DJ", basePay: 250, energyCost: 25 };
        } else if (district === 'east_legon') {
            job = { title: "💻 East Legon Tech Engineer", basePay: 450, energyCost: 35 };
        } else if (district === 'jamestown') {
            job = { title: "🥊 Bukom Boxing Champion Spar", basePay: 350, energyCost: 30 };
        } else if (district === 'labadi') {
            job = { title: "🍹 Beach Club Bartender", basePay: 200, energyCost: 20 };
        } else {
            job = { title: "📱 Remote Crypto / MoMo Trader", basePay: 300, energyCost: 25 };
        }

        if (gameState.data.energy < job.energyCost && !gameState.data.hasVIPPass) {
            this.triggerEnergyRefill();
            return;
        }

        // Spend energy
        gameState.useEnergy(job.energyCost);
        audio.playLevelUp();

        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open">
                <div class="modal-card" style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 8px;">🎉</div>
                    <h3>Shift Finished: ${job.title}</h3>
                    <p style="color: #94a3b8; font-size: 0.95rem;">You worked hard and earned an honest paycheck!</p>

                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 12px; padding: 16px; margin: 16px 0;">
                        <div style="font-size: 0.85rem; color: #10b981; font-weight: bold; text-transform: uppercase;">Base Paycheck</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #f8fafc;">+₵${job.basePay} Cedis</div>
                    </div>

                    <!-- 3x REWARDED VIDEO AD MULTIPLIER BUTTON -->
                    <button class="btn-ad-multiplier" onclick="window.ui.claimTriplePay(${job.basePay})">
                        📺 Watch Sponsor Video to 3x Pay (+₵${job.basePay * 3})!
                    </button>

                    <button class="btn-standard" style="margin-top: 10px;" onclick="window.ui.claimStandardPay(${job.basePay})">
                        Claim Standard +₵${job.basePay}
                    </button>
                </div>
            </div>
        `;
    }

    claimStandardPay(amount) {
        gameState.addCedis(amount);
        audio.playCashJingle();
        document.querySelector('.modal-overlay')?.remove();
    }

    claimTriplePay(baseAmount) {
        monetization.showRewardedVideo('reward_triple_gig', () => {
            gameState.addCedis(baseAmount * 3);
            audio.playLevelUp();
            document.querySelector('.modal-overlay')?.remove();
            alert(`🔥 3x MULTIPLIER REWARDED!\n+₵${baseAmount * 3} Cedis credited to your wallet!`);
        });
    }

    // --- MODAL: ENERGY REFILL ---
    triggerEnergyRefill() {
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="text-align: center;">
                    <div style="font-size: 3rem;">⚡</div>
                    <h3>Low Energy!</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem;">Refill your energy to keep hustling and partying across Accra.</p>
                    
                    <button class="btn-ad-multiplier" onclick="window.ui.refillViaAd()">
                        📺 Watch Video for Free 100% Energy Refill + ₵50!
                    </button>

                    <button class="btn-momo-buy" style="margin-top: 10px;" onclick="window.ui.openMoMoShop()">
                        🛒 Get VIP Infinite Energy Pass (MoMo)
                    </button>
                </div>
            </div>
        `;
    }

    refillViaAd() {
        monetization.showRewardedVideo('reward_energy', () => {
            gameState.refillEnergy(100);
            gameState.addCedis(50);
            document.querySelector('.modal-overlay')?.remove();
            alert(`⚡ Energy 100% Restored! +₵50 bonus Cedis credited!`);
        });
    }

    triggerQuickAdCash() {
        monetization.showRewardedVideo('reward_cash_aid', () => {
            gameState.addCedis(100);
            alert(`🪙 Free Cash Granted: +₵100 Cedis added to your wallet!`);
        });
    }

    triggerFoodPrompt() {
        audio.playTap();
        gameState.feed(50, 20);
        audio.playCashJingle();
        alert(`🍛 Chopped delicious Auntie Muni Waakye & Kelewele! Hunger & Energy restored.`);
    }

    // --- MODAL: MOMO & PAYSTACK SHOP ---
    openMoMoShop() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>💰 Accra MoMo & Cedis Shop</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 12px;">Instant Mobile Money checkout (MTN MoMo, Telecel Cash, AT Money, Cards).</p>
                    <div class="shop-grid">
                        <div class="shop-card" onclick="window.ui.buyPackage('Waakye Pocket', 500, 0, 3.0)">
                            <div class="shop-badge">STARTER</div>
                            <div class="shop-title">Waakye Pocket</div>
                            <div class="shop-reward">+500 Cedis</div>
                            <div class="shop-price">GH₵ 3.00</div>
                        </div>

                        <div class="shop-card" onclick="window.ui.buyPackage('Osu Night Out', 2500, 25, 12.0)">
                            <div class="shop-badge popular">POPULAR</div>
                            <div class="shop-title">Osu Night Out</div>
                            <div class="shop-reward">+2,500 Cedis • +25 💎</div>
                            <div class="shop-price">GH₵ 12.00</div>
                        </div>

                        <div class="shop-card" onclick="window.ui.buyPackage('East Legon Boss', 10000, 150, 40.0)">
                            <div class="shop-badge best">BEST VALUE</div>
                            <div class="shop-title">East Legon Boss</div>
                            <div class="shop-reward">+10,000 Cedis • +150 💎</div>
                            <div class="shop-price">GH₵ 40.00</div>
                        </div>

                        <div class="shop-card" onclick="window.ui.buyPackage('Alvyd VIP Pass', 25000, 500, 75.0, true)">
                            <div class="shop-badge vip">VIP</div>
                            <div class="shop-title">Alvyd Black VIP Pass</div>
                            <div class="shop-reward">Infinite Energy • +25k ₵</div>
                            <div class="shop-price">GH₵ 75.00</div>
                        </div>
                    </div>
                    <div class="provider-bar">
                        <span>🟡 MTN MoMo</span> • <span>🔴 Telecel Cash</span> • <span>🔵 AT Money</span> • <span>💳 Visa / Card</span>
                    </div>
                </div>
            </div>
        `;
    }

    async buyPackage(name, cedis, gems, priceGHS, isVIP = false) {
        await monetization.purchaseMoMoPackage({ name, cedis, gems, priceGHS, isVIP });
        document.querySelector('.modal-overlay')?.remove();
    }

    // --- MODAL: DAILY LUCKY WHEEL ---
    openLuckyWheel() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="text-align: center;">
                    <div class="modal-header">
                        <h3>🎡 Accra Daily Lucky Wheel</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.85rem;">Spin to win up to ₵1,000 Cedis and Royal Kente drip!</p>
                    <div style="font-size: 5rem; margin: 12px 0;">🎯</div>
                    <button class="btn-submit" onclick="window.ui.spinWheel()">
                        🎲 Spin Lucky Wheel!
                    </button>
                </div>
            </div>
        `;
    }

    spinWheel() {
        monetization.spinLuckyWheel(false, (win) => {
            document.querySelector('.modal-overlay')?.remove();
            alert(`🎉 CONGRATULATIONS!\nYou won: ${win.text}! Prize credited to your character.`);
        });
    }

    // --- MODAL: WARDROBE DRIP SHOP ---
    openWardrobe() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>👗 Accra Drip & Wardrobe</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="wardrobe-section">
                        <h4>Outfits</h4>
                        <div class="wardrobe-options">
                            <button class="option-btn" onclick="window.ui.setOutfit('kente')">👑 Royal Kente</button>
                            <button class="option-btn" onclick="window.ui.setOutfit('batakari')">🥋 Northern Smock</button>
                            <button class="option-btn" onclick="window.ui.setOutfit('suit')">💼 East Legon Blazer</button>
                            <button class="option-btn" onclick="window.ui.setOutfit('streetwear')">🧢 Osu Streetwear</button>
                        </div>
                    </div>
                    <div class="wardrobe-section">
                        <h4>African Hairstyles</h4>
                        <div class="wardrobe-options">
                            <button class="option-btn" onclick="window.ui.setHair('braids')">🌾 Box Braids</button>
                            <button class="option-btn" onclick="window.ui.setHair('afro')">✨ High-Top Afro</button>
                            <button class="option-btn" onclick="window.ui.setHair('dreads')">🌿 Dreadlocks</button>
                            <button class="option-btn" onclick="window.ui.setHair('fade')">✂️ Fresh Fade</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setOutfit(outfit) {
        audio.playTap();
        gameState.data.avatar.outfit = outfit;
        gameState.save();
        if (this.engine) {
            this.engine.avatar.updateConfig({ outfit });
        }
    }

    setHair(hairStyle) {
        audio.playTap();
        gameState.data.avatar.hairStyle = hairStyle;
        gameState.save();
        if (this.engine) {
            this.engine.avatar.updateConfig({ hairStyle });
        }
    }

    // --- IN-GAME TOAST NOTIFICATIONS ---
    showToast(message, icon = "✨") {
        let toast = document.getElementById('hud-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'hud-toast';
            document.getElementById('hud-container')?.appendChild(toast);
        }
        toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // --- DANCE EMOTE TRIGGER ---
    triggerDanceMenu() {
        audio.unlock();
        if (this.engine.avatar.currentAnim === 'dance_azonto') {
            this.engine.avatar.setAnimation('dance_kupe');
            this.showToast('Now dancing Kupe Slide!', '💃');
        } else if (this.engine.avatar.currentAnim === 'dance_kupe') {
            this.engine.avatar.setAnimation('idle');
            this.showToast('Stopped dancing.', '🕺');
        } else {
            this.engine.avatar.setAnimation('dance_azonto');
            this.showToast('Azonto Groove Active! 🇬🇭', '🔥');
        }
    }

    // --- CHAT MODAL ---
    openChatModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>💬 Accra Street Chale Chat</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="chat-bubbles">
                        <div class="chat-msg"><strong>DJ Switch (Osu):</strong> Chale! Tonight at Bloom Bar we are shutting down the city with raw Afrobeats! Pull up! 🔥</div>
                        <div class="chat-msg"><strong>Uncle Ebo (Jamestown):</strong> Young man, hard work in Bukom brings respect. Keep moving! 🥊</div>
                        <div class="chat-msg"><strong>Afua (East Legon):</strong> Your Kente drip is looking so clean! Where did you get that cloth? 👑</div>
                    </div>
                </div>
            </div>
        `;
    }

    openAccountModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('open');
    }

    // --- STORYLINE & NARRATIVE RPG MODALS ---
    openNpcDialogue(npcId) {
        audio.unlock();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const currentQuest = storyEngine.getCurrentQuest();
        const isTarget = currentQuest && currentQuest.targetNpc === npcId;

        if (isTarget) {
            audio.playDialoguePop();
            const dialogue = currentQuest.dialogue;
            const choicesHtml = dialogue.choices.map((c, idx) => `
                <button class="story-choice-btn" onclick="window.ui.chooseStoryOption('${currentQuest.id}', ${idx})">
                    <span class="choice-text">${c.text}</span>
                    <span class="choice-consequence">${c.consequence}</span>
                </button>
            `).join('');

            const linesHtml = dialogue.lines.map(line => `<p class="dialogue-line">${line}</p>`).join('');

            root.innerHTML = `
                <div class="modal-overlay open dialogue-overlay" onclick="if(event.target===this) this.remove()">
                    <div class="dialogue-card">
                        <div class="dialogue-speaker-banner">
                            <div class="speaker-avatar">${dialogue.avatar}</div>
                            <div class="speaker-meta">
                                <div class="speaker-name">${dialogue.speaker}</div>
                                <div class="speaker-title">${dialogue.title}</div>
                            </div>
                            <span class="quest-marker">MISSION TARGET</span>
                            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                        </div>
                        <div class="dialogue-body">
                            ${linesHtml}
                        </div>
                        <div style="font-size: 0.8rem; color: #38bdf8; margin-bottom: 12px; font-weight: 700; background: rgba(56, 189, 248, 0.1); padding: 8px 12px; border-radius: 8px;">
                            🎯 Current Objective: ${currentQuest.objectiveText}
                        </div>
                        <div class="dialogue-choices">
                            ${choicesHtml}
                        </div>
                    </div>
                </div>
            `;
        } else {
            audio.playTap();
            const ambient = this.getAmbientNpcDialogue(npcId);
            root.innerHTML = `
                <div class="modal-overlay open dialogue-overlay" onclick="if(event.target===this) this.remove()">
                    <div class="dialogue-card">
                        <div class="dialogue-speaker-banner">
                            <div class="speaker-avatar">${ambient.avatar}</div>
                            <div class="speaker-meta">
                                <div class="speaker-name">${ambient.speaker}</div>
                                <div class="speaker-title">${ambient.title}</div>
                            </div>
                            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                        </div>
                        <div class="dialogue-body">
                            <p class="dialogue-line">${ambient.line}</p>
                        </div>
                        <div class="dialogue-choices">
                            <button class="story-choice-btn" onclick="this.closest('.modal-overlay').remove()">
                                <span class="choice-text">"Charle, I hear you! Let me keep hustling."</span>
                                <span class="choice-consequence">Keep exploring Accra streets</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getAmbientNpcDialogue(npcId) {
        const lines = {
            auntie_muni: {
                speaker: 'Auntie Muni',
                title: 'Queen of Oxford Street Waakye',
                avatar: '🍛',
                line: 'Charle, Auntie Muni’s Waakye is always warm and blessed! If you work hard and respect your elders, Oxford Street will treat you well.'
            },
            dj_switch: {
                speaker: 'DJ Switch',
                title: 'Bloom Bar Resident DJ',
                avatar: '🎧',
                line: 'Chale Kwame! The vibes at Bloom Bar are unmatched. Once you get that beat in your feet, nobody can dim your light!'
            },
            sly_nana: {
                speaker: 'Sly Nana',
                title: 'Oxford Street Syndicate Boss',
                avatar: '🕶️',
                line: 'Watch yourself around these corners, boy. Accra is sweet, but if you don’t watch your back, sharks will eat your lunch.'
            },
            coach_bukom: {
                speaker: 'Coach Bukom',
                title: 'Jamestown Boxing Veteran',
                avatar: '🥊',
                line: 'Hands up, chin down! Bukom produced Azumah Nelson and Ike Quartey. If you want to conquer Accra, you must have the heart of a Ga lion!'
            },
            the_bulldozer: {
                speaker: 'The Bulldozer',
                title: 'Bukom Boxing Champion',
                avatar: '💪',
                line: 'Nobody tests my right hook and stays standing! You want respect in Jamestown? Earn it in the ring!'
            },
            serwaa: {
                speaker: 'Serwaa',
                title: 'Labadi Glamour Influencer',
                avatar: '💎',
                line: 'Hey darling! Labadi Beach is where the true stars shine. Keep your drip fresh and stay confident, everyone is watching! ✨'
            },
            dr_kobby: {
                speaker: 'Dr. Kobby Boateng',
                title: 'East Legon FinTech Founder',
                avatar: '💻',
                line: 'Innovation is the future of Ghana. We are transforming commerce across Africa with technology. Keep dreaming big, Kwame!'
            }
        };

        return lines[npcId] || {
            speaker: 'Accra Resident',
            title: 'Local Chale',
            avatar: '🇬🇭',
            line: 'Akwaba! Accra is the center of the world. Hustle with good energy and fortune will find you!'
        };
    }

    chooseStoryOption(questId, choiceIdx) {
        audio.unlock();
        const quest = STORY_QUESTS[questId];
        if (!quest) return;
        const choice = quest.dialogue.choices[choiceIdx];
        if (!choice) return;

        // Apply relationship affinity
        if (quest.targetNpc && choice.affinity) {
            gameState.data.story.relationships[quest.targetNpc] = (gameState.data.story.relationships[quest.targetNpc] || 0) + choice.affinity;
        }

        // Record player choice
        gameState.data.story.choices[questId] = {
            choiceIdx,
            choiceText: choice.text,
            consequence: choice.consequence,
            timestamp: Date.now()
        };

        // Complete the quest in story engine
        storyEngine.completeQuest(questId, choice.rewardDelta || {});
        audio.playQuestComplete();

        // Calculate total rewards for this quest
        const cedisEarned = (quest.reward.cedis || 0) + (choice.rewardDelta?.cedis || 0);
        const cloutEarned = (quest.reward.clout || 0) + (choice.rewardDelta?.clout || 0);
        const gemsEarned = (quest.reward.gems || 0) + (choice.rewardDelta?.gems || 0);

        // Render Quest Complete modal with AdSense Rewarded Video 2x multiplier
        const root = document.getElementById('modals-root');
        if (!root) return;

        root.innerHTML = `
            <div class="modal-overlay open" style="z-index: 10000;">
                <div class="modal-card quest-complete-card">
                    <div class="complete-icon">🏆</div>
                    <div class="complete-header">CHAPTER QUEST COMPLETED!</div>
                    <div class="complete-title">${quest.title}</div>
                    <div class="complete-desc" style="color: #fbbf24; font-weight: 600; margin-bottom: 12px;">
                        "${choice.consequence}"
                    </div>
                    <div class="complete-payout">
                        ${cedisEarned > 0 ? `<div class="payout-item">🪙 +₵${cedisEarned} Cedis</div>` : ''}
                        ${cloutEarned > 0 ? `<div class="payout-item">✨ +${cloutEarned} Clout</div>` : ''}
                        ${gemsEarned > 0 ? `<div class="payout-item">💎 +${gemsEarned} Gems</div>` : ''}
                        ${quest.reward.outfitUnlock ? `<div class="payout-item item-unlock">👑 Outfit: ${quest.reward.outfitUnlock}</div>` : ''}
                    </div>

                    <!-- Monetization: Rewarded Video 2x Payout Hook -->
                    <div style="background: rgba(245, 158, 11, 0.15); border: 1px dashed #f59e0b; border-radius: 12px; padding: 12px; margin: 16px 0;">
                        <div style="font-weight: 800; font-size: 0.95rem; color: #fbbf24; margin-bottom: 6px;">
                            🎬 Sponsor Video 2x Quest Bonus!
                        </div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 10px;">
                            Watch a quick sponsor ad to double your quest earnings (+₵${cedisEarned || 150} Cedis & +${cloutEarned || 50} Clout)!
                        </p>
                        <button class="btn-momo-buy" onclick="window.ui.claimDoubleStoryReward(${cedisEarned || 150}, ${cloutEarned || 50})">
                            📺 Watch 6s Ad to 2x Story Reward!
                        </button>
                    </div>

                    <button class="btn-submit" onclick="this.closest('.modal-overlay').remove(); window.ui.showToast('Quest Completed! New objective active.', '📜');">
                        Continue Adventure ›
                    </button>
                </div>
            </div>
        `;

        this.renderHUD(gameState.data);
    }

    claimDoubleStoryReward(cedisBonus, cloutBonus) {
        monetization.showRewardedVideo('story_quest_double', () => {
            gameState.earnCedis(cedisBonus);
            gameState.addClout(cloutBonus);
            audio.playLevelUp();
            this.showToast(`🎉 2x Quest Bonus Claimed! +₵${cedisBonus} Cedis & +${cloutBonus} Clout!`, '💰');
            document.querySelector('.modal-overlay')?.remove();
            this.renderHUD(gameState.data);
        });
    }

    openStoryJournal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const currentQuest = storyEngine.getCurrentQuest();
        const currentChapter = storyEngine.getCurrentChapter();
        const currentChId = gameState.data.story?.chapter || 1;
        const relationships = gameState.data.story?.relationships || {};

        const characters = [
            { id: 'auntie_muni', name: 'Auntie Muni', title: 'Queen of Waakye', avatar: '🍛' },
            { id: 'dj_switch', name: 'DJ Switch', title: 'Bloom Bar DJ', avatar: '🎧' },
            { id: 'sly_nana', name: 'Sly Nana', title: 'Oxford Street Boss', avatar: '🕶️' },
            { id: 'coach_bukom', name: 'Coach Bukom', title: 'Jamestown Boxing Veteran', avatar: '🥊' },
            { id: 'serwaa', name: 'Serwaa', title: 'Labadi Glamour Influencer', avatar: '💎' },
            { id: 'dr_kobby', name: 'Dr. Kobby Boateng', title: 'East Legon FinTech Founder', avatar: '💻' }
        ];

        const chaptersHtml = STORY_CHAPTERS.map(ch => {
            const isCompleted = currentChId > ch.id;
            const isActive = currentChId === ch.id;
            const badgeClass = isActive ? 'popular' : (isCompleted ? 'best' : '');
            const badgeText = isCompleted ? '✅ COMPLETED' : (isActive ? '⚡ ACTIVE' : '🔒 LOCKED');

            return `
                <div class="story-chapter-card ${isActive ? 'active' : (isCompleted ? 'completed' : 'locked')}">
                    <div class="ch-badge"><span class="shop-badge ${badgeClass}">${badgeText}</span></div>
                    <div class="ch-num">Chapter ${ch.id}</div>
                    <div class="ch-title">${ch.title}</div>
                    <div class="ch-subtitle">${ch.subtitle}</div>
                    <div class="ch-desc">${ch.description}</div>
                </div>
            `;
        }).join('');

        const relationsHtml = characters.map(c => {
            const aff = relationships[c.id] || 0;
            const pct = Math.max(0, Math.min(100, Math.round(((aff + 30) / 130) * 100)));
            let statusText = 'Neutral 🤝';
            let barColor = '#38bdf8';
            if (aff >= 35) {
                statusText = 'Loyal Ally 💚';
                barColor = '#10b981';
            } else if (aff >= 10) {
                statusText = 'Friendly 😊';
                barColor = '#34d399';
            } else if (aff < -10) {
                statusText = 'Hostile Nemesis 💀';
                barColor = '#ef4444';
            } else if (aff < 0) {
                statusText = 'Distrusted ⚠️';
                barColor = '#f59e0b';
            }

            return `
                <div class="relation-item">
                    <div class="rel-info">
                        <span>${c.avatar} <strong>${c.name}</strong></span>
                        <span style="font-weight: 700; color: ${barColor};">${statusText} (${aff > 0 ? '+' : ''}${aff})</span>
                    </div>
                    <div class="rel-bar">
                        <div class="rel-fill" style="width: ${pct}%; background: ${barColor};"></div>
                    </div>
                </div>
            `;
        }).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card story-journal-card">
                    <div class="modal-header">
                        <h3>📜 Accra Campaign: Oxford St to East Legon</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <!-- Active Mission Banner -->
                    ${currentQuest ? `
                    <div class="active-mission-banner">
                        <div class="mission-tag">CURRENT ACTIVE MISSION (CH. ${currentChapter.id})</div>
                        <div class="mission-title">${currentQuest.title}</div>
                        <div class="mission-desc">👉 ${currentQuest.objectiveText}</div>
                        <div class="mission-rewards">
                            🎁 Rewards: 🪙 ₵${currentQuest.reward.cedis || 0} Cedis • ✨ ${currentQuest.reward.clout || 0} Clout ${currentQuest.reward.gems ? `• 💎 ${currentQuest.reward.gems} Gems` : ''}
                        </div>
                    </div>
                    ` : `
                    <div class="active-mission-banner">
                        <div class="mission-title">👑 Coronation Achieved!</div>
                        <div class="mission-desc">You have conquered all 5 chapters and reign as the King of Accra!</div>
                    </div>
                    `}

                    <!-- Campaign Chapters Progress -->
                    <div style="margin-bottom: 18px;">
                        <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">
                            Accra RPG Chapters
                        </h4>
                        <div class="chapters-grid">
                            ${chaptersHtml}
                        </div>
                    </div>

                    <!-- Character Relationships -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">
                            Character Relationship Network
                        </h4>
                        <div class="relations-container">
                            ${relationsHtml}
                        </div>
                    </div>

                    <button class="btn-submit" onclick="this.closest('.modal-overlay').remove()">
                        Back to Accra Streets
                    </button>
                </div>
            </div>
        `;
    }
}
