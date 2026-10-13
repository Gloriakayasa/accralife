// Accra Life - User Interface & Full Life-Sim Management Engine (Lagos Life Clone)
// Features: Sleek Lagos Life Top Bar & Broadcast Banner, Complete Hustle Hub,
// Trotro Transport Tycoon, Housing & Land Guards, Mayor Elections, ChalePhone & MoMo, Wardrobe Drip

import { gameState, ORIGINS, TROTRO_MODELS, TROTRO_ROUTES, ACCRA_HOUSING, MAYOR_POLICIES } from './state.js';
import { audio } from './audio.js';
import { monetization } from './monetization.js';
import { storyEngine, STORY_CHAPTERS, STORY_QUESTS } from './story.js';

export class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.activePhoneTab = 'chat';
        this.initHUD();
        this.initEventListeners();

        // Subscribe to game state updates
        gameState.subscribe((data) => this.renderHUD(data));

        // Prompt origin selector on startup if none chosen
        setTimeout(() => {
            if (!gameState.data.origin) {
                this.openOriginModal();
            }
        }, 600);
    }

    initHUD() {
        let hud = document.getElementById('game-hud');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'game-hud';
            document.body.appendChild(hud);
        }

        hud.innerHTML = `
            <!-- Top City Bar & Live Ticker (Lagos Life Style) -->
            <header id="hud-top" style="flex-direction: column; gap: 5px; padding: 8px 14px;">
                <div style="display: flex; width: 100%; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <!-- Brand Pill & Online Status -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="hud-profile" onclick="window.ui.openOriginModal()" title="View Accra Life Profile & Origin">
                            <div class="profile-avatar-circle" id="hud-avatar-circle">🇬🇭</div>
                            <div class="profile-info">
                                <div class="profile-name" id="hud-player-name">Kwame</div>
                                <div class="profile-title" id="hud-player-title">Accra Hustler • Lv.1</div>
                            </div>
                        </div>

                        <!-- Live Ticker Pills -->
                        <div class="city-stats-bar">
                            <span class="city-stat-pill online" title="Active Players in Accra">🟢 28.5k online</span>
                            <span class="city-stat-pill" title="Total City Visits">👀 3.2m visits</span>
                            <span class="city-stat-pill" onclick="window.ui.openMayorModal()" id="hud-mayor-pill" title="Mayor of Accra">🏛️ Mayor @Kwame</span>
                            <span class="city-stat-pill" onclick="window.ui.openSeaPlotsModal()" title="Atlantic Beach Plots">🌊 Beach Plots</span>
                            <span class="city-stat-pill" onclick="window.ui.openHousingModal()" title="Housing Market">🏘️ 450 homes</span>
                        </div>
                    </div>

                    <!-- Currencies & Action Buttons -->
                    <div class="hud-currencies">
                        <div class="currency-pill cedis" onclick="window.ui.openMoMoShop()" title="MTN Mobile Money Balance">
                            <span class="currency-icon">🪙</span>
                            <span id="hud-cedis-val">₵6,000</span>
                            <span class="currency-add">+</span>
                        </div>

                        <div class="currency-pill gems" onclick="window.ui.openMoMoShop()" title="Gold Gems">
                            <span class="currency-icon">💎</span>
                            <span id="hud-gems-val">25</span>
                            <span class="currency-add">+</span>
                        </div>

                        <div class="city-stat-pill" id="hud-origin-pill" onclick="window.ui.openOriginModal()" style="background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; color: #fbbf24; cursor: pointer;">
                            👶🏾 Origin
                        </div>

                        <button class="hud-ad-btn" onclick="window.ui.triggerQuickAdCash()" title="Watch 6s Sponsor Video for +₵150 Cedis">
                            📺 +₵150
                        </button>

                        <button class="hud-wheel-btn" onclick="window.ui.openLuckyWheel()" title="Daily Lucky Wheel">
                            🎡 Spin
                        </button>

                        <button class="hud-icon-btn" id="hud-audio-btn" onclick="window.ui.toggleAudio()" title="Afrobeats Music">
                            🔊
                        </button>

                        <button class="hud-icon-btn" onclick="window.ui.openAccountModal()" title="Cloud Save / Account">
                            👤
                        </button>
                    </div>
                </div>

                <!-- Green Mayor Broadcast Announcement Banner (Lagos Life Style) -->
                <div id="city-mayor-banner" onclick="window.ui.openMayorModal()" title="Tap to view Mayor of Accra & Civic Policies">
                    🏛️ <span id="mayor-banner-text">Mayor @KwameEastLegon: Dumsor is cancelled this week! Waakye subsidies active in Osu!</span>
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

            <!-- Bottom Floating Action Navigation Dock (Clean 5-Tab Design) -->
            <nav id="hud-dock" style="gap: 8px; padding: 8px 16px;">
                <button class="dock-btn" onclick="window.ui.openVenuesModal()" title="Accra Landmarks Directory">
                    <span class="dock-icon">🗺️</span>
                    <span class="dock-text">City</span>
                </button>

                <button class="dock-btn dock-btn-work" onclick="window.ui.openHustleModal()" title="Jobs, Gigs & Careers">
                    <span class="dock-icon">💼</span>
                    <span class="dock-text">Hustle</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openTrotroEmpireModal()" style="border: 1px solid rgba(245, 158, 11, 0.4);" title="Manage Commercial Fleet">
                    <span class="dock-icon">🚌</span>
                    <span class="dock-text">Trotros</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openHousingModal()" title="Housing & Land Guards">
                    <span class="dock-icon">🏡</span>
                    <span class="dock-text">Housing</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openPhoneModal()" title="ChalePhone, MoMo & SMS">
                    <span class="dock-icon">📱</span>
                    <span class="dock-text">Phone</span>
                </button>
            </nav>

            <!-- Modals Container -->
            <div id="modals-root"></div>
        `;
    }

    initEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelector('.modal-overlay')?.remove();
            }
        });
    }

    renderHUD(data) {
        const nameEl = document.getElementById('hud-player-name');
        const titleEl = document.getElementById('hud-player-title');
        const cedisEl = document.getElementById('hud-cedis-val');
        const gemsEl = document.getElementById('hud-gems-val');
        const mayorPill = document.getElementById('hud-mayor-pill');
        const mayorBanner = document.getElementById('mayor-banner-text');
        const originPill = document.getElementById('hud-origin-pill');

        if (nameEl) nameEl.textContent = data.name;
        if (titleEl) titleEl.textContent = `${data.title} • Lv.${data.level}`;
        if (cedisEl) cedisEl.textContent = `₵${data.cedis.toLocaleString()}`;
        if (gemsEl) gemsEl.textContent = `${data.gems}`;

        if (mayorPill && data.mayor?.currentMayor) {
            mayorPill.textContent = `🏛️ Mayor ${data.mayor.currentMayor.username}`;
        }
        if (mayorBanner && data.mayor?.currentMayor) {
            mayorBanner.textContent = `Mayor ${data.mayor.currentMayor.username}: "${data.mayor.currentMayor.message}"`;
        }

        if (originPill) {
            if (data.origin === 'nepo') {
                originPill.innerHTML = `👶🏾💰 Borga Nepo`;
                originPill.style.borderColor = '#f59e0b';
                originPill.style.color = '#fbbf24';
            } else if (data.origin === 'lapo') {
                originPill.innerHTML = `🏦 Susu Hustler`;
                originPill.style.borderColor = '#38bdf8';
                originPill.style.color = '#38bdf8';
            } else {
                originPill.innerHTML = `✨ Choose Origin`;
            }
        }

        // Story Tracker
        const currQuest = storyEngine.getCurrentQuest();
        const currCh = storyEngine.getCurrentChapter();
        const widgetBadge = document.getElementById('story-ch-badge');
        const widgetTitle = document.getElementById('story-quest-title');
        const widgetObj = document.getElementById('story-quest-objective');
        if (widgetBadge && currCh) widgetBadge.textContent = `📜 Ch. ${currCh.id}: ${currCh.title}`;
        if (widgetTitle && currQuest) widgetTitle.textContent = `👉 ${currQuest.title}`;
        if (widgetObj && currQuest) widgetObj.textContent = currQuest.objectiveText;
    }

    // --- 1. ORIGIN SELECTION MODAL ("Borga Nepo" vs "Susu Hustler") ---
    openOriginModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const currOrigin = gameState.data.origin;

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 680px;">
                    <div class="modal-header">
                        <h3>🇬🇭 Choose Your Accra Origin</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.4;">
                        In Accra Life, your starting background determines your social capital, housing, and financial obligations. Choose wisely, chale!
                    </p>

                    <div class="origins-container">
                        <!-- Origin 1: Borga Nepo -->
                        <div class="origin-card nepo ${currOrigin === 'nepo' ? 'active' : ''}" onclick="window.ui.selectOrigin('nepo')">
                            <div>
                                <div class="origin-badge-icon">👶🏾💰</div>
                                <div class="origin-title">Borga / East Legon Nepo</div>
                                <div class="origin-tagline">"Daddy knows ministers and Borgas."</div>
                                <ul class="origin-perks">
                                    <li>Fully furnished East Legon villa — Daddy pays the rent</li>
                                    <li>Your own Mercedes-Benz 🚙 (just buy fuel)</li>
                                    <li>Branch Manager at Daddy's friend's FinTech bank</li>
                                    <li>₵50,000 pocket money & 100 Gold Gems</li>
                                </ul>
                            </div>
                            <button class="btn-momo-buy" style="margin-top: 10px;">
                                ${currOrigin === 'nepo' ? 'Current Origin (Active)' : 'Spawn as East Legon Nepo'}
                            </button>
                        </div>

                        <!-- Origin 2: Susu Hustler -->
                        <div class="origin-card lapo ${currOrigin === 'lapo' ? 'active' : ''}" onclick="window.ui.selectOrigin('lapo')">
                            <div>
                                <div class="origin-badge-icon">🏦</div>
                                <div class="origin-title">Susu / Jamestown Hustler</div>
                                <div class="origin-tagline">"Self-made hits different, chale."</div>
                                <ul class="origin-perks">
                                    <li>₵6,000 Susu loan to start — repay ₵1,200 weekly</li>
                                    <li>Hustle skill starts at Level 2</li>
                                    <li>Learn every life skill 25% faster</li>
                                    <li>Start in Jamestown and hustle to the top!</li>
                                </ul>
                            </div>
                            <button class="btn-submit" style="margin-top: 10px;">
                                ${currOrigin === 'lapo' ? 'Current Origin (Active)' : 'Spawn as Susu Hustler'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectOrigin(originKey) {
        audio.playLevelUp();
        gameState.chooseOrigin(originKey);
        document.querySelector('.modal-overlay')?.remove();
        this.showToast(
            originKey === 'nepo'
                ? 'Welcome, Borga! East Legon Villa & ₵50,000 pocket money credited! 👑'
                : 'Welcome, Chale! ₵6,000 Susu loan credited. Go hustle Jamestown! 🥊',
            '🇬🇭'
        );
        this.renderHUD(gameState.data);
    }

    // --- 2. COMPLETE HUSTLE & CAREER HUB ---
    openHustleModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const d = gameState.data;

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 720px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <div>
                            <h3 style="margin: 0;">💼 Accra Hustle & Career Hub</h3>
                            <span style="font-size: 0.8rem; color: #38bdf8;">Energy: ⚡ ${d.energy}/100 • Clout: ✨ ${d.clout} • Level: ${d.level}</span>
                        </div>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 14px;">
                        Work shifts to earn daily Cedis, build your reputation, and rise from Jamestown street hawker to East Legon business tycoon!
                    </p>

                    <!-- Section 1: Street Hustles -->
                    <h4 style="font-size: 0.82rem; color: #f59e0b; text-transform: uppercase; margin-bottom: 8px;">
                        🌟 Street Hustles (No Experience Required)
                    </h4>
                    <div class="venue-action-grid" style="margin-bottom: 16px;">
                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Pure Water Hawking', 180, 15, 10)">
                            <div class="venue-action-title">🧊 Pure Water Hawking at Circle</div>
                            <div class="venue-action-desc">Sprint between cars in traffic selling chilled sachet water. Watch out for AMA task force!</div>
                            <div class="venue-action-cost">+₵180 Cedis • +15 Clout • -10 Energy</div>
                        </button>

                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Trotro Conductor Mate', 280, 25, 15)">
                            <div class="venue-action-title">🚌 Trotro Conductor (Mate)</div>
                            <div class="venue-action-desc">Shout "Accra! Kaneshie! Two-two cedis!", collect fares, slap the bus roof: "Master, go!"</div>
                            <div class="venue-action-cost">+₵280 Cedis • +25 Clout • -15 Energy</div>
                        </button>

                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Auntie Muni Waakye Delivery', 350, 30, 12)">
                            <div class="venue-action-title">🍛 Auntie Muni Waakye Server</div>
                            <div class="venue-action-desc">Serve hot waakye with wele and fried fish to hungry civil servants on Oxford Street.</div>
                            <div class="venue-action-cost">+₵350 Cedis • +30 Clout • -12 Energy</div>
                        </button>

                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Kantamanto Thrift Drip Sorter', 220, 35, 10)">
                            <div class="venue-action-title">👞 Kantamanto Thrift Sorter</div>
                            <div class="venue-action-desc">Sort vintage bales at Kantamanto market, find rare vintage drip for East Legon clients.</div>
                            <div class="venue-action-cost">+₵220 Cedis • +35 Clout • -10 Energy</div>
                        </button>
                    </div>

                    <!-- Section 2: Creative & Entertainment -->
                    <h4 style="font-size: 0.82rem; color: #a855f7; text-transform: uppercase; margin-bottom: 8px;">
                        🥊 Creative & Entertainment (Requires Clout)
                    </h4>
                    <div class="venue-action-grid" style="margin-bottom: 16px;">
                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Bukom Boxing Bout', 650, 80, 22, 200)">
                            <div class="venue-action-title">🥊 Bukom Boxing Prize Fight</div>
                            <div class="venue-action-desc">3 intense sparring rounds in the ring at Bukom Arena against Ga lion contenders.</div>
                            <div class="venue-action-cost">+₵650 Cedis • +80 Clout • -22 Energy (Req: 200 Clout)</div>
                        </button>

                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Bloom Bar Afrobeats DJ', 850, 120, 20, 350)">
                            <div class="venue-action-title">🎧 Bloom Bar Guest DJ</div>
                            <div class="venue-action-desc">Drop Azonto and Amapiano bangers for the high-rollers and Borgas at Bloom Bar Osu.</div>
                            <div class="venue-action-cost">+₵850 Cedis • +120 Clout • -20 Energy (Req: 350 Clout)</div>
                        </button>
                    </div>

                    <!-- Section 3: Tech & Corporate -->
                    <h4 style="font-size: 0.82rem; color: #10b981; text-transform: uppercase; margin-bottom: 8px;">
                        💻 Corporate, FinTech & Real Estate
                    </h4>
                    <div class="venue-action-grid">
                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('MEST Software Engineer', 1400, 180, 20, 450)">
                            <div class="venue-action-title">💻 MEST Africa Software Engineer</div>
                            <div class="venue-action-desc">Code scalable Mobile Money API integrations, deploy microservices during Dumsor.</div>
                            <div class="venue-action-cost">+₵1,400 Cedis • +180 Clout • -20 Energy</div>
                        </button>

                        <button class="venue-action-btn" onclick="window.ui.executeHustleShift('Luxury Real Estate Broker', 3500, 400, 25, 700)">
                            <div class="venue-action-title">🏡 East Legon Luxury Realtor</div>
                            <div class="venue-action-desc">Broker a 2-year rent advance villa lease for visiting Borgas, collect 10% agency fee!</div>
                            <div class="venue-action-cost">+₵3,500 Cedis • +400 Clout • -25 Energy</div>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    executeHustleShift(title, pay, clout, energyCost, reqClout = 0) {
        if (gameState.data.clout < reqClout) {
            alert(`You need at least ${reqClout} Clout to take this high-profile gig!`);
            return;
        }
        if (!gameState.useEnergy(energyCost)) {
            alert('You are exhausted! Grab waakye or rest to recover your stamina.');
            return;
        }

        audio.playCashJingle();
        document.querySelector('.modal-overlay')?.remove();

        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open">
                <div class="modal-card quest-complete-card">
                    <div class="complete-icon">💼</div>
                    <div class="complete-title">${title} Shift Completed!</div>
                    <div class="complete-payout">
                        <div class="payout-item">🪙 +₵${pay} Cedis</div>
                        <div class="payout-item">✨ +${clout} Clout</div>
                    </div>

                    <!-- 3x Sponsor Paycheck Multiplier -->
                    <div style="background: rgba(245, 158, 11, 0.15); border: 1px dashed #f59e0b; border-radius: 12px; padding: 12px; margin: 14px 0;">
                        <div style="font-weight: 800; color: #fbbf24;">🎬 3x Sponsor Paycheck Multiplier!</div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin: 4px 0 8px 0;">
                            Watch a 6-second sponsor video to triple your payout to +₵${pay * 3} Cedis!
                        </p>
                        <button class="btn-momo-buy" onclick="window.ui.claimTripleGigPay(${pay}, ${clout})">
                            📺 Watch 6s Ad to 3x Pay (+₵${pay * 3})
                        </button>
                    </div>

                    <button class="btn-submit" onclick="this.closest('.modal-overlay').remove(); window.gameState.earnCedis(${pay}); window.gameState.addClout(${clout});">
                        Accept Base Pay (+₵${pay})
                    </button>
                </div>
            </div>
        `;
    }

    claimTripleGigPay(basePay, clout) {
        monetization.showRewardedVideo('reward_triple_gig', () => {
            const triple = basePay * 3;
            gameState.earnCedis(triple);
            gameState.addClout(clout * 2);
            audio.playLevelUp();
            this.showToast(`🎉 3x PAYCHECK CLAIMED: +₵${triple} Cedis!`, '💰');
            document.querySelector('.modal-overlay')?.remove();
            this.renderHUD(gameState.data);
        });
    }

    // --- 3. TROTRO TRANSPORT EMPIRE ---
    openTrotroEmpireModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const fleet = gameState.data.trotros || [];
        const totalTakingsReady = fleet.reduce((acc, t) => acc + (t.takingsReady || 0), 0);

        const fleetHtml = fleet.length === 0 ? `
            <div style="text-align: center; padding: 24px; background: rgba(255,255,255,0.04); border-radius: 12px; margin: 12px 0;">
                <div style="font-size: 2.5rem; margin-bottom: 6px;">🚌</div>
                <div style="font-weight: 700; color: #f8fafc;">No Trotros in your fleet yet!</div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin: 6px 0 12px 0;">
                    Buy a Yellow Taxi or Mercedes 207 Bones Trotro below to start collecting daily commuter fares across Greater Accra.
                </p>
            </div>
        ` : fleet.map(t => `
            <div class="trotro-card">
                <div class="trotro-card-header">
                    <div>
                        <div class="trotro-name">${t.customName}</div>
                        <div class="trotro-route">📍 Route: ${t.routeName}</div>
                    </div>
                    <span class="trotro-status ready">
                        ₵${t.takingsReady || 0} Fares Ready
                    </span>
                </div>
                <div class="condition-bar">
                    <div class="condition-fill" style="width: ${t.condition}%;"></div>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <button class="btn-momo-buy" style="flex: 1;" onclick="window.ui.collectSingleTrotro('${t.id}')">
                        💰 Collect Takings
                    </button>
                    ${t.condition < 90 ? `
                        <button class="btn-submit" style="flex: 1;" onclick="window.ui.repairTrotro('${t.id}')">
                            🔧 Abossey Okai Repair (-₵${(100 - t.condition) * 20})
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        const modelsCatalogHtml = TROTRO_MODELS.map(m => `
            <div class="shop-card" style="text-align: left; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 800; font-size: 0.95rem; color: #f8fafc;">${m.name}</div>
                    <span class="shop-badge best">₵${m.cost.toLocaleString()}</span>
                </div>
                <div style="font-size: 0.78rem; color: #94a3b8; margin: 4px 0 8px 0;">
                    💺 ${m.seats} Passengers • Daily Base Takings: ₵${m.baseTakings} • Fuel: ₵${m.dailyFuel}
                </div>
                <div style="display: flex; gap: 6px;">
                    <select id="route-sel-${m.id}" style="flex: 1; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px; font-size: 0.75rem; padding: 4px;">
                        ${TROTRO_ROUTES.map(r => `<option value="${r.id}">${r.name} (${r.demand})</option>`).join('')}
                    </select>
                    <button class="btn-submit" style="padding: 6px 10px; font-size: 0.78rem;" onclick="window.ui.buyTrotroPrompt('${m.id}')">
                        Buy
                    </button>
                </div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 720px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <div>
                            <h3 style="margin: 0;">🚌 Trotro Transport Tycoon</h3>
                            <span style="font-size: 0.8rem; color: #38bdf8;">Fleet Size: ${fleet.length} Vehicles • Takings Pool: ₵${totalTakingsReady.toLocaleString()}</span>
                        </div>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    ${fleet.length > 0 ? `
                    <div style="display: flex; gap: 8px; margin: 10px 0 16px 0;">
                        <button class="btn-submit" style="flex: 1; font-size: 0.95rem;" onclick="window.ui.collectAllTrotros()">
                            💰 Collect All Daily Takings (+₵${totalTakingsReady})
                        </button>
                        <button class="btn-momo-buy" style="flex: 1; font-size: 0.95rem;" onclick="window.ui.claimDoubleTrotroTakings(${totalTakingsReady})">
                            🎬 Watch Ad to 2x Fares (+₵${totalTakingsReady * 2})
                        </button>
                    </div>
                    ` : ''}

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Your Fleet on Accra Roads</h4>
                    ${fleetHtml}

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-top: 18px;">Commercial Vehicle Dealership</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px; margin-top: 8px;">
                        ${modelsCatalogHtml}
                    </div>
                </div>
            </div>
        `;
    }

    buyTrotroPrompt(modelId) {
        const sel = document.getElementById(`route-sel-${modelId}`);
        const routeId = sel ? sel.value : TROTRO_ROUTES[0].id;
        const name = prompt('Enter a Ghanaian name/slogan for your trotro:', "Nyame Nhyira");
        if (!name) return;

        audio.playCashJingle();
        const success = gameState.buyTrotro(modelId, routeId, name);
        if (success) {
            this.showToast(`Bought new trotro: "${name}" assigned to route!`, '🚌');
            this.openTrotroEmpireModal();
        } else {
            alert('Not enough Cedis to buy this commercial vehicle!');
        }
    }

    collectSingleTrotro(id) {
        audio.playCashJingle();
        const earned = gameState.collectTrotroTakings(id, 1);
        this.showToast(`Collected +₵${earned} Cedis in commuter fares!`, '🪙');
        this.openTrotroEmpireModal();
    }

    collectAllTrotros() {
        const fleet = gameState.data.trotros || [];
        let total = 0;
        for (const t of fleet) {
            total += gameState.collectTrotroTakings(t.id, 1);
        }
        audio.playCashJingle();
        this.showToast(`Collected +₵${total} Cedis across your entire fleet!`, '💰');
        this.openTrotroEmpireModal();
    }

    claimDoubleTrotroTakings(baseTotal) {
        monetization.showRewardedVideo('reward_double_trotro', () => {
            const fleet = gameState.data.trotros || [];
            let total = 0;
            for (const t of fleet) {
                total += gameState.collectTrotroTakings(t.id, 2);
            }
            audio.playLevelUp();
            this.showToast(`🎉 2x TROTRO TAKINGS CLAIMED: +₵${total} Cedis!`, '🚌');
            document.querySelector('.modal-overlay')?.remove();
            this.renderHUD(gameState.data);
        });
    }

    repairTrotro(id) {
        audio.playTap();
        const success = gameState.repairTrotro(id);
        if (success) {
            this.showToast('Gearbox & brakes overhauled at Abossey Okai! 100% Condition.', '🔧');
            this.openTrotroEmpireModal();
        } else {
            alert('Not enough Cedis to repair this vehicle!');
        }
    }

    // --- 4. HOUSING, RENT & LAND GUARDS ---
    openHousingModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const currentHousing = gameState.data.housing || { name: 'Jamestown Single Room', weeklyRent: 150, rentDueDays: 7, landlordName: 'Agya Koo' };
        const plots = gameState.data.plots || [];

        const housingCatalogHtml = ACCRA_HOUSING.map(h => `
            <div class="housing-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 800; font-size: 0.95rem; color: #f8fafc;">${h.name}</div>
                    <span class="housing-rent">₵${h.rent}/wk</span>
                </div>
                <div class="housing-desc">${h.desc}</div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 6px;">Landlord: ${h.landlord}</div>
                <div style="display: flex; gap: 6px;">
                    <button class="btn-submit" style="flex: 1; padding: 6px;" onclick="window.ui.upgradeHomePrompt('${h.id}', false)">
                        Move In (4 Wks Advance)
                    </button>
                    <button class="btn-momo-buy" style="flex: 1; padding: 6px;" onclick="window.ui.upgradeHomePrompt('${h.id}', true)">
                        2-Year Advance (104 Wks)
                    </button>
                </div>
            </div>
        `).join('');

        const plotsHtml = plots.length === 0 ? `
            <div style="text-align: center; padding: 18px; background: rgba(255,255,255,0.04); border-radius: 12px; margin: 10px 0;">
                <div style="font-size: 2rem;">🚜</div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0 0 0;">No land plots owned yet. Acquire land in East Legon Hills below to build compound apartments.</p>
            </div>
        ` : plots.map(p => `
            <div class="trotro-card">
                <div class="trotro-card-header">
                    <div>
                        <div class="trotro-name">${p.location} Plot</div>
                        <div class="trotro-route">Stage: ${p.stage.toUpperCase()} (${p.progress}%)</div>
                    </div>
                    <span class="trotro-status ${p.landGuardStatus === 'disputed' ? 'warning' : 'ready'}">
                        ${p.landGuardStatus === 'disputed' ? '⚠️ Land Guards on Site' : '🛡️ Peaceful Title'}
                    </span>
                </div>
                <div class="condition-bar">
                    <div class="condition-fill" style="width: ${p.progress}%;"></div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    ${p.landGuardStatus === 'disputed' ? `
                        <button class="btn-momo-buy" style="flex: 1;" onclick="window.ui.settleLandGuards('${p.id}')">
                            🛡️ Settle Land Guards (-₵3,500)
                        </button>
                    ` : p.progress < 100 ? `
                        <button class="btn-submit" style="flex: 1;" onclick="window.ui.advanceBuildingStage('${p.id}')">
                            🧱 Advance Build Stage (-₵8,000)
                        </button>
                    ` : `
                        <span style="color: #34d399; font-weight: 800; font-size: 0.85rem;">🎉 Building Completed! Tenants Paying 2-Yr Advance!</span>
                    `}
                </div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 720px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🏡 Accra Real Estate & Land Guards</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <!-- Current Residence Status -->
                    <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 14px; padding: 14px; margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="shop-badge best">CURRENT RESIDENCE</span>
                                <div style="font-size: 1.15rem; font-weight: 800; margin-top: 4px;">${currentHousing.name}</div>
                                <div style="font-size: 0.8rem; color: #94a3b8;">Landlord: ${currentHousing.landlordName} • Rent: ₵${currentHousing.weeklyRent}/wk</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.8rem; color: #f59e0b;">Rent Due in:</div>
                                <div style="font-size: 1.2rem; font-weight: 800; color: #f8fafc;">${currentHousing.rentDueDays} Days</div>
                            </div>
                        </div>

                        ${currentHousing.weeklyRent > 0 ? `
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <button class="btn-submit" onclick="window.ui.payRent(false)">Pay 1 Week Rent (₵${currentHousing.weeklyRent})</button>
                            <button class="btn-momo-buy" onclick="window.ui.payRent(true)">Pay 2-Year Advance (₵${currentHousing.weeklyRent * 104})</button>
                        </div>
                        ` : `
                        <p style="font-size: 0.8rem; color: #34d399; margin-top: 6px;">✨ Fully furnished residence. Daddy covers all rent bills!</p>
                        `}
                    </div>

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Available Accra Apartments</h4>
                    <div class="housing-grid">
                        ${housingCatalogHtml}
                    </div>

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-top: 18px;">Owned Land Plots & Construction</h4>
                    ${plotsHtml}

                    <button class="btn-submit" style="margin-top: 12px;" onclick="window.ui.buyLandPlotPrompt()">
                        🚜 Buy New Land Plot in East Legon Hills (-₵25,000)
                    </button>
                </div>
            </div>
        `;
    }

    payRent(twoYearsAdvance) {
        audio.playCashJingle();
        const success = gameState.payRent(twoYearsAdvance);
        if (success) {
            this.showToast(twoYearsAdvance ? '🎉 2-Year Rent Advance Paid! Landlord respects you.' : 'Paid 1 week rent to landlord.', '🏡');
            this.openHousingModal();
        } else {
            alert('Not enough Cedis to pay rent!');
        }
    }

    upgradeHomePrompt(housingId, twoYearsAdvance) {
        audio.playCashJingle();
        const success = gameState.upgradeHousing(housingId, twoYearsAdvance);
        if (success) {
            this.showToast('🎉 Moved into your new Accra residence!', '🔑');
            this.openHousingModal();
        } else {
            alert('Not enough Cedis to lease this property!');
        }
    }

    buyLandPlotPrompt() {
        if (gameState.data.cedis < 25000) {
            alert('You need ₵25,000 Cedis to acquire a titled land plot in East Legon Hills!');
            return;
        }
        audio.playCashJingle();
        gameState.buyLandPlot('East Legon Hills', 25000);
        this.showToast('Acquired land plot in East Legon Hills! Foundation ready.', '🚜');
        this.openHousingModal();
    }

    settleLandGuards(plotId) {
        audio.playCashJingle();
        const success = gameState.settleLandGuards(plotId);
        if (success) {
            this.showToast('Settle Land Guards with schnapps & drink money! Land is now secure.', '🛡️');
            this.openHousingModal();
        } else {
            alert('Not enough Cedis to settle the Land Guards!');
        }
    }

    advanceBuildingStage(plotId) {
        audio.playCashJingle();
        const success = gameState.advanceBuildingStage(plotId);
        if (success) {
            this.showToast('Construction stage advanced! Cement blocks & roofing progressing.', '🧱');
            this.openHousingModal();
        } else {
            alert('Not enough Cedis to advance construction!');
        }
    }

    // --- 5. MAYOR OF ACCRA & CIVIC POLICIES ---
    openMayorModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const m = gameState.data.mayor || {
            currentMayor: { username: '@KwameEastLegon', title: 'Mayor of Accra', message: 'Dumsor cancelled this week!', policy: 'waakye_subsidy' },
            candidates: []
        };

        const candidatesHtml = (m.candidates || []).map(c => `
            <div class="candidate-card">
                <div class="candidate-header">
                    <div>
                        <div class="candidate-name">${c.name}</div>
                        <div class="candidate-slogan">"${c.slogan}"</div>
                    </div>
                    <span class="candidate-votes">🗳️ ${c.votes} Votes</span>
                </div>
                <div style="margin-top: 8px;">
                    ${m.playerVote === c.name ? `
                        <button class="btn-momo-buy" style="width: 100%; opacity: 0.8;" disabled>✅ Voted</button>
                    ` : `
                        <button class="btn-submit" style="width: 100%;" onclick="window.ui.voteMayorPrompt('${c.name}')">Vote for ${c.name}</button>
                    `}
                </div>
            </div>
        `).join('');

        const policiesHtml = MAYOR_POLICIES.map(p => `
            <div class="policy-card">
                <span class="policy-icon">${p.emoji}</span>
                <div class="policy-info">
                    <div class="policy-name">${p.label}</div>
                    <div class="policy-effect">${p.effect}</div>
                </div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 700px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🏛️ Mayor of Accra Civic Hall (AMA)</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <!-- Current Mayor Card -->
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 78, 59, 0.4)); border: 1px solid #10b981; border-radius: 14px; padding: 14px; margin-bottom: 16px;">
                        <span class="shop-badge best">CURRENT CITY MAYOR</span>
                        <div style="font-size: 1.25rem; font-weight: 800; margin-top: 4px; color: #f8fafc;">
                            ${m.currentMayor.username} (${m.currentMayor.title})
                        </div>
                        <p style="font-size: 0.88rem; color: #a7f3d0; margin: 4px 0 10px 0;">
                            "${m.currentMayor.message}"
                        </p>
                        <button class="btn-momo-buy" onclick="window.ui.broadcastMayorMessagePrompt()">
                            📢 Broadcast Mayoral Announcement (-₵500)
                        </button>
                    </div>

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Active Accra Municipal Policies</h4>
                    <div class="policies-grid">
                        ${policiesHtml}
                    </div>

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-top: 18px;">Weekly Mayoral Elections</h4>
                    <div class="candidates-grid">
                        ${candidatesHtml}
                    </div>

                    <button class="btn-submit" style="margin-top: 14px;" onclick="window.ui.runForMayorPrompt()">
                        🏛️ File Candidacy to Run for Mayor of Accra (-₵10,000 Filing Fee)
                    </button>
                </div>
            </div>
        `;
    }

    voteMayorPrompt(candidateName) {
        audio.playTap();
        const success = gameState.voteForMayor(candidateName);
        if (success) {
            this.showToast(`Cast ballot for ${candidateName}!`, '🗳️');
            this.openMayorModal();
        } else {
            alert('You have already voted in this week’s election cycle!');
        }
    }

    runForMayorPrompt() {
        if (gameState.data.cedis < 10000) {
            alert('You need ₵10,000 Cedis to file candidate papers with the Electoral Commission!');
            return;
        }
        const slogan = prompt('Enter your Mayoral Campaign Slogan (e.g. No Dumsor in Accra!):', 'More Waakye, Steady Power!');
        if (!slogan) return;

        audio.playLevelUp();
        gameState.runForMayor(slogan, 'steady_light');
        this.showToast('You are officially running for Mayor of Accra! Campaign active.', '🏛️');
        this.openMayorModal();
    }

    broadcastMayorMessagePrompt() {
        if (gameState.data.cedis < 500) {
            alert('Broadcasting costs ₵500 Cedis.');
            return;
        }
        const msg = prompt('Enter announcement to broadcast to all players:', 'Dumsor is cancelled this week! Waakye subsidies active in Osu!');
        if (!msg) return;

        gameState.spendCedis(500);
        gameState.data.mayor.currentMayor.message = msg;
        gameState.save();
        audio.playLevelUp();
        this.showToast('Mayoral announcement broadcast across Accra!', '📢');
        this.renderHUD(gameState.data);
        this.openMayorModal();
    }

    // --- 6. CHALEPHONE (IN-GAME SMARTPHONE) ---
    openPhoneModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const d = gameState.data;
        const tab = this.activePhoneTab || 'chat';

        let bodyContent = '';
        if (tab === 'chat') {
            bodyContent = `
                <div class="chat-bubbles" style="max-height: 280px; overflow-y: auto;">
                    <div class="chat-msg">
                        <strong style="color: #f59e0b;">🍛 Auntie Muni:</strong>
                        <p style="margin: 2px 0 6px 0;">Charle Kwame, come by Osu Oxford Street! Fresh hot waakye is steaming with wele, egg & fish.</p>
                        <button class="btn-submit" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.ui.openVenue('auntie_muni')">Visit Stall 🍛</button>
                    </div>

                    <div class="chat-msg">
                        <strong style="color: #ef4444;">🏡 Landlord Agya Koo:</strong>
                        <p style="margin: 2px 0 6px 0;">Kwame, remember your rent advance is due! In Ghana we don't do stories. Pay on time!</p>
                        <button class="btn-momo-buy" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.ui.openHousingModal()">Pay Rent 💸</button>
                    </div>

                    <div class="chat-msg">
                        <strong style="color: #38bdf8;">💎 Slay Queen Serwaa:</strong>
                        <p style="margin: 2px 0 6px 0;">Are you pulling up to Bloom Bar tonight? The East Legon Borgas are ordering champagne!</p>
                        <button class="btn-submit" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.ui.openVenue('bloom_bar')">Meet at Bloom 🪩</button>
                    </div>

                    <div class="chat-msg">
                        <strong style="color: #34d399;">🚌 Driver Kwabena:</strong>
                        <p style="margin: 2px 0 6px 0;">Boss! Circle-Kaneshie route is packed with commuters today. The mate is counting the coins.</p>
                        <button class="btn-submit" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.ui.openTrotroEmpireModal()">Fleet Dashboard 🚌</button>
                    </div>
                </div>
            `;
        } else if (tab === 'momo') {
            bodyContent = `
                <div style="text-align: center; padding: 12px 0;">
                    <div style="font-size: 0.8rem; color: #94a3b8;">MTN Mobile Money Balance</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #fbbf24;">₵${d.cedis.toLocaleString()}</div>
                    <div style="font-size: 0.82rem; color: #38bdf8; margin-top: 4px;">Account Status: Verified Gold Chale</div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <button class="btn-momo-buy" onclick="window.ui.openMoMoShop()">
                        💳 Top Up Wallet via Paystack
                    </button>
                    <button class="btn-submit" onclick="window.ui.payECGPrepaidPrompt()">
                        💡 Pay ECG Electric Prepaid (-₵120) to Cancel Dumsor
                    </button>
                </div>
            `;
        } else if (tab === 'news') {
            bodyContent = `
                <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
                    <div style="background: rgba(30, 41, 59, 0.7); padding: 10px; border-radius: 10px; border-left: 3px solid #10b981;">
                        <strong style="font-size: 0.85rem; color: #34d399;">MAYOR CONFIRMS POWER SUBSIDY</strong>
                        <p style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">Dumsor blackouts cancelled across Accra as new municipal energy grid kicks in.</p>
                    </div>

                    <div style="background: rgba(30, 41, 59, 0.7); padding: 10px; border-radius: 10px; border-left: 3px solid #f59e0b;">
                        <strong style="font-size: 0.85rem; color: #fbbf24;">2-YEAR RENT ADVANCE DEBATE</strong>
                        <p style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">East Legon landlords demand 2 years advance payment upfront as Detty December tourists flock into Accra.</p>
                    </div>

                    <div style="background: rgba(30, 41, 59, 0.7); padding: 10px; border-radius: 10px; border-left: 3px solid #38bdf8;">
                        <strong style="font-size: 0.85rem; color: #38bdf8;">TROTRO UNION SURGE</strong>
                        <p style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">GPRTU reports commuter passenger volumes reach 1.8M daily across Circle and Kaneshie terminals.</p>
                    </div>
                </div>
            `;
        }

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 440px;">
                    <div class="modal-header">
                        <h3>📱 ChalePhone 15 Pro Max</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <!-- Phone Frame -->
                    <div style="background: #0f172a; border: 2px solid #334155; border-radius: 20px; padding: 16px; margin-bottom: 14px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px;">
                            <span>MTN 5G GH 📶</span>
                            <span>Accra 12:45 PM</span>
                            <span>🔋 94%</span>
                        </div>

                        <!-- App Tabs -->
                        <div style="display: flex; gap: 6px; margin-bottom: 12px; background: rgba(30,41,59,0.8); padding: 4px; border-radius: 10px;">
                            <button class="btn-submit" style="flex: 1; padding: 6px; font-size: 0.78rem; ${tab==='chat'?'background:#38bdf8;':''}" onclick="window.ui.setPhoneTab('chat')">💬 SMS</button>
                            <button class="btn-submit" style="flex: 1; padding: 6px; font-size: 0.78rem; ${tab==='momo'?'background:#38bdf8;':''}" onclick="window.ui.setPhoneTab('momo')">📱 MoMo</button>
                            <button class="btn-submit" style="flex: 1; padding: 6px; font-size: 0.78rem; ${tab==='news'?'background:#38bdf8;':''}" onclick="window.ui.setPhoneTab('news')">📰 News</button>
                        </div>

                        ${bodyContent}
                    </div>

                    <button class="btn-submit" onclick="this.closest('.modal-overlay').remove()">
                        Put Away Phone
                    </button>
                </div>
            </div>
        `;
    }

    setPhoneTab(tab) {
        this.activePhoneTab = tab;
        this.openPhoneModal();
    }

    payECGPrepaidPrompt() {
        if (gameState.spendCedis(120)) {
            audio.playCashJingle();
            this.showToast('Paid ECG prepaid meter! Steady electricity guaranteed.', '💡');
            this.openPhoneModal();
        } else {
            alert('Not enough Cedis to top up ECG prepaid!');
        }
    }

    // --- 7. VENUES & MAP EXPLORATION ---
    openVenue(venueId) {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const venues = {
            auntie_muni: {
                title: 'Auntie Muni Waakye',
                emoji: '🍛',
                loc: 'Oxford Street, Osu',
                desc: 'The undisputed legendary Waakye joint of Accra. Hot steaming rice & beans, spicy black shito, tender wele, and fried fish.',
                actions: [
                    { title: 'Buy Executive Waakye Parcel', desc: '+60% Hunger, +30% Energy refill', cost: '₵35', fn: () => { gameState.feed(60, 30); gameState.spendCedis(35); window.ui.showToast('Steaming hot Waakye enjoyed on Oxford St!', '🍛'); } },
                    { title: 'Full Special with Fried Guinea Fowl', desc: '+100% Hunger, +100% Energy full recovery', cost: '₵65', fn: () => { gameState.feed(100, 100); gameState.spendCedis(65); window.ui.showToast('Auntie Muni Special enjoyed! Fully energized.', '🍗'); } },
                    { title: 'Talk to Auntie Muni', desc: 'Campaign storyline dialogue', cost: 'Story', fn: () => { window.ui.openNpcDialogue('auntie_muni'); } }
                ]
            },
            bloom_bar: {
                title: 'Bloom Bar',
                emoji: '🪩',
                loc: 'Osu Nightlife District',
                desc: 'The beating heart of Accra nightlife! Open-air timber pergola, top Afrobeats DJs, and VIP energy.',
                actions: [
                    { title: 'Order Signature Cocktail', desc: '+50 Clout, +25% Mood boost', cost: '₵65', fn: () => { gameState.spendCedis(65); gameState.addClout(50); window.ui.showToast('Sipping chilled cocktail at Bloom Bar!', '🍸'); } },
                    { title: 'Hit the Azonto Dancefloor', desc: 'Perform Azonto slide on stage (+35 Clout)', cost: 'Free', fn: () => { window.ui.triggerDanceMenu(); } },
                    { title: 'Guest DJ Set with DJ Switch', desc: 'Spin 45 mins Afrobeats (+₵400 Cedis)', cost: 'Free', fn: () => { gameState.earnCedis(400); window.ui.showToast('Shut down Bloom Bar! +₵400 Cedis.', '🎧'); } },
                    { title: 'Talk to DJ Switch', desc: 'Story mission interaction', cost: 'Story', fn: () => { window.ui.openNpcDialogue('dj_switch'); } }
                ]
            },
            bukom_boxing: {
                title: 'Bukom Boxing Arena',
                emoji: '🥊',
                loc: 'Historic Jamestown',
                desc: 'The legendary birthplace of world boxing champions Azumah Nelson and Ike Quartey.',
                actions: [
                    { title: 'Train with Coach Bukom', desc: 'Intensive sparring drill (+60 Clout, +Fitness)', cost: '₵45', fn: () => { gameState.spendCedis(45); gameState.addClout(60); window.ui.showToast('Coach Bukom sharpened your jabs!', '🥊'); } },
                    { title: 'Spar The Bulldozer', desc: 'Survive 3 rounds in the ring (+₵350 Cedis)', cost: '-20 Energy', fn: () => { if (gameState.useEnergy(20)) { gameState.earnCedis(350); window.ui.showToast('Defeated The Bulldozer! +₵350 Cedis.', '💪'); } } },
                    { title: 'Place Boxing Bet', desc: 'Bet on upcoming Bukom title match', cost: '₵100', fn: () => { if (gameState.spendCedis(100)) { const win = Math.random() < 0.6; if (win) { gameState.earnCedis(220); window.ui.showToast('Your boxer won! Collected +₵220 Cedis.', '🏆'); } else { window.ui.showToast('Your fighter lost by split decision.', '🥊'); } } } }
                ]
            },
            mest_tech: {
                title: 'MEST Tech Hub & Silicon Accra',
                emoji: '💡',
                loc: 'East Legon Tech Corridor',
                desc: 'West Africa premier tech incubator. FinTech unicorns, venture capital, and ChalePay founders.',
                actions: [
                    { title: 'Junior FinTech Coder Shift', desc: 'Code Mobile Money smart contracts (+₵450 Cedis)', cost: '-15 Energy', fn: () => { if (gameState.useEnergy(15)) { gameState.earnCedis(450); window.ui.showToast('Merged ChalePay PR! +₵450 Cedis.', '💻'); } } },
                    { title: 'Pitch Startup to Dr. Kobby', desc: 'Pitch pitch deck to angel investors', cost: 'Story', fn: () => { window.ui.openNpcDialogue('dr_kobby'); } },
                    { title: 'MoMo Crypto Remittance Gig', desc: 'Execute P2P transfers (+₵250 Cedis)', cost: 'Free', fn: () => { gameState.earnCedis(250); window.ui.showToast('MoMo Remittance settled! +₵250 Cedis.', '🪙'); } }
                ]
            },
            circle_trotro: {
                title: 'Circle Neoplan Station',
                emoji: '🚌',
                loc: 'Kwame Nkrumah Circle Interchange',
                desc: 'The central nerve center of Accra transit. Thousands of Trotros embarking across Ghana.',
                actions: [
                    { title: 'Open Trotro Empire Dashboard', desc: 'Manage your commercial fleet & routes', cost: 'Manage', fn: () => { window.ui.openTrotroEmpireModal(); } },
                    { title: 'Work Shift as Trotro Mate', desc: 'Shout "Accra! Kaneshie! Lapaz!" (+₵150 Cedis)', cost: 'Free', fn: () => { gameState.earnCedis(150); window.ui.showToast('Filled 3 buses at Circle! +₵150 Cedis.', '🚌'); } }
                ]
            },
            city_hall: {
                title: 'Accra City Hall (AMA)',
                emoji: '🏛️',
                loc: 'High Street, Accra',
                desc: 'Civic headquarters of the Accra Metropolitan Assembly. Mayoral elections and municipal governance.',
                actions: [
                    { title: 'Enter Mayor Chamber', desc: 'Vote in elections & view city policies', cost: 'Civic', fn: () => { window.ui.openMayorModal(); } }
                ]
            },
            labadi_beach: {
                title: 'Labadi Beach & Tawala',
                emoji: '🏖️',
                loc: 'Atlantic Coastline',
                desc: 'Accra most vibrant public beach. Horseback riding, reggae nights, grilled seafood, and waves.',
                actions: [
                    { title: 'Chop Grilled Tilapia & Banku', desc: '+80% Hunger, +40% Energy', cost: '₵45', fn: () => { gameState.feed(80, 40); gameState.spendCedis(45); window.ui.showToast('Hot grilled tilapia enjoyed with sea breeze!', '🐟'); } },
                    { title: 'Fresh Coconut on Beach', desc: '+40% Energy hydration', cost: '₵15', fn: () => { gameState.refillEnergy(40); gameState.spendCedis(15); window.ui.showToast('Sweet fresh coconut water enjoyed!', '🥥'); } },
                    { title: 'Host VIP Beach Cabana Party', desc: 'Detty December celebration (+600 Clout, +₵700 Cedis)', cost: '-25 Energy', fn: () => { if (gameState.useEnergy(25)) { gameState.earnCedis(700); gameState.addClout(600); window.ui.showToast('Shut down Labadi Beach rave! +₵700 Cedis.', '🎉'); } } },
                    { title: 'Meet Influencer Serwaa', desc: 'Story campaign dialogue', cost: 'Story', fn: () => { window.ui.openNpcDialogue('serwaa'); } }
                ]
            },
            makola_market: {
                title: 'Makola Market & Kantamanto',
                emoji: '🛒',
                loc: 'Central Accra Bazaar',
                desc: 'West Africa largest trading market. Fabrics, electronics, wholesale goods, and thrift drip.',
                actions: [
                    { title: 'Wholesale Commerce Hustle', desc: 'Buy goods wholesale and resell (+₵300 Cedis)', cost: '₵80', fn: () => { if (gameState.spendCedis(80)) { gameState.earnCedis(380); window.ui.showToast('Profitable day at Makola! +₵300 Cedis net.', '🛍️'); } } },
                    { title: 'Kantamanto Drip Hunt', desc: 'Search vintage streetwear racks (+40 Clout)', cost: '₵50', fn: () => { if (gameState.spendCedis(50)) { gameState.addClout(40); window.ui.showToast('Found rare vintage drip at Kantamanto!', '🧢'); } } }
                ]
            },
            stadium: {
                title: 'Accra Sports Stadium',
                emoji: '⚽',
                loc: 'Osu / Ministries',
                desc: 'National stadium and athletic complex. Home of the Black Stars and Hearts of Oak.',
                actions: [
                    { title: 'Derby Match VIP Ticket', desc: 'Watch Hearts of Oak vs Kotoko (+100 Clout)', cost: '₵60', fn: () => { gameState.spendCedis(60); gameState.addClout(100); window.ui.showToast('Epic 2-1 win at Accra Sports Stadium! 🇬🇭', '⚽'); } },
                    { title: 'Stadium Fitness Workout', desc: '100% Full Energy conditioning', cost: '₵25', fn: () => { gameState.spendCedis(25); gameState.refillEnergy(100); window.ui.showToast('Full stamina restored!', '💪'); } }
                ]
            },
            kempinski: {
                title: 'Kempinski Hotel Gold Coast',
                emoji: '🏨',
                loc: 'Ministries / Ridge',
                desc: 'Five-star luxury oasis in Accra. Diplomats, CEOs, and elite cocktail lounges.',
                actions: [
                    { title: 'Executive Suite Day Pass', desc: 'Restore 100% Energy, +400 Clout', cost: '₵600', fn: () => { if (gameState.spendCedis(600)) { gameState.refillEnergy(100); gameState.addClout(400); window.ui.showToast('Luxurious relaxation at Kempinski.', '🥂'); } else { alert('Not enough Cedis for 5-star Kempinski luxury!'); } } }
                ]
            },
            high_court: {
                title: 'High Court of Ghana',
                emoji: '⚖️',
                loc: 'High Street Judicial Quarter',
                desc: 'Superior Court of Judicature. Resolution of Ga land disputes and traditional council rulings.',
                actions: [
                    { title: 'Ga Council Title Registration', desc: 'Clear land title rights (+150 Clout)', cost: '₵120', fn: () => { gameState.spendCedis(120); gameState.addClout(150); window.ui.showToast('Land registry stamped by Ga Council.', '📜'); } }
                ]
            },
            salon: {
                title: "Sister Akua's Salon",
                emoji: '💇🏾‍♀️',
                loc: 'Oxford Street, Osu',
                desc: 'Top beauty parlor & barbershop. Fresh fades, box braids, lace wigs, and city gossip.',
                actions: [
                    { title: 'Open Wardrobe & Hairstyle Shop', desc: 'Customize your African drip & hair', cost: 'Style', fn: () => { window.ui.openWardrobe(); } }
                ]
            },
            papaye: {
                title: 'Papaye Fast Food',
                emoji: '🍕',
                loc: 'Osu Oxford Street',
                desc: 'Accra favorite roast chicken, fried rice, and chips since 1991.',
                actions: [
                    { title: 'Roasted Chicken & Jollof Meal', desc: '+70% Hunger, +30% Energy', cost: '₵40', fn: () => { gameState.feed(70, 30); gameState.spendCedis(40); window.ui.showToast('Delicious Papaye jollof enjoyed!', '🍗'); } }
                ]
            },
            sea_plots: {
                title: 'Atlantic Sea Plots',
                emoji: '🌊',
                loc: 'Gulf of Guinea Coast',
                desc: 'Prime floating advertising billboards anchored in the Atlantic waters.',
                actions: [
                    { title: 'Lease Atlantic Billboard', desc: 'Post your custom headline or ad', cost: 'Lease', fn: () => { window.ui.openSeaPlotsModal(); } }
                ]
            }
        };

        const v = venues[venueId] || venues.auntie_muni;

        const actionButtons = v.actions.map(a => `
            <button class="venue-action-btn" onclick="document.querySelector('.modal-overlay')?.remove(); (${a.fn.toString()})()">
                <div class="venue-action-title">${a.title}</div>
                <div class="venue-action-desc">${a.desc}</div>
                <div class="venue-action-cost">${a.cost}</div>
            </button>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 580px;">
                    <div class="modal-header">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 2.2rem;">${v.emoji}</span>
                            <div>
                                <h3 style="margin: 0;">${v.title}</h3>
                                <span style="font-size: 0.8rem; color: #38bdf8;">📍 ${v.loc}</span>
                            </div>
                        </div>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <p style="font-size: 0.88rem; color: #cbd5e1; margin: 10px 0 16px 0; line-height: 1.4;">
                        ${v.desc}
                    </p>

                    <h4 style="font-size: 0.82rem; color: #94a3b8; text-transform: uppercase;">Available Activities & Gigs</h4>
                    <div class="venue-action-grid">
                        ${actionButtons}
                    </div>
                </div>
            </div>
        `;
    }

    openVenuesModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const venuesList = [
            { id: 'auntie_muni', name: 'Auntie Muni Waakye', emoji: '🍛', desc: 'Osu Oxford Street' },
            { id: 'bloom_bar', name: 'Bloom Bar', emoji: '🪩', desc: 'Osu Nightlife Rooftop' },
            { id: 'bukom_boxing', name: 'Bukom Boxing Arena', emoji: '🥊', desc: 'Jamestown Heritage' },
            { id: 'mest_tech', name: 'MEST Tech Hub', emoji: '💡', desc: 'East Legon Silicon Accra' },
            { id: 'circle_trotro', name: 'Circle Trotro Station', emoji: '🚌', desc: 'Commuter Bus Terminal' },
            { id: 'city_hall', name: 'Accra City Hall (AMA)', emoji: '🏛️', desc: 'Mayoral Civic Center' },
            { id: 'labadi_beach', name: 'Labadi Beach', emoji: '🏖️', desc: 'Coastline Raves & Seafood' },
            { id: 'makola_market', name: 'Makola Market', emoji: '🛒', desc: 'Commercial Wholesale' },
            { id: 'stadium', name: 'Accra Sports Stadium', emoji: '⚽', desc: 'National Athletic Arena' },
            { id: 'kempinski', name: 'Kempinski Hotel', emoji: '🏨', desc: 'Five-Star Gold Coast' },
            { id: 'high_court', name: 'High Court of Ghana', emoji: '⚖️', desc: 'Judicial Quarter' },
            { id: 'salon', name: "Sister Akua's Salon", emoji: '💇🏾‍♀️', desc: 'African Hair & Drip' },
            { id: 'papaye', name: 'Papaye Fast Food', emoji: '🍕', desc: 'Fried Chicken & Jollof' },
            { id: 'sea_plots', name: 'Sea & Beach Plots', emoji: '🌊', desc: 'Gulf of Guinea Billboards' }
        ];

        const cards = venuesList.map(v => `
            <div class="travel-card" onclick="document.querySelector('.modal-overlay')?.remove(); window.ui.openVenue('${v.id}')">
                <div class="travel-img">${v.emoji}</div>
                <div class="travel-title">${v.name}</div>
                <div class="travel-desc">${v.desc}</div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 700px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🗺️ Accra City Landmarks & Directory</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 12px;">Tap any location to visit its venue card or pan the 3D isometric city map:</p>
                    <div class="travel-grid">
                        ${cards}
                    </div>
                </div>
            </div>
        `;
    }

    openSeaPlotsModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 500px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 6px;">🌊</div>
                    <h3>Lease an Atlantic Sea Billboard</h3>
                    <p style="font-size: 0.85rem; color: #94a3b8; margin: 8px 0 16px 0;">
                        Advertise your player handle, business, or greeting on the 3D billboard floating in the Gulf of Guinea!
                    </p>

                    <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                        <div style="font-size: 1.1rem; font-weight: 800; color: #38bdf8;">Weekly Sea Plot Lease: ₵2,500 Cedis</div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">Visible to all 28,000+ players navigating Accra waters.</p>
                    </div>

                    <button class="btn-submit" onclick="window.ui.leaseSeaPlotPrompt()">
                        Post Custom Billboard Ad (-₵2,500)
                    </button>
                </div>
            </div>
        `;
    }

    leaseSeaPlotPrompt() {
        if (gameState.data.cedis < 2500) {
            alert('You need ₵2,500 Cedis to lease an Atlantic billboard plot!');
            return;
        }
        const ad = prompt('Enter your billboard headline (e.g., Kwame is King of Accra!):', 'Ghana to the World! 🇬🇭');
        if (!ad) return;

        gameState.spendCedis(2500);
        gameState.addClout(500);
        audio.playCashJingle();
        document.querySelector('.modal-overlay')?.remove();
        this.showToast(`Billboard live on Accra waters: "${ad}"`, '🌊');
    }

    // --- 8. MONETIZATION & IAP MODALS ---
    triggerQuickAdCash() {
        monetization.showRewardedVideo('reward_cash_aid', () => {
            gameState.earnCedis(150);
            audio.playLevelUp();
            this.showToast('Claimed +₵150 Cedis sponsor grant!', '🪙');
            this.renderHUD(gameState.data);
        });
    }

    openMoMoShop() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>🪙 MTN MoMo & Paystack Store</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="shop-grid">
                        <div class="shop-card" onclick="window.ui.buyPackage('Waakye Pocket', 500, 0, 3.0)">
                            <span class="shop-badge">STARTER</span>
                            <div class="shop-title">Waakye Pocket</div>
                            <div class="shop-reward">+₵500 Cedis</div>
                            <div class="shop-price">GH₵ 3.00</div>
                        </div>
                        <div class="shop-card" onclick="window.ui.buyPackage('Osu Night Out', 2500, 25, 12.0)">
                            <span class="shop-badge popular">POPULAR</span>
                            <div class="shop-title">Osu Night Out</div>
                            <div class="shop-reward">+₵2,500 Cedis • +25 💎</div>
                            <div class="shop-price">GH₵ 12.00</div>
                        </div>
                        <div class="shop-card" onclick="window.ui.buyPackage('East Legon Boss', 10000, 150, 40.0)">
                            <span class="shop-badge best">BEST VALUE</span>
                            <div class="shop-title">East Legon Boss</div>
                            <div class="shop-reward">+₵10,000 Cedis • +150 💎</div>
                            <div class="shop-price">GH₵ 40.00</div>
                        </div>
                        <div class="shop-card" onclick="window.ui.buyPackage('Alvyd VIP Pass', 25000, 500, 75.0, true)">
                            <span class="shop-badge vip">VIP STATUS</span>
                            <div class="shop-title">Alvyd VIP Pass</div>
                            <div class="shop-reward">Infinite Energy • +₵25,000</div>
                            <div class="shop-price">GH₵ 75.00</div>
                        </div>
                    </div>
                    <div class="provider-bar">Supported: MTN MoMo, Telecel Cash, AT Money, Debit Cards</div>
                </div>
            </div>
        `;
    }

    buyPackage(name, cedis, gems, priceGHS, isVIP = false) {
        monetization.purchaseMoMoPackage({ name, cedis, gems, priceGHS, isVIP }).then((success) => {
            if (success) {
                document.querySelector('.modal-overlay')?.remove();
                this.renderHUD(gameState.data);
            }
        });
    }

    openLuckyWheel() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="text-align: center;">
                    <div class="modal-header">
                        <h3>🎡 Daily Accra Lucky Wheel</h3>
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
        this.showToast(`Changed outfit to ${outfit}!`, '👗');
    }

    setHair(hairStyle) {
        audio.playTap();
        gameState.data.avatar.hairStyle = hairStyle;
        gameState.save();
        this.showToast(`Changed hairstyle to ${hairStyle}!`, '✂️');
    }

    triggerDanceMenu() {
        audio.unlock();
        this.showToast('Azonto Groove Active! 🇬🇭', '🔥');
    }

    toggleAudio() {
        audio.toggleMute();
        const btn = document.getElementById('hud-audio-btn');
        if (btn) btn.textContent = audio.isMuted ? '🔇' : '🔊';
    }

    showToast(message, icon = "✨") {
        let toast = document.getElementById('hud-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'hud-toast';
            document.getElementById('game-hud')?.appendChild(toast);
        }
        toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    openAccountModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('open');
    }

    // --- 9. STORYLINE RPG & NARRATIVE METHODS ---
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
                            <p class="dialogue-line">"${ambient.line}"</p>
                        </div>
                        <button class="btn-submit" onclick="this.closest('.modal-overlay').remove()">
                            Close Dialogue
                        </button>
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

        if (quest.targetNpc && choice.affinity) {
            gameState.data.story.relationships[quest.targetNpc] = (gameState.data.story.relationships[quest.targetNpc] || 0) + choice.affinity;
        }

        gameState.data.story.choices[questId] = {
            choiceIdx,
            choiceText: choice.text,
            consequence: choice.consequence,
            timestamp: Date.now()
        };

        storyEngine.completeQuest(questId, choice.rewardDelta || {});
        audio.playQuestComplete();

        const cedisEarned = (quest.reward.cedis || 0) + (choice.rewardDelta?.cedis || 0);
        const cloutEarned = (quest.reward.clout || 0) + (choice.rewardDelta?.clout || 0);
        const gemsEarned = (quest.reward.gems || 0) + (choice.rewardDelta?.gems || 0);

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
                        Continue Adventure
                    </button>
                </div>
            </div>
        `;
    }

    claimDoubleStoryReward(cedis, clout) {
        monetization.showRewardedVideo('reward_double_story', () => {
            gameState.earnCedis(cedis);
            gameState.addClout(clout);
            audio.playLevelUp();
            this.showToast(`🎉 2x STORY BONUS CLAIMED: +₵${cedis} & +${clout} Clout!`, '📜');
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

                    <div style="margin-bottom: 18px;">
                        <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">
                            Accra RPG Chapters
                        </h4>
                        <div class="chapters-grid">
                            ${chaptersHtml}
                        </div>
                    </div>

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
