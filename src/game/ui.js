// Accra Life - User Interface & Full Life-Sim Management Engine (Lagos Life Clone)
// Features: Isometric City Top Bar, Mayor Broadcast, Origin Selector, Trotro Empire, Housing & Land Guards, Venues

import { gameState, ORIGINS, TROTRO_MODELS, TROTRO_ROUTES, ACCRA_HOUSING, MAYOR_POLICIES } from './state.js';
import { audio } from './audio.js';
import { monetization } from './monetization.js';
import { storyEngine, STORY_CHAPTERS, STORY_QUESTS } from './story.js';

export class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.initHUD();
        this.initEventListeners();

        // Subscribe to game state updates
        gameState.subscribe((data) => this.renderHUD(data));

        // Check if origin selected; if not, prompt on start
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
            <header id="hud-top" style="flex-direction: column; gap: 6px; padding: 10px 16px;">
                <div style="display: flex; width: 100%; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <!-- Brand & Online Counts -->
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="hud-profile" onclick="window.ui.openOriginModal()" title="View Origin & Social Status">
                            <div class="profile-avatar-circle" id="hud-avatar-circle">🇬🇭</div>
                            <div class="profile-info">
                                <div class="profile-name" id="hud-player-name">Kwame</div>
                                <div class="profile-title" id="hud-player-title">Accra Hustler • Lv.1</div>
                            </div>
                        </div>

                        <div class="city-stats-bar">
                            <span class="city-stat-pill online" title="Players live in Accra">🟢 16.4k online</span>
                            <span class="city-stat-pill" title="Total City Visits">👀 2.8m visits</span>
                            <span class="city-stat-pill" onclick="window.ui.openMayorModal()" id="hud-mayor-pill" title="Mayor of Accra">🏛️ Mayor @Kwame</span>
                            <span class="city-stat-pill" onclick="window.ui.openSeaPlotsModal()" title="Sea & Beach Plots">🌊 Beach Plots</span>
                            <span class="city-stat-pill" onclick="window.ui.openHousingModal()" title="Housing Market">🏘️ 450 homes</span>
                        </div>
                    </div>

                    <!-- Currencies & Stats Pills -->
                    <div class="hud-currencies">
                        <div class="currency-pill cedis" onclick="window.ui.openMoMoShop()" title="MTN MoMo Cash">
                            <span class="currency-icon">🪙</span>
                            <span id="hud-cedis-val">₵6,000</span>
                            <span class="currency-add">+</span>
                        </div>

                        <div class="currency-pill gems" onclick="window.ui.openMoMoShop()" title="Gold Gems">
                            <span class="currency-icon">💎</span>
                            <span id="hud-gems-val">25</span>
                            <span class="currency-add">+</span>
                        </div>

                        <div class="city-stat-pill" id="hud-origin-pill" onclick="window.ui.openOriginModal()" style="background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; color: #fbbf24;">
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

                        <button class="hud-icon-btn" onclick="window.ui.openAccountModal()" title="Cloud Save">
                            👤
                        </button>
                    </div>
                </div>

                <!-- Green Mayor Broadcast Banner (Lagos Life Style) -->
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

            <!-- Bottom Floating Action Navigation Dock -->
            <nav id="hud-dock" style="gap: 6px; padding: 8px 14px;">
                <button class="dock-btn" onclick="window.ui.openVenuesModal()">
                    <span class="dock-icon">🗺️</span>
                    <span class="dock-text">City Venues</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openTrotroEmpireModal()" style="border: 1px solid rgba(245, 158, 11, 0.4);">
                    <span class="dock-icon">🚌</span>
                    <span class="dock-text">Trotro Fleet</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openHousingModal()">
                    <span class="dock-icon">🏡</span>
                    <span class="dock-text">Housing</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openMayorModal()" style="border: 1px solid rgba(16, 185, 129, 0.4);">
                    <span class="dock-icon">🏛️</span>
                    <span class="dock-text">Mayor AMA</span>
                </button>

                <button class="dock-btn dock-btn-work" onclick="window.ui.triggerCurrentGig()">
                    <span class="dock-icon">💼</span>
                    <span class="dock-text">Hustle</span>
                </button>

                <button class="dock-btn dock-btn-story" onclick="window.ui.openStoryJournal()">
                    <span class="dock-icon">📜</span>
                    <span class="dock-text">Story</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openWardrobe()">
                    <span class="dock-icon">👗</span>
                    <span class="dock-text">Drip Shop</span>
                </button>

                <button class="dock-btn" onclick="window.ui.openPhoneModal()">
                    <span class="dock-icon">📱</span>
                    <span class="dock-text">ChaleApp</span>
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

    // --- 2. TROTRO TRANSPORT EMPIRE MODAL ---
    openTrotroEmpireModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const fleet = gameState.data.trotros || [];

        const fleetHtml = fleet.length === 0 ? `
            <div style="text-align: center; padding: 24px; background: rgba(255,255,255,0.04); border-radius: 12px; margin: 12px 0;">
                <div style="font-size: 2.5rem; margin-bottom: 6px;">🚌</div>
                <div style="font-weight: 700; color: #f8fafc;">No Trotros in your fleet yet!</div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin: 6px 0 12px 0;">Buy a Yellow Taxi or Mercedes 207 Bones Trotro below to start collecting daily commuter fares across Accra.</p>
            </div>
        ` : fleet.map(t => `
            <div class="trotro-card">
                <div>
                    <div class="trotro-header">
                        <div>
                            <div class="trotro-title">🚌 ${t.customName}</div>
                            <div class="trotro-route">📍 ${t.routeName}</div>
                        </div>
                        <span class="shop-badge best">Active Route</span>
                    </div>

                    <div class="trotro-stat-row">
                        <span>Bus Condition:</span>
                        <span style="font-weight: 700; color: ${t.condition > 50 ? '#34d399' : '#f87171'};">${t.condition}%</span>
                    </div>
                    <div class="condition-bar">
                        <div class="condition-fill" style="width: ${t.condition}%;"></div>
                    </div>

                    <div class="trotro-stat-row">
                        <span>Daily Fuel & Dues:</span>
                        <span>-₵${t.dailyFuel + t.dues} Cedis</span>
                    </div>
                    <div class="trotro-stat-row">
                        <span>Net Takings Ready:</span>
                        <span style="color: #34d399; font-weight: 800; font-size: 1rem;">+₵${t.takingsReady} Cedis</span>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button class="btn-submit" style="flex: 2;" onclick="window.ui.collectTrotroPay('${t.id}')">
                        🪙 Collect Fares (+₵${t.takingsReady})
                    </button>
                    <button class="btn-momo-buy" style="flex: 2;" onclick="window.ui.collectTrotroDoublePay('${t.id}')" title="Watch 6s Sponsor Ad for 2x Commuter Earnings">
                        📺 2x Fares
                    </button>
                    ${t.condition < 80 ? `
                        <button class="btn-standard" style="flex: 1;" onclick="window.ui.repairTrotro('${t.id}')">
                            🔧 Fix
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        const catalogHtml = TROTRO_MODELS.map(m => `
            <div class="shop-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="font-size: 2rem; margin-bottom: 4px;">🚌</div>
                    <div class="shop-title">${m.name}</div>
                    <p style="font-size: 0.78rem; color: #94a3b8; margin: 4px 0;">Seats: ${m.seats} • Base Fares: ₵${m.baseTakings}/day</p>
                    <div class="shop-price">₵${m.cost.toLocaleString()} Cedis</div>
                </div>
                <button class="btn-submit" style="margin-top: 10px;" onclick="window.ui.buyTrotroPrompt('${m.id}')">
                    Buy Vehicle
                </button>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 720px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🚌 Accra Trotro Transport Empire</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
                        <div style="font-weight: 800; color: #fbbf24; font-size: 0.95rem;">GPRTU Accra Transport Union Member</div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 3px;">
                            Buy buses, hire conductors ("mates"), assign routes across Circle, Madina, and East Legon, and collect passenger takings every day!
                        </p>
                    </div>

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Your Trotro Fleet (${fleet.length})</h4>
                    <div class="trotro-fleet-grid">
                        ${fleetHtml}
                    </div>

                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-top: 18px;">Commercial Vehicle Dealership</h4>
                    <div class="shop-grid">
                        ${catalogHtml}
                    </div>
                </div>
            </div>
        `;
    }

    buyTrotroPrompt(modelId) {
        const model = TROTRO_MODELS.find(m => m.id === modelId);
        if (!model) return;

        if (gameState.data.cedis < model.cost) {
            alert(`You need ₵${model.cost.toLocaleString()} Cedis to purchase this vehicle! Hustle more gigs or deposit via MTN MoMo.`);
            return;
        }

        const routeOptions = TROTRO_ROUTES.map(r => `
            <button class="story-choice-btn" onclick="window.ui.confirmBuyTrotro('${model.id}', '${r.id}')">
                <span class="choice-text">📍 ${r.name} (${r.demand} Demand)</span>
                <span class="choice-consequence">${r.multiplier}x Fare Multiplier</span>
            </button>
        `).join('');

        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3>Assign Route: ${model.name}</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 12px;">Choose a high-demand commuter route across Accra:</p>
                    <div class="dialogue-choices">
                        ${routeOptions}
                    </div>
                </div>
            </div>
        `;
    }

    confirmBuyTrotro(modelId, routeId) {
        audio.playCashJingle();
        const success = gameState.buyTrotro(modelId, routeId);
        if (success) {
            this.showToast('🎉 New Trotro added to your fleet! Commuter fares active.', '🚌');
            this.openTrotroEmpireModal();
        }
    }

    collectTrotroPay(trotroId) {
        audio.playCashJingle();
        const earned = gameState.collectTrotroTakings(trotroId, 1);
        this.showToast(`Collected +₵${earned} Cedis from your Trotro mate!`, '🪙');
        this.openTrotroEmpireModal();
    }

    collectTrotroDoublePay(trotroId) {
        monetization.showRewardedVideo('trotro_double_fares', () => {
            const earned = gameState.collectTrotroTakings(trotroId, 2);
            audio.playLevelUp();
            this.showToast(`🎉 2x SPONSOR BONUS! Collected +₵${earned} Cedis!`, '💰');
            this.openTrotroEmpireModal();
        });
    }

    repairTrotro(trotroId) {
        audio.playTap();
        const success = gameState.repairTrotro(trotroId);
        if (success) {
            this.showToast('Trotro repaired by Kokompe mechanics! Condition 100%.', '🔧');
            this.openTrotroEmpireModal();
        } else {
            alert('Not enough Cedis to repair this vehicle!');
        }
    }

    // --- 3. HOUSING, RENT & LAND GUARDS MODAL ---
    openHousingModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const currentHousing = gameState.data.housing;
        const plots = gameState.data.plots || [];

        const housingCatalogHtml = ACCRA_HOUSING.map(h => {
            const isCurrent = currentHousing.id === h.id;
            return `
                <div class="house-card ${isCurrent ? 'active' : ''}">
                    <div>
                        <div class="shop-title">${h.name}</div>
                        <div style="font-size: 0.78rem; color: #38bdf8; font-weight: 700; margin-bottom: 4px;">Landlord: ${h.landlord}</div>
                        <p style="font-size: 0.78rem; color: #cbd5e1; margin-bottom: 8px;">${h.desc}</p>
                        <div class="shop-price">₵${h.rent.toLocaleString()} / week</div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 10px;">
                        ${isCurrent ? `
                            <button class="btn-submit" disabled style="opacity: 0.6; flex: 1;">Current Residence</button>
                        ` : `
                            <button class="btn-submit" style="flex: 1;" onclick="window.ui.upgradeHomePrompt('${h.id}', false)">Rent (1 Mo)</button>
                            <button class="btn-momo-buy" style="flex: 1;" onclick="window.ui.upgradeHomePrompt('${h.id}', true)">2-Yr Advance</button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        const plotsHtml = plots.length === 0 ? `
            <div style="text-align: center; padding: 18px; background: rgba(255,255,255,0.04); border-radius: 12px; margin: 10px 0;">
                <p style="font-size: 0.82rem; color: #94a3b8;">No titled land plots yet. Buy land below in East Legon Hills or Pokuase to build your dream mansion.</p>
            </div>
        ` : plots.map(p => `
            <div class="house-card">
                <div class="trotro-header">
                    <div>
                        <div class="trotro-title">Plot in ${p.location}</div>
                        <div class="trotro-route">Stage: ${p.stage.toUpperCase()} (${p.progress}%)</div>
                    </div>
                    <span class="shop-badge ${p.landGuardStatus === 'peaceful' ? 'best' : 'vip'}">
                        ${p.landGuardStatus === 'peaceful' ? '✅ Peaceful Title' : '⚠️ Land Guards Disputed'}
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
                        <span style="color: #34d399; font-weight: 800; font-size: 0.85rem;">🎉 Building Completed!</span>
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
            this.showToast('Ga Traditional Council mediation completed. Land Guards stood down!', '🛡️');
            this.openHousingModal();
        }
    }

    advanceBuildingStage(plotId) {
        audio.playCashJingle();
        const success = gameState.advanceBuildingStage(plotId);
        if (success) {
            this.showToast('Building stage advanced! Concrete and roofing crew active.', '🧱');
            this.openHousingModal();
        }
    }

    // --- 4. MAYOR OF ACCRA (AMA) & CIVIC POLICIES MODAL ---
    openMayorModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const mayorData = gameState.data.mayor;
        const sittingMayor = mayorData.currentMayor;

        const candidatesHtml = mayorData.candidates.map(c => `
            <div class="candidate-item">
                <div class="candidate-info">
                    <div class="candidate-name">${c.name} <span class="policy-badge">${c.policy.replace('_', ' ').toUpperCase()}</span></div>
                    <div class="candidate-slogan">"${c.slogan}"</div>
                    <div style="font-size: 0.75rem; color: #34d399; font-weight: 700;">🗳️ ${c.votes.toLocaleString()} Votes</div>
                </div>
                <div>
                    ${mayorData.playerVote === c.name ? `
                        <button class="btn-submit" disabled style="opacity: 0.6; padding: 6px 14px;">Voted ✓</button>
                    ` : `
                        <button class="btn-submit" style="padding: 6px 14px;" onclick="window.ui.voteCandidate('${c.name}')">Vote</button>
                    `}
                </div>
            </div>
        `).join('');

        const policiesHtml = MAYOR_POLICIES.map(p => `
            <div class="shop-card" style="padding: 10px;">
                <div style="font-size: 1.4rem;">${p.emoji}</div>
                <div style="font-weight: 700; font-size: 0.88rem; margin: 3px 0;">${p.label}</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">${p.effect}</div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 680px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🏛️ Accra City Hall & Mayoral Elections</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <!-- Sitting Mayor Announcement -->
                    <div class="mayor-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <span class="shop-badge best">SITTING MAYOR OF ACCRA</span>
                                <div style="font-size: 1.3rem; font-weight: 800; color: #f8fafc; margin: 4px 0;">${sittingMayor.username}</div>
                                <div style="color: #34d399; font-weight: 700; font-size: 0.85rem;">Active Policy: ${sittingMayor.policy.replace('_', ' ').toUpperCase()}</div>
                            </div>
                            <div style="font-size: 2.5rem;">👑</div>
                        </div>
                        <p style="font-size: 0.85rem; color: #e2e8f0; margin-top: 10px; font-style: italic;">
                            "${sittingMayor.message}"
                        </p>
                    </div>

                    <!-- Active Policies -->
                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Accra City Policies</h4>
                    <div class="travel-grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); margin-bottom: 16px;">
                        ${policiesHtml}
                    </div>

                    <!-- Live Election Voting -->
                    <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Live Mayoral Election Ballot</h4>
                    <div class="candidates-list">
                        ${candidatesHtml}
                    </div>

                    <!-- Run for Mayor -->
                    <div style="background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 14px; margin-top: 14px;">
                        <div style="font-weight: 800; color: #fbbf24; margin-bottom: 4px;">Run for Mayor of Accra!</div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 10px;">
                            File candidacy (₵10,000 fee). Elected Mayors earn a weekly allowance of ₵25,000 Cedis and broadcast announcements to the entire city!
                        </p>
                        <button class="btn-momo-buy" onclick="window.ui.runForMayorPrompt()">
                            🏛️ File Candidacy (-₵10,000 Cedis)
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    voteCandidate(name) {
        audio.playTap();
        const success = gameState.voteForMayor(name);
        if (success) {
            this.showToast(`Cast your vote for ${name}! (+25 Clout)`, '🗳️');
            this.openMayorModal();
        }
    }

    runForMayorPrompt() {
        if (gameState.data.cedis < 10000) {
            alert('You need ₵10,000 Cedis filing fee to run for Mayor of Accra!');
            return;
        }

        const msg = prompt('Enter your campaign slogan for the Accra billboards:', 'Clean Streets & Free Wi-Fi for all Chales!');
        if (!msg) return;

        audio.playLevelUp();
        gameState.runForMayor(msg, 'waakye_subsidy');
        this.showToast('🏛️ Candidacy filed! You are officially on the Accra mayoral ballot.', '👑');
        this.openMayorModal();
    }

    // --- 5. VENUE ACTION MODALS (Clicking 3D pins / Landmarks) ---
    openVenue(venueId) {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const venues = {
            auntie_muni: {
                title: 'Auntie Muni Waakye',
                emoji: '🍛',
                loc: 'Oxford Street, Osu',
                desc: 'Legendary queen of Oxford Street Waakye. Steaming hot rice, beans, black shito, and wele.',
                actions: [
                    { title: 'Chop Big Waakye & Wele', desc: '+70% Hunger, +30% Energy', cost: '₵30', fn: () => { gameState.feed(70, 30); gameState.spendCedis(30); window.ui.showToast('Delicious Waakye enjoyed!', '🍛'); } },
                    { title: 'Chop Spicy Kelewele', desc: '+40% Hunger, +15% Energy', cost: '₵18', fn: () => { gameState.feed(40, 15); gameState.spendCedis(18); window.ui.showToast('Spicy fried plantain hits right!', '🔥'); } },
                    { title: 'Waakye Stall Apprentice Shift', desc: 'Pack food for hungry customers (+₵180 Cedis)', cost: 'Free', fn: () => { gameState.earnCedis(180); window.ui.showToast('Earned +₵180 Cedis at Waakye Stall!', '🪙'); } },
                    { title: 'Talk to Auntie Muni', desc: 'Story campaign mission dialogue', cost: 'Story', fn: () => { window.ui.openNpcDialogue('auntie_muni'); } }
                ]
            },
            bloom_bar: {
                title: 'Bloom Bar Osu',
                emoji: '🪩',
                loc: 'Osu Nightlife District',
                desc: 'The beating heart of Accra nightlife! Neon rooftop, top Afrobeats DJs, and VIP energy.',
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
                title: "Sister Akua's Salon & Barbershop",
                emoji: '💇🏾‍♀️',
                loc: 'Oxford Street Corner',
                desc: 'Premier African styling: Box Braids, High-Top Afro, Dreads, and razor-sharp Fades.',
                actions: [
                    { title: 'Open Wardrobe & Hairstyle Studio', desc: 'Customize your 3D avatar drip', cost: 'Free', fn: () => { window.ui.openWardrobe(); } }
                ]
            },
            papaye: {
                title: 'Papaye Fast Food',
                emoji: '🍕',
                loc: 'Spintex & Oxford St',
                desc: 'Ghana favorite fried chicken and jollof rice since 1991.',
                actions: [
                    { title: 'Papaye Crispy Chicken & Jollof', desc: '+90% Hunger, +40% Energy', cost: '₵48', fn: () => { gameState.feed(90, 40); gameState.spendCedis(48); window.ui.showToast('Papaye fried chicken hit the spot!', '🍗'); } }
                ]
            },
            sea_plots: {
                title: 'Sea & Beach Plots (Gulf of Guinea)',
                emoji: '🌊',
                loc: 'Accra Coastal Waters',
                desc: 'Digital advertising billboards anchored in the Atlantic Ocean, visible to all online players.',
                actions: [
                    { title: 'Lease Floating Sea Billboard', desc: 'Advertise your username or brand on Accra water', cost: 'Lease', fn: () => { window.ui.openSeaPlotsModal(); } }
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
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">Visible to all 16,000+ players navigating Accra waters.</p>
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

    openPhoneModal() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        if (!root) return;

        const d = gameState.data;

        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card" style="max-width: 440px;">
                    <div class="modal-header">
                        <h3>📱 Accra ChaleApp & MoMo Wallet</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>

                    <!-- Phone Screen Card -->
                    <div style="background: #0f172a; border: 2px solid #334155; border-radius: 20px; padding: 16px; margin-bottom: 14px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px;">
                            <span>MTN 5G GH 📶</span>
                            <span>Accra 12:40 PM</span>
                        </div>

                        <div style="text-align: center; margin-bottom: 16px;">
                            <div style="font-size: 0.8rem; color: #94a3b8;">MTN Mobile Money Balance</div>
                            <div style="font-size: 1.8rem; font-weight: 800; color: #fbbf24;">₵${d.cedis.toLocaleString()}</div>
                            <div style="font-size: 0.82rem; color: #38bdf8;">Reputation Clout: ✨ ${d.clout}</div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div class="shop-card" style="padding: 10px;" onclick="window.ui.openMoMoShop()">
                                <div style="font-size: 1.5rem;">💳</div>
                                <div style="font-size: 0.72rem; font-weight: 700; margin-top: 3px;">Top Up MoMo</div>
                            </div>
                            <div class="shop-card" style="padding: 10px;" onclick="window.ui.openTrotroEmpireModal()">
                                <div style="font-size: 1.5rem;">🚌</div>
                                <div style="font-size: 0.72rem; font-weight: 700; margin-top: 3px;">Trotros</div>
                            </div>
                            <div class="shop-card" style="padding: 10px;" onclick="window.ui.openHousingModal()">
                                <div style="font-size: 1.5rem;">🏡</div>
                                <div style="font-size: 0.72rem; font-weight: 700; margin-top: 3px;">Pay Rent</div>
                            </div>
                            <div class="shop-card" style="padding: 10px;" onclick="window.ui.openMayorModal()">
                                <div style="font-size: 1.5rem;">🏛️</div>
                                <div style="font-size: 0.72rem; font-weight: 700; margin-top: 3px;">Mayor AMA</div>
                            </div>
                            <div class="shop-card" style="padding: 10px;" onclick="window.ui.openWardrobe()">
                                <div style="font-size: 1.5rem;">👗</div>
                                <div style="font-size: 0.72rem; font-weight: 700; margin-top: 3px;">Drip Shop</div>
                            </div>
                            <div class="shop-card" style="padding: 10px;" onclick="window.ui.openStoryJournal()">
                                <div style="font-size: 1.5rem;">📜</div>
                                <div style="font-size: 0.72rem; font-weight: 700; margin-top: 3px;">Story</div>
                            </div>
                        </div>
                    </div>

                    <button class="btn-submit" onclick="this.closest('.modal-overlay').remove()">
                        Put Away Phone
                    </button>
                </div>
            </div>
        `;
    }

    // --- MONETIZATION & IAP MODALS ---
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

    triggerCurrentGig() {
        audio.playTap();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open" onclick="if(event.target===this) this.remove()">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>💼 Accra Hustle & Gigs</h3>
                        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="dialogue-choices">
                        <button class="story-choice-btn" onclick="window.ui.completeGig(200, 'Waakye Delivery Shift')">
                            <span class="choice-text">🍛 Waakye Delivery on Oxford St</span>
                            <span class="choice-consequence">+₵200 Cedis • +25 Clout</span>
                        </button>
                        <button class="story-choice-btn" onclick="window.ui.completeGig(350, 'Bloom Bar Guest DJ')">
                            <span class="choice-text">🎧 Bloom Bar Afrobeats DJ</span>
                            <span class="choice-consequence">+₵350 Cedis • +45 Clout</span>
                        </button>
                        <button class="story-choice-btn" onclick="window.ui.completeGig(500, 'FinTech Smart Contract Audit')">
                            <span class="choice-text">💻 East Legon FinTech Audit</span>
                            <span class="choice-consequence">+₵500 Cedis • +60 Clout</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    completeGig(pay, gigTitle) {
        audio.playCashJingle();
        document.querySelector('.modal-overlay')?.remove();
        const root = document.getElementById('modals-root');
        root.innerHTML = `
            <div class="modal-overlay open">
                <div class="modal-card quest-complete-card">
                    <div class="complete-icon">💼</div>
                    <div class="complete-title">${gigTitle} Completed!</div>
                    <div class="complete-payout">
                        <div class="payout-item">🪙 +₵${pay} Cedis</div>
                    </div>
                    <div style="background: rgba(245, 158, 11, 0.15); border: 1px dashed #f59e0b; border-radius: 12px; padding: 12px; margin: 14px 0;">
                        <div style="font-weight: 800; color: #fbbf24;">🎬 3x Sponsor Paycheck Multiplier!</div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin: 4px 0 8px 0;">Watch a 6s sponsor video to triple your pay to +₵${pay * 3} Cedis!</p>
                        <button class="btn-momo-buy" onclick="window.ui.claimTripleGigPay(${pay})">
                            📺 Watch 6s Ad to 3x Pay (+₵${pay * 3})
                        </button>
                    </div>
                    <button class="btn-submit" onclick="this.closest('.modal-overlay').remove(); window.gameState.earnCedis(${pay});">
                        Accept Base Pay (+₵${pay})
                    </button>
                </div>
            </div>
        `;
    }

    claimTripleGigPay(basePay) {
        monetization.showRewardedVideo('reward_triple_gig', () => {
            const triple = basePay * 3;
            gameState.earnCedis(triple);
            audio.playLevelUp();
            this.showToast(`🎉 3x PAYCHECK CLAIMED: +₵${triple} Cedis!`, '💰');
            document.querySelector('.modal-overlay')?.remove();
            this.renderHUD(gameState.data);
        });
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

    // --- STORYLINE RPG METHODS ---
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
