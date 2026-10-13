// Accra Life 3D - AAA Procedural Isometric Mega City Engine (Lagos Life Clone)
// Features: High-Res Procedural Facade Textures, Multi-Tier Architectural Landmarks,
// Sintex Tanks, Backup Generators, Stadium, Kempinski, Bloom Bar, Auntie Muni,
// High-Contrast Circular Floating Badges, Miniature Trotros & Cabs, Lighthouse Beacon, Animated Waves

import * as THREE from '../../libjs/three.module.js';

// Procedural Canvas Texture Generator for Ultra-Crisp Browser Visuals
class TextureGenerator {
    static createRoadTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Asphalt Base with subtle aggregate noise
        ctx.fillStyle = '#222831';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        for (let i = 0; i < 4000; i++) {
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }

        // Crisp White Side Lines
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(16, 0, 8, 512);
        ctx.fillRect(488, 0, 8, 512);

        // Yellow Dashed Median Line
        ctx.fillStyle = '#fbbf24';
        for (let y = 0; y < 512; y += 48) {
            ctx.fillRect(250, y, 12, 28);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    static createPitchTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Alternating green stripes
        const stripeH = 32;
        for (let y = 0; y < 512; y += stripeH) {
            ctx.fillStyle = (y / stripeH) % 2 === 0 ? '#15803d' : '#16a34a';
            ctx.fillRect(0, y, 512, stripeH);
        }

        // White Football Pitch Markings
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, 472, 472);

        // Halfway line
        ctx.beginPath();
        ctx.moveTo(20, 256);
        ctx.lineTo(492, 256);
        ctx.stroke();

        // Center circle & spot
        ctx.beginPath();
        ctx.arc(256, 256, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(256, 256, 6, 0, Math.PI * 2);
        ctx.fill();

        // Penalty Boxes
        ctx.strokeRect(136, 20, 240, 100);
        ctx.strokeRect(136, 392, 240, 100);

        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }

    static createFacadeTexture(type, colorScheme = {}) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (type === 'glass_skyscraper') {
            // Navy / cyan reflective skyscraper with lit office windows
            ctx.fillStyle = colorScheme.base || '#0f172a';
            ctx.fillRect(0, 0, 512, 512);

            const cols = 8;
            const rows = 12;
            const padX = 14;
            const padY = 10;
            const winW = (512 - padX * (cols + 1)) / cols;
            const winH = (512 - padY * (rows + 1)) / rows;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = padX + c * (winW + padX);
                    const y = padY + r * (winH + padY);

                    // Random warm light or reflective cyan
                    const isLit = Math.random() > 0.45;
                    ctx.fillStyle = isLit ? (Math.random() > 0.3 ? '#fef08a' : '#38bdf8') : '#1e293b';
                    ctx.fillRect(x, y, winW, winH);

                    // Glass frame
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, winW, winH);
                }
            }
        } else if (type === 'hotel_luxury') {
            // Cream sandstone with arched windows & golden trim
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(0, 0, 512, 512);

            // Floor dividers
            ctx.fillStyle = '#d97706';
            for (let y = 80; y < 512; y += 90) {
                ctx.fillRect(0, y, 512, 8);
            }

            // French windows with balconies
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 5; c++) {
                    const x = 30 + c * 95;
                    const y = 20 + r * 100;
                    ctx.fillStyle = '#1e3a8a';
                    ctx.fillRect(x, y, 48, 65);
                    ctx.strokeStyle = '#b45309';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x, y, 48, 65);

                    // Balcony railing
                    ctx.fillStyle = '#1f2937';
                    ctx.fillRect(x - 4, y + 45, 56, 20);
                }
            }
        } else if (type === 'chop_bar') {
            // Distressed wood planks & Ghanaian signage
            ctx.fillStyle = '#78350f';
            ctx.fillRect(0, 0, 512, 512);

            // Wood plank lines
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 6;
            for (let y = 0; y < 512; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(512, y);
                ctx.stroke();
            }

            // Big Hand-Painted Sign
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(20, 60, 472, 110);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 8;
            ctx.strokeRect(20, 60, 472, 110);

            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 38px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('AUNTIE MUNI WAAKYE', 256, 120);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px system-ui, sans-serif';
            ctx.fillText('HOT WAAKYE • SHITO • WELE • FISH', 256, 152);

            // Red-Yellow-Green Ghana flag border
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(20, 175, 157, 12);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(177, 175, 158, 12);
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(335, 175, 157, 12);
        } else if (type === 'nightclub') {
            // Neon pink / violet glowing facade
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, 512, 512);

            // Neon glowing lines
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 8;
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 15;
            ctx.strokeRect(40, 40, 432, 432);

            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 6;
            ctx.shadowColor = '#a855f7';
            ctx.strokeRect(80, 80, 352, 352);

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#f43f5e';
            ctx.font = '900 64px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('BLOOM BAR', 256, 260);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 28px system-ui, sans-serif';
            ctx.fillText('AFROBEATS • OSU ACCRA', 256, 310);
        } else if (type === 'market') {
            // Kente fabric patterns & market banners
            for (let y = 0; y < 512; y += 64) {
                ctx.fillStyle = (y / 64) % 3 === 0 ? '#ef4444' : ((y / 64) % 3 === 1 ? '#facc15' : '#16a34a');
                ctx.fillRect(0, y, 512, 64);
            }

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(30, 180, 452, 140);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 8;
            ctx.strokeRect(30, 180, 452, 140);

            ctx.fillStyle = '#facc15';
            ctx.font = '900 48px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MAKOLA MARKET', 256, 245);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px system-ui, sans-serif';
            ctx.fillText('TEXTILES • YAMS • PROVISIONS', 256, 290);
        } else if (type === 'tech_hub') {
            // Dark graphite with glowing cyan circuits
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 512, 512);

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 4;
            // Draw circuit lines
            ctx.beginPath();
            ctx.moveTo(50, 50); ctx.lineTo(200, 50); ctx.lineTo(250, 120); ctx.lineTo(450, 120);
            ctx.moveTo(50, 400); ctx.lineTo(180, 400); ctx.lineTo(230, 320); ctx.lineTo(460, 320);
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(200, 50, 8, 0, Math.PI * 2);
            ctx.arc(450, 120, 8, 0, Math.PI * 2);
            ctx.arc(180, 400, 8, 0, Math.PI * 2);
            ctx.arc(460, 320, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 54px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MEST AFRICA', 256, 240);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 24px monospace';
            ctx.fillText('< SILICON ACCRA />', 256, 280);
        } else if (type === 'fast_food') {
            // Papaye Red & Yellow
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(0, 0, 512, 512);

            ctx.fillStyle = '#facc15';
            ctx.fillRect(0, 80, 512, 160);

            ctx.fillStyle = '#b91c1c';
            ctx.font = '900 68px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('PAPAYE', 256, 175);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px system-ui, sans-serif';
            ctx.fillText('FAST FOOD • ROAST CHICKEN & CHIPS', 256, 225);
        }

        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }

    static createBillboardTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        if (type === 'mtn') {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(0, 0, 512, 256);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 12;
            ctx.strokeRect(6, 6, 500, 244);

            // MTN Oval
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.ellipse(256, 90, 110, 55, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffcc00';
            ctx.font = '900 52px Arial Black, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MTN', 256, 108);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 26px system-ui, sans-serif';
            ctx.fillText('Everywhere you go • MoMo *170#', 256, 185);

            ctx.fillStyle = '#1e3a8a';
            ctx.font = 'bold 20px system-ui, sans-serif';
            ctx.fillText('🚀 4G+ TURBO DATA SPEEDS IN ACCRA', 256, 220);
        } else if (type === 'guinness') {
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, 512, 256);
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 8;
            ctx.strokeRect(6, 6, 500, 244);

            ctx.fillStyle = '#d4af37';
            ctx.font = '900 48px Times New Roman, serif';
            ctx.textAlign = 'center';
            ctx.fillText('GUINNESS SMOOTH', 256, 95);

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 26px system-ui, sans-serif';
            ctx.fillText('SET THE VIBE • ACCRA NIGHTS', 256, 155);

            ctx.fillStyle = '#d4af37';
            ctx.font = 'bold 20px system-ui, sans-serif';
            ctx.fillText('18+ Drink Responsibly 🍻', 256, 205);
        } else if (type === 'real_estate') {
            ctx.fillStyle = '#064e3b';
            ctx.fillRect(0, 0, 512, 256);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 8;
            ctx.strokeRect(6, 6, 500, 244);

            ctx.fillStyle = '#fbbf24';
            ctx.font = '900 40px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('EAST LEGON HILLS PLOTS', 256, 80);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px system-ui, sans-serif';
            ctx.fillText('TITLED LAND • NO LAND GUARDS!', 256, 135);

            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 22px system-ui, sans-serif';
            ctx.fillText('Collect 2-Years Rent Advance 💰', 256, 185);
        }

        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }
}

export class WorldManager {
    constructor(scene) {
        this.scene = scene;
        this.environmentGroup = new THREE.Group();
        this.interactables = [];
        this.interactivePoints = [];
        this.floatingBadges = [];
        this.miniTrotros = [];
        this.pedestrians = [];
        this.fountainParticles = [];
        this.lighthouseLight = null;
        this.scene.add(this.environmentGroup);

        this.initMaterials();
        this.buildIsometricAccra();
    }

    initMaterials() {
        this.roadTex = TextureGenerator.createRoadTexture();
        this.pitchTex = TextureGenerator.createPitchTexture();

        this.materials = {
            terrainGrass: new THREE.MeshLambertMaterial({ color: 0x22c55e }),
            terrainGrassDark: new THREE.MeshLambertMaterial({ color: 0x15803d }),
            terrainSand: new THREE.MeshLambertMaterial({ color: 0xfef08a }),
            oceanWater: new THREE.MeshStandardMaterial({
                color: 0x0284c7,
                roughness: 0.1,
                metalness: 0.2,
                transparent: true,
                opacity: 0.88
            }),
            roadAsphalt: new THREE.MeshLambertMaterial({
                map: this.roadTex,
                color: 0xffffff
            }),
            sidewalkConcrete: new THREE.MeshLambertMaterial({ color: 0xd1d5db }),
            curbStone: new THREE.MeshLambertMaterial({ color: 0x9ca3af }),
            pitchMat: new THREE.MeshLambertMaterial({ map: this.pitchTex }),

            // Architectural Facades
            kempinskiFacade: new THREE.MeshStandardMaterial({
                map: TextureGenerator.createFacadeTexture('hotel_luxury'),
                roughness: 0.3,
                metalness: 0.3
            }),
            skyscrapersGlass: new THREE.MeshStandardMaterial({
                map: TextureGenerator.createFacadeTexture('glass_skyscraper'),
                roughness: 0.2,
                metalness: 0.7
            }),
            auntieMuniFacade: new THREE.MeshLambertMaterial({
                map: TextureGenerator.createFacadeTexture('chop_bar')
            }),
            bloomBarFacade: new THREE.MeshLambertMaterial({
                map: TextureGenerator.createFacadeTexture('nightclub')
            }),
            makolaFacade: new THREE.MeshLambertMaterial({
                map: TextureGenerator.createFacadeTexture('market')
            }),
            mestTechFacade: new THREE.MeshStandardMaterial({
                map: TextureGenerator.createFacadeTexture('tech_hub'),
                roughness: 0.3,
                metalness: 0.6
            }),
            papayeFacade: new THREE.MeshLambertMaterial({
                map: TextureGenerator.createFacadeTexture('fast_food')
            }),

            // Standard Architectural Accents
            whiteMarble: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
            roofTileRed: new THREE.MeshLambertMaterial({ color: 0xb91c1c }),
            poolWater: new THREE.MeshStandardMaterial({
                color: 0x06b6d4,
                roughness: 0.1,
                metalness: 0.1,
                transparent: true,
                opacity: 0.85
            }),
            sintexBlack: new THREE.MeshLambertMaterial({ color: 0x1e293b }),
            sintexBlue: new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }),
            generatorYellow: new THREE.MeshLambertMaterial({ color: 0xeab308 }),
            generatorGreen: new THREE.MeshLambertMaterial({ color: 0x15803d }),

            // Foliage & Details
            palmTrunk: new THREE.MeshLambertMaterial({ color: 0x78350f }),
            palmFrond: new THREE.MeshLambertMaterial({ color: 0x166534 }),
            treeFoliage: new THREE.MeshLambertMaterial({ color: 0x15803d }),

            // Vehicles
            trotroYellow: new THREE.MeshLambertMaterial({ color: 0xfacc15 }),
            trotroWhite: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
            trotroBlue: new THREE.MeshLambertMaterial({ color: 0x2563eb }),
            cabOrange: new THREE.MeshLambertMaterial({ color: 0xf97316 }),
            wheelMat: new THREE.MeshLambertMaterial({ color: 0x0f172a }),
            headlightGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),

            // Lights & FX
            warmLantern: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
            beaconBeam: new THREE.MeshBasicMaterial({
                color: 0xfef08a,
                transparent: true,
                opacity: 0.55
            })
        };
    }

    clearWorld() {
        while (this.environmentGroup.children.length > 0) {
            this.environmentGroup.remove(this.environmentGroup.children[0]);
        }
        this.interactables = [];
        this.interactivePoints = [];
        this.floatingBadges = [];
        this.miniTrotros = [];
        this.pedestrians = [];
        this.fountainParticles = [];
    }

    buildIsometricAccra() {
        this.clearWorld();

        // 1. Terrain Base (Zoned Urban Grid & Suburban Lots)
        this.createGroundGrid();

        // 2. Gulf of Guinea (Ocean Coastline & Labadi Sand Beach)
        this.createCoastalOcean();

        // 3. Main Highway Network (Ring Road, Oxford Street, Independence Ave)
        this.createRoadNetwork();

        // 4. Iconic Accra Architectural Landmarks (High-Detail Models)
        this.buildLandmarks();

        // 5. Accra Rooftop Realism: Sintex Poly Water Tanks & Backup Generators
        this.addAccraUrbanElements();

        // 6. 3D Advertising Billboard Towers (MTN, Guinness, Bloom Bar)
        this.createBillboardTowers();

        // 7. Lush Tropical Foliage & Coconut Palms
        this.scatterPalmTreesAndGardens();

        // 8. Animated Mini Trotros, Taxis & Pedestrians
        this.spawnTrafficAndPedestrians();
    }

    createGroundGrid() {
        // Main Accra Landmass with subtle suburban lot grid
        const landGeo = new THREE.PlaneGeometry(96, 68);
        const land = new THREE.Mesh(landGeo, this.materials.terrainGrass);
        land.rotation.x = -Math.PI / 2;
        land.position.set(0, 0, -10);
        land.receiveShadow = true;
        this.environmentGroup.add(land);

        // Darker green agricultural / park plots
        const parkGeo = new THREE.PlaneGeometry(24, 18);
        const park = new THREE.Mesh(parkGeo, this.materials.terrainGrassDark);
        park.rotation.x = -Math.PI / 2;
        park.position.set(-28, 0.01, -26);
        park.receiveShadow = true;
        this.environmentGroup.add(park);
    }

    createCoastalOcean() {
        // Labadi Beach Sand Strip
        const beachGeo = new THREE.PlaneGeometry(96, 9);
        const beach = new THREE.Mesh(beachGeo, this.materials.terrainSand);
        beach.rotation.x = -Math.PI / 2;
        beach.position.set(0, 0.02, 20);
        beach.receiveShadow = true;
        this.environmentGroup.add(beach);

        // Gulf of Guinea Ocean Plane
        const oceanGeo = new THREE.PlaneGeometry(96, 36);
        const ocean = new THREE.Mesh(oceanGeo, this.materials.oceanWater);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.set(0, 0.05, 41);
        this.environmentGroup.add(ocean);
        this.oceanMesh = ocean;

        // Wooden Jetty / Pier extending into water
        const pier = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 14), this.materials.palmTrunk);
        pier.position.set(2, 0.25, 29);
        this.environmentGroup.add(pier);

        // Speedboat tied to pier
        const boat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 4.5), this.materials.whiteMarble);
        boat.position.set(5, 0.2, 32);
        boat.rotation.y = 0.2;
        this.environmentGroup.add(boat);
    }

    createRoadNetwork() {
        // High-contrast roads with sidewalks & pedestrian crossings
        const makeRoad = (x, z, w, h, isVertical = false) => {
            const group = new THREE.Group();
            group.position.set(x, 0.03, z);

            // Sidewalk / Curb base
            const curb = new THREE.Mesh(
                new THREE.PlaneGeometry(w + (isVertical ? 2.4 : 0), h + (isVertical ? 0 : 2.4)),
                this.materials.sidewalkConcrete
            );
            curb.rotation.x = -Math.PI / 2;
            curb.position.y = 0.01;
            group.add(curb);

            // Road surface
            const road = new THREE.Mesh(new THREE.PlaneGeometry(w, h), this.materials.roadAsphalt);
            road.rotation.x = -Math.PI / 2;
            road.position.y = 0.02;
            group.add(road);

            this.environmentGroup.add(group);
        };

        // 1. Coastal Highway (East-West)
        makeRoad(0, 15, 96, 6, false);

        // 2. Central Ring Road (East-West)
        makeRoad(0, -10, 96, 6.5, false);

        // 3. North Airport Expressway (East-West)
        makeRoad(0, -32, 96, 6.5, false);

        // 4. Vertical Avenues (Oxford St, Independence Ave, High St, Liberation Rd)
        const avenues = [-26, -6, 14, 32];
        for (const aveX of avenues) {
            makeRoad(aveX, -8, 5.5, 54, true);
        }

        // Zebra Pedestrian Crossings at Key Intersections
        const zebraCoords = [
            [-26, 15], [-6, 15], [14, 15],
            [-26, -10], [-6, -10], [14, -10], [32, -10]
        ];
        for (const [zx, zz] of zebraCoords) {
            const zebra = new THREE.Group();
            zebra.position.set(zx, 0.06, zz);
            for (let i = -2; i <= 2; i += 0.8) {
                const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4.2), this.materials.whiteMarble);
                stripe.rotation.x = -Math.PI / 2;
                stripe.position.set(i, 0, 0);
                zebra.add(stripe);
            }
            this.environmentGroup.add(zebra);
        }

        // Modern Street Lamps along Oxford Street and Ring Road
        const lampX = [-38, -20, -12, 0, 8, 20, 38];
        for (const lx of lampX) {
            this.createStreetLamp(lx, 12);
            this.createStreetLamp(lx, -13);
        }
    }

    createStreetLamp(x, z) {
        const pole = new THREE.Group();
        pole.position.set(x, 0, z);

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.2, 6), this.materials.curbStone);
        post.position.y = 2.1;
        pole.add(post);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), this.materials.curbStone);
        arm.position.set(0.3, 4.2, 0);
        pole.add(arm);

        const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), this.materials.warmLantern);
        lantern.position.set(0.65, 4.15, 0);
        pole.add(lantern);

        this.environmentGroup.add(pole);
    }

    buildLandmarks() {
        // 1. Kempinski Hotel Gold Coast City (Tiered Luxury Hotel with Fountain & Pool)
        this.buildKempinskiHotel(8, 6);

        // 2. Accra Sports Stadium (Ohene Djan) (Oval Stadium with Pitch & Floodlights)
        this.buildAccraStadium(-6, 7);

        // 3. Auntie Muni Waakye (Authentic Chop Bar with Steaming Pots & Canopies)
        this.buildAuntieMuni(-16, -2);

        // 4. Osu Bloom Bar (Trendy Open-Air Pergola, Festoon Lights, DJ Stage)
        this.buildBloomBar(-20, 7);

        // 5. Makola Market (Commercial Bazaar with Umbrella Stalls)
        this.buildMakolaMarket(-35, -10);

        // 6. MEST Africa Tech Hub (Glass Silicon Accra Campus & Solar Panels)
        this.buildMestTechHub(22, -22);

        // 7. Accra City Hall (AMA / Mayor of Accra Neoclassical Colonnade & Clock Tower)
        this.buildCityHall(4, -2);

        // 8. High Court of Ghana (Classical Marble Courthouse & Scales)
        this.buildHighCourt(14, -2);

        // 9. Jamestown Lighthouse (Red & White Striped Beacon Tower)
        this.buildJamestownLighthouse(-36, 17);

        // 10. Bukom Boxing Arena (Open-Air Ring, Lighting Truss & Bags)
        this.buildBukomArena(-35, 6);

        // 11. East Legon Executive Mansions (Gated Villa, Pool, G-Wagon)
        this.buildEastLegonVilla(24, -8);

        // 12. Circle Neoplan Trotro Terminal & Interchange Flyover
        this.buildCircleInterchange(-6, -22);

        // 13. Papaye Fast Food Diner
        this.buildPapayeDiner(2, -18);

        // 14. Sister Akua's Salon & Barbershop
        this.buildSisterAkuaSalon(-10, -2);

        // 15. Labadi Beach Tawala Lounge & Surf
        this.buildLabadiBeach(20, 18);

        // 16. Floating Sea Plots Billboard (Gulf of Guinea)
        this.createSeaPlotsBillboard();

        // 17. Jamestown Compound House (Kwame's Hustler Compound Home)
        this.buildJamestownCompoundHouse(-28, 4);
    }

    // --- ARCHITECTURAL LANDMARK BUILDERS ---

    buildKempinskiHotel(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Tier 1 Base Podium
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 9), this.materials.kempinskiFacade);
        base.position.y = 1.5;
        group.add(base);

        // Tier 2 Tower
        const tower = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 7), this.materials.skyscrapersGlass);
        tower.position.y = 5.5;
        group.add(tower);

        // Tier 3 Crown Penthouse
        const crown = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 5), this.materials.whiteMarble);
        crown.position.y = 8.9;
        group.add(crown);

        // Rooftop Swimming Pool
        const pool = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 2.5), this.materials.poolWater);
        pool.position.set(0, 9.85, 0);
        group.add(pool);

        // Front Entrance Porte-Cochere & Circular Driveway
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 3), this.materials.whiteMarble);
        canopy.position.set(0, 2.2, 5.2);
        group.add(canopy);

        // Grand Fountain in driveway
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.4, 12), this.materials.whiteMarble);
        basin.position.set(0, 0.2, 7.5);
        group.add(basin);

        const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.3, 12), this.materials.poolWater);
        fountainWater.position.set(0, 0.3, 7.5);
        group.add(fountainWater);

        // Animated Fountain Spray Particles
        for (let i = 0; i < 8; i++) {
            const drop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 4, 4), this.materials.whiteMarble);
            drop.position.set(
                (Math.random() - 0.5) * 0.5,
                0.6 + Math.random() * 0.8,
                7.5 + (Math.random() - 0.5) * 0.5
            );
            group.add(drop);
            this.fountainParticles.push(drop);
        }

        // Rooftop Sintex Water Tanks
        this.addSintexTank(group, 2.2, 9.8, -1.5, 'blue');
        this.addSintexTank(group, 2.2, 9.8, -0.6, 'blue');

        this.environmentGroup.add(group);
        this.attachVenueBadge('kempinski', 'Kempinski Hotel', '🏨', x, 11.5, z);
    }

    buildAccraStadium(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Grandstand Stadium Outer Shell
        const stadiumOuter = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.5, 3.8, 16), this.materials.whiteMarble);
        stadiumOuter.position.y = 1.9;
        group.add(stadiumOuter);

        // Green Pitch inside
        const pitch = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 6), this.materials.pitchMat);
        pitch.position.set(0, 2.0, 0);
        group.add(pitch);

        // 4 Stadium Floodlight Towers with Spotlights
        const pylonCoords = [[-6, -5], [6, -5], [-6, 5], [6, 5]];
        for (const [px, pz] of pylonCoords) {
            const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 6.5, 6), this.materials.curbStone);
            pylon.position.set(px, 3.25, pz);
            group.add(pylon);

            const lightHead = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.4), this.materials.warmLantern);
            lightHead.position.set(px, 6.4, pz);
            lightHead.lookAt(0, 2, 0);
            group.add(lightHead);
        }

        this.environmentGroup.add(group);
        this.attachVenueBadge('stadium', 'Sports Stadium', '⚽', x, 6.2, z);
    }

    buildAuntieMuni(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Main Chop Bar Wooden Body with Waakye Facade Texture
        const main = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.6, 4), this.materials.auntieMuniFacade);
        main.position.y = 1.3;
        group.add(main);

        // Traditional Red & White Striped Awning
        const awning = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 2.2), this.materials.roofTileRed);
        awning.position.set(0, 2.7, 1.8);
        awning.rotation.x = 0.2;
        group.add(awning);

        // 3 Traditional Aluminum Cooking Cauldrons / Pots with Fireplace
        const potGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.6, 8);
        const potMat = this.materials.whiteMarble;
        const potCoords = [-1.5, 0, 1.5];
        for (const px of potCoords) {
            const hearth = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), this.materials.roofTileRed);
            hearth.position.set(px, 0.2, 2.4);
            group.add(hearth);

            const pot = new THREE.Mesh(potGeo, potMat);
            pot.position.set(px, 0.65, 2.4);
            group.add(pot);
        }

        // Dining Benches & Tables
        const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.8), this.materials.palmTrunk);
        table.position.set(0, 0.25, 4.0);
        group.add(table);

        // Standby Diesel Generator (Dumsor Resilience!)
        this.addBackupGenerator(group, -2.8, 0, 0);

        this.environmentGroup.add(group);
        this.attachVenueBadge('auntie_muni', 'Auntie Muni', '🍛', x, 4.8, z);
    }

    buildBloomBar(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Modern Club Body with Neon Bloom Facade Texture
        const main = new THREE.Mesh(new THREE.BoxGeometry(7, 3.8, 6.5), this.materials.bloomBarFacade);
        main.position.y = 1.9;
        group.add(main);

        // Open-air Timber Pergola Canopy on Roof
        for (let bx = -3.2; bx <= 3.2; bx += 1.2) {
            const beam = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 6.5), this.materials.palmTrunk);
            beam.position.set(bx, 4.0, 0);
            group.add(beam);
        }

        // Glowing String / Festoon Lights on Terrace
        for (let lx = -2.8; lx <= 2.8; lx += 0.9) {
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), this.materials.warmLantern);
            bulb.position.set(lx, 3.8, (Math.random() - 0.5) * 5);
            group.add(bulb);
        }

        // DJ Stage & Speaker Towers
        const djStage = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 1.5), this.materials.sintexBlack);
        djStage.position.set(0, 0.3, 4.2);
        group.add(djStage);

        this.environmentGroup.add(group);
        this.attachVenueBadge('bloom_bar', 'Bloom Bar', '🪩', x, 5.8, z);
    }

    buildMakolaMarket(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Central Commercial Market Pavilion
        const pavilion = new THREE.Mesh(new THREE.BoxGeometry(8, 3.4, 7), this.materials.makolaFacade);
        pavilion.position.y = 1.7;
        group.add(pavilion);

        // Colorful Market Umbrellas (Red, Yellow, Green, Blue Striped)
        const colors = [0xef4444, 0xfacc15, 0x16a34a, 0x2563eb, 0xf97316];
        const umbrellaCoords = [
            [-4.5, 3.5], [-2, 4.5], [1.5, 4.2], [4.2, 3.2],
            [-4.2, -3.5], [-1.8, -4.5], [2.2, -4.2], [4.5, -3.2]
        ];

        for (let i = 0; i < umbrellaCoords.length; i++) {
            const [ux, uz] = umbrellaCoords[i];
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6), this.materials.palmTrunk);
            pole.position.set(ux, 0.9, uz);
            group.add(pole);

            const canopyMat = new THREE.MeshLambertMaterial({ color: colors[i % colors.length] });
            const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.5, 8), canopyMat);
            canopy.position.set(ux, 1.9, uz);
            group.add(canopy);

            // Wooden Crate of Yams / Plantains underneath
            const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), this.materials.palmTrunk);
            crate.position.set(ux, 0.2, uz);
            group.add(crate);
        }

        this.environmentGroup.add(group);
        this.attachVenueBadge('makola_market', 'Makola Market', '🛒', x, 5.4, z);
    }

    buildMestTechHub(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Modern Silicon Accra Glass Tech Campus
        const main = new THREE.Mesh(new THREE.BoxGeometry(6.5, 8.5, 6.5), this.materials.mestTechFacade);
        main.position.y = 4.25;
        group.add(main);

        // Angled Solar Panel Array on Roof
        const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8, roughness: 0.2 });
        for (let sy = -2; sy <= 2; sy += 1.8) {
            const panel = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 1.2), solarMat);
            panel.position.set(0, 8.8, sy);
            panel.rotation.x = 0.35;
            group.add(panel);
        }

        // Rooftop Sintex Tanks
        this.addSintexTank(group, -2.0, 8.7, -2.0, 'blue');

        this.environmentGroup.add(group);
        this.attachVenueBadge('mest_tech', 'MEST Tech', '💡', x, 10.5, z);
    }

    buildCityHall(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Neoclassical Palace Body
        const main = new THREE.Mesh(new THREE.BoxGeometry(8, 4.8, 6), this.materials.whiteMarble);
        main.position.y = 2.4;
        group.add(main);

        // Stately Colonnade of 8 Doric Columns
        const colGeo = new THREE.CylinderGeometry(0.2, 0.22, 4.8, 8);
        for (let cx = -3.2; cx <= 3.2; cx += 0.9) {
            const col = new THREE.Mesh(colGeo, this.materials.whiteMarble);
            col.position.set(cx, 2.4, 3.4);
            group.add(col);
        }

        // Triangular Pediment / Entablature
        const pediment = new THREE.Mesh(new THREE.ConeGeometry(4.6, 1.6, 4), this.materials.whiteMarble);
        pediment.rotation.y = Math.PI / 4;
        pediment.position.set(0, 5.5, 2.2);
        group.add(pediment);

        // Central Clock Tower & Domed Cupola
        const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 2.4), this.materials.whiteMarble);
        tower.position.set(0, 6.2, 0);
        group.add(tower);

        const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.6, 12), this.materials.trotroYellow);
        clockFace.position.set(0, 6.6, 1.25);
        group.add(clockFace);

        // Ceremonial Flagpole flying Ghana Flag
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 5, 6), this.materials.curbStone);
        pole.position.set(3.2, 2.5, 4.8);
        group.add(pole);

        const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), this.materials.trotroYellow);
        flag.position.set(3.8, 4.5, 4.8);
        group.add(flag);

        this.environmentGroup.add(group);
        this.attachVenueBadge('city_hall', 'City Hall', '🏛️', x, 9.2, z);
    }

    buildHighCourt(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Classical Marble Courthouse
        const main = new THREE.Mesh(new THREE.BoxGeometry(6.5, 4.2, 5.5), this.materials.whiteMarble);
        main.position.y = 2.1;
        group.add(main);

        // Columns & Grand Steps
        const steps = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.5, 2), this.materials.curbStone);
        steps.position.set(0, 0.25, 3.5);
        group.add(steps);

        for (let cx = -2.4; cx <= 2.4; cx += 1.2) {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 4.2, 8), this.materials.whiteMarble);
            col.position.set(cx, 2.1, 3.1);
            group.add(col);
        }

        this.environmentGroup.add(group);
        this.attachVenueBadge('high_court', 'High Court', '⚖️', x, 6.2, z);
    }

    buildJamestownLighthouse(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Colonial Stone Keeper's Cottage
        const cottage = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 3), this.materials.whiteMarble);
        cottage.position.set(0, 1.1, 0);
        group.add(cottage);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.2, 4), this.materials.roofTileRed);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 2.8, 0);
        group.add(roof);

        // Red & White Striped Lighthouse Tower
        const bands = 7;
        const towerH = 10;
        const bandH = towerH / bands;
        for (let i = 0; i < bands; i++) {
            const mat = i % 2 === 0 ? this.materials.roofTileRed : this.materials.whiteMarble;
            const r1 = 1.1 - (i * 0.05);
            const r2 = 1.1 - ((i + 1) * 0.05);
            const section = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, bandH, 12), mat);
            section.position.y = 1.1 + (i * bandH) + bandH / 2;
            group.add(section);
        }

        // Observation Gallery & Lantern Room
        const gallery = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 12), this.materials.sintexBlack);
        gallery.position.y = 11.2;
        group.add(gallery);

        const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.2, 8), this.materials.warmLantern);
        lantern.position.y = 11.8;
        group.add(lantern);

        // Sweeping Rotating Beacon Light Beam
        const beamGeo = new THREE.ConeGeometry(2.5, 12, 12);
        beamGeo.rotateX(Math.PI / 2);
        const beam = new THREE.Mesh(beamGeo, this.materials.beaconBeam);
        beam.position.set(0, 11.8, 6);
        group.add(beam);
        this.lighthouseLight = beam;

        this.environmentGroup.add(group);
        this.attachVenueBadge('jamestown_light', 'Jamestown Lighthouse', '🗼', x, 13.5, z);
    }

    buildBukomArena(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Elevated Boxing Ring Platform
        const platform = new THREE.Mesh(new THREE.BoxGeometry(6, 0.8, 6), this.materials.sintexBlack);
        platform.position.y = 0.4;
        group.add(platform);

        // Canvas Mat inside
        const mat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 5), this.materials.whiteMarble);
        mat.position.y = 0.85;
        group.add(mat);

        // 4 Corner Ring Posts & Tension Ropes
        const posts = [[-2.4, -2.4], [2.4, -2.4], [-2.4, 2.4], [2.4, 2.4]];
        for (const [px, pz] of posts) {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), this.materials.trotroBlue);
            post.position.set(px, 1.7, pz);
            group.add(post);
        }

        // Overhead Square Lighting Truss
        const truss = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.2, 5.2), this.materials.curbStone);
        truss.position.y = 4.2;
        group.add(truss);

        // Hanging Punching Bag
        const bag = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8), this.materials.roofTileRed);
        bag.position.set(2.8, 1.6, 0);
        group.add(bag);

        this.environmentGroup.add(group);
        this.attachVenueBadge('bukom_boxing', 'Bukom Boxing', '🥊', x, 5.8, z);
    }

    buildEastLegonVilla(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Compound Base Courtyard Ground
        const patio = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), this.materials.sidewalkConcrete);
        patio.rotation.x = -Math.PI / 2;
        patio.position.y = 0.02;
        group.add(patio);

        // Perimeter Security Compound Wall with Electric Wire
        const wallMat = this.materials.whiteMarble;
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 9), wallMat);
        leftWall.position.set(-4.5, 0.8, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 9), wallMat);
        rightWall.position.set(4.5, 0.8, 0);
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(9, 1.6, 0.3), wallMat);
        backWall.position.set(0, 0.8, -4.5);
        group.add(leftWall, rightWall, backWall);

        // Automated Security Gate (Black Wrought Iron)
        const gate = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 0.1), this.materials.sintexBlack);
        gate.position.set(0, 0.75, 4.5);
        group.add(gate);

        // Luxury 2-Story Villa Mansion
        const house = new THREE.Mesh(new THREE.BoxGeometry(7, 4.2, 5), this.materials.whiteMarble);
        house.position.set(0, 2.1, -1);
        group.add(house);

        // Glass balcony & terrace
        const balc = new THREE.Mesh(new THREE.BoxGeometry(5, 0.6, 1.5), this.materials.skyscrapersGlass);
        balc.position.set(0, 2.6, 1.8);
        group.add(balc);

        // Master Bedroom Interior: 3D Luxury King Bed
        const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 2.5), this.materials.palmTrunk);
        bedFrame.position.set(1.5, 0.2, -1.8);
        const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 2.3), this.materials.whiteMarble);
        bedMattress.position.set(1.5, 0.4, -1.8);
        const duvet = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.22, 1.6), this.materials.trotroYellow);
        duvet.position.set(1.5, 0.48, -1.4);
        const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.4), this.materials.whiteMarble);
        pillow1.position.set(1.0, 0.6, -2.6);
        const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.4), this.materials.whiteMarble);
        pillow2.position.set(2.0, 0.6, -2.6);
        group.add(bedFrame, bedMattress, duvet, pillow1, pillow2);

        // Executive Drip Wardrobe Closet
        const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 0.8), this.materials.palmTrunk);
        wardrobe.position.set(-2.2, 1.4, -1.8);
        const handle1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.08), this.materials.trotroYellow);
        handle1.position.set(-2.4, 1.4, -1.38);
        const handle2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.08), this.materials.trotroYellow);
        handle2.position.set(-2.0, 1.4, -1.38);
        group.add(wardrobe, handle1, handle2);

        // Backyard Private Swimming Pool
        const pool = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 2.2), this.materials.poolWater);
        pool.position.set(2, 0.1, 2.6);
        group.add(pool);

        // Parked Mercedes-Benz G-Wagon in Driveway
        const gwagon = this.createCarMesh(0x0f172a);
        gwagon.position.set(-2.2, 0.4, 2.4);
        group.add(gwagon);

        // Sintex Tank & Backup Generator on roof/compound
        this.addSintexTank(group, 2.2, 4.4, -2.2, 'black');
        this.addBackupGenerator(group, -3.6, 0, -3.6);

        this.environmentGroup.add(group);

        // Register interactive house hotspots
        this.addInteractivePoint('east_legon_bed', "Kwame's Luxury Bed (Nap)", '🛏️', x + 1.5, 0.6, z - 1.8, 'bed', 'sleep');
        this.addInteractivePoint('east_legon_pool', "Private Swimming Pool (Swim)", '🏊', x + 2.0, 0.4, z + 2.6, 'pool', 'swim');
        this.addInteractivePoint('east_legon_wardrobe', "Executive Wardrobe (Drip)", '👗', x - 2.2, 1.0, z - 1.8, 'wardrobe', 'wardrobe');

        this.attachVenueBadge('housing', "Kwame's Villa (Home)", '🏡', x, 6.2, z);
    }

    buildJamestownCompoundHouse(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Compound Base Courtyard Ground
        const yard = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), this.materials.terrainSand);
        yard.rotation.x = -Math.PI / 2;
        yard.position.y = 0.02;
        group.add(yard);

        // Low Stone Courtyard Perimeter Walls
        const wallMat = this.materials.curbStone;
        const wLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 8), wallMat);
        wLeft.position.set(-4, 0.6, 0);
        const wRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 8), wallMat);
        wRight.position.set(4, 0.6, 0);
        const wBack = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 0.25), wallMat);
        wBack.position.set(0, 0.6, -4);
        group.add(wLeft, wRight, wBack);

        // Wooden Gate
        const gate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 0.1), this.materials.palmTrunk);
        gate.position.set(0, 0.5, 4);
        group.add(gate);

        // Single-Story Compound House
        const house = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.6, 4), this.materials.sidewalkConcrete);
        house.position.set(0, 1.3, -1.5);
        group.add(house);

        // Corrugated Red/Rusted Tin Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(4.8, 1.4, 4), this.materials.roofTileRed);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 3.2, -1.5);
        group.add(roof);

        // Veranda with wooden pillars
        const vPillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6);
        const p1 = new THREE.Mesh(vPillarGeo, this.materials.palmTrunk);
        p1.position.set(-2.8, 1.2, 0.8);
        const p2 = new THREE.Mesh(vPillarGeo, this.materials.palmTrunk);
        p2.position.set(2.8, 1.2, 0.8);
        group.add(p1, p2);

        // Veranda Awning
        const awning = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.15, 1.8), this.materials.roofTileRed);
        awning.position.set(0, 2.4, 0.2);
        awning.rotation.x = 0.2;
        group.add(awning);

        // Inside Bedroom: 3D Hustler Bed
        const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 2.2), this.materials.palmTrunk);
        bedFrame.position.set(0, 0.18, -1.5);
        const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 2.0), this.materials.whiteMarble);
        bedMattress.position.set(0, 0.35, -1.5);
        const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.18, 1.3), this.materials.trotroBlue);
        blanket.position.set(0, 0.42, -1.1);
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.35), this.materials.whiteMarble);
        pillow.position.set(0, 0.52, -2.2);
        group.add(bedFrame, bedMattress, blanket, pillow);

        // Courtyard: Communal Water Barrel / Basin & Tap
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.0, 10), this.materials.sintexBlue);
        barrel.position.set(2.4, 0.5, 2.2);
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.3, 8), this.materials.whiteMarble);
        basin.position.set(1.5, 0.15, 2.2);
        group.add(barrel, basin);

        // Clothesline with colorful Kente & shirts hanging
        const linePost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), this.materials.palmTrunk);
        linePost1.position.set(-3.2, 0.9, 1.5);
        const linePost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), this.materials.palmTrunk);
        linePost2.position.set(-1.0, 0.9, 1.5);
        const lineRope = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.2, 4), this.materials.whiteMarble);
        lineRope.rotation.z = Math.PI / 2;
        lineRope.position.set(-2.1, 1.7, 1.5);
        const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.7), this.materials.trotroYellow);
        cloth.position.set(-2.1, 1.35, 1.5);
        group.add(linePost1, linePost2, lineRope, cloth);

        this.environmentGroup.add(group);

        // Register interactive points
        this.addInteractivePoint('jamestown_bed', "Kwame's Compound Bed (Nap)", '🛏️', x, 0.5, z - 1.5, 'bed', 'sleep');
        this.addInteractivePoint('jamestown_basin', "Communal Water Basin (Wash)", '🪣', x + 1.5, 0.3, z + 2.2, 'basin', 'wash');

        this.attachVenueBadge('jamestown_home', "Kwame's Compound (Home)", '🏘️', x, 4.8, z);
    }

    buildCircleInterchange(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Elevated Highway Overpass Flyover Bridge
        const flyover = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 4.5), this.materials.curbStone);
        flyover.position.set(0, 4.2, 0);
        group.add(flyover);

        // Flyover Support Pillars
        const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 4.2, 8);
        const p1 = new THREE.Mesh(pillarGeo, this.materials.curbStone);
        p1.position.set(-5, 2.1, 0);
        const p2 = new THREE.Mesh(pillarGeo, this.materials.curbStone);
        p2.position.set(5, 2.1, 0);
        group.add(p1, p2);

        // Trotro Terminal Building & Waiting Bays below
        const terminal = new THREE.Mesh(new THREE.BoxGeometry(7, 2.4, 5), this.materials.trotroYellow);
        terminal.position.set(0, 1.2, 4.5);
        group.add(terminal);

        // GPRTU Station Master Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.3, 5.4), this.materials.sintexBlack);
        roof.position.set(0, 2.5, 4.5);
        group.add(roof);

        this.environmentGroup.add(group);
        this.attachVenueBadge('circle_trotro', 'Circle Trotro HQ', '🚌', x, 6.0, z);
    }

    buildPapayeDiner(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const diner = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.2, 4), this.materials.papayeFacade);
        diner.position.y = 1.6;
        group.add(diner);

        // Drive-Thru Canopy
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 2), this.materials.trotroYellow);
        canopy.position.set(0, 2.8, 2.2);
        group.add(canopy);

        this.environmentGroup.add(group);
        this.attachVenueBadge('papaye', 'Papaye Fast Food', '🍕', x, 4.8, z);
    }

    buildSisterAkuaSalon(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const salon = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.6, 3.4), this.materials.whiteMarble);
        salon.position.y = 1.3;
        group.add(salon);

        // Rotating Barber Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8), this.materials.roofTileRed);
        pole.position.set(2.1, 1.5, 1.8);
        group.add(pole);

        this.environmentGroup.add(group);
        this.attachVenueBadge('salon', "Akua's Salon", '💇🏾‍♀️', x, 4.2, z);
    }

    buildLabadiBeach(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Tawala Beach Bar Thatched Roof
        const bar = new THREE.Mesh(new THREE.BoxGeometry(5, 2.0, 4), this.materials.palmTrunk);
        bar.position.y = 1.0;
        group.add(bar);

        const thatch = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1.4, 6), this.materials.terrainSand);
        thatch.position.y = 2.7;
        group.add(thatch);

        // Tiki Umbrellas & Sun Loungers on the sand
        const tikiCoords = [[-3, 2], [3, 2], [-2, 4], [2, 4]];
        for (const [tx, tz] of tikiCoords) {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6), this.materials.palmTrunk);
            pole.position.set(tx, 0.9, tz);
            group.add(pole);

            const hat = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.6, 8), this.materials.terrainSand);
            hat.position.set(tx, 1.9, tz);
            group.add(hat);

            // Lounger
            const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 1.4), this.materials.whiteMarble);
            lounger.position.set(tx + 0.4, 0.1, tz);
            group.add(lounger);
        }

        this.environmentGroup.add(group);
        this.attachVenueBadge('labadi_beach', 'Labadi Beach', '🏖️', x, 4.8, z);
    }

    createSeaPlotsBillboard() {
        const group = new THREE.Group();
        group.position.set(2, 0, 36);

        // Floating Wooden Barge
        const barge = new THREE.Mesh(new THREE.BoxGeometry(11, 0.6, 6.5), this.materials.palmTrunk);
        barge.position.y = 0.3;
        group.add(barge);

        // Billboard Structure on Steel Truss
        const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.5, 6), this.materials.curbStone);
        post1.position.set(-3.5, 1.8, 0);
        const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.5, 6), this.materials.curbStone);
        post2.position.set(3.5, 1.8, 0);
        group.add(post1, post2);

        // Billboard Graphic Screen (High-Res Canvas)
        const screenMat = new THREE.MeshBasicMaterial({
            map: TextureGenerator.createBillboardTexture('real_estate')
        });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 3.6), screenMat);
        screen.position.set(0, 3.6, 0.1);
        group.add(screen);

        this.environmentGroup.add(group);
        this.attachVenueBadge('sea_plots', 'Sea Plots', '🌊', 2, 6.5, 36);
    }

    createBillboardTowers() {
        // Highway Billboard 1: MTN Ghana
        this.createSingleBillboard(-14, 18, 'mtn', Math.PI);

        // Highway Billboard 2: Guinness Smooth
        this.createSingleBillboard(14, -13, 'guinness', 0);
    }

    createSingleBillboard(x, z, type, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        group.rotation.y = rotY;

        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6.5, 8), this.materials.curbStone);
        pylon.position.y = 3.25;
        group.add(pylon);

        const screenMat = new THREE.MeshBasicMaterial({
            map: TextureGenerator.createBillboardTexture(type)
        });
        const board = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.4), screenMat);
        board.position.set(0, 6.5, 0.1);
        group.add(board);

        // Backplate
        const back = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.4), this.materials.sintexBlack);
        back.position.set(0, 6.5, -0.05);
        back.rotation.y = Math.PI;
        group.add(back);

        this.environmentGroup.add(group);
    }

    // --- ACCRA ROOFTOP REALISM UTILITIES ---

    addSintexTank(group, x, y, z, color = 'black') {
        const mat = color === 'blue' ? this.materials.sintexBlue : this.materials.sintexBlack;
        // Cylindrical tank with conical lid
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.9, 10), mat);
        tank.position.set(x, y + 0.45, z);
        group.add(tank);

        const lid = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.25, 10), mat);
        lid.position.set(x, y + 1.0, z);
        group.add(lid);
    }

    addBackupGenerator(group, x, y, z) {
        // Mikano / Cummins standby diesel generator enclosure
        const gen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.8), this.materials.generatorYellow);
        gen.position.set(x, y + 0.45, z);
        group.add(gen);

        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), this.materials.curbStone);
        exhaust.position.set(x + 0.4, y + 1.1, z);
        group.add(exhaust);
    }

    addAccraUrbanElements() {
        // Scatter Sintex water tanks on other commercial and residential rooftops
        const tankSpots = [
            [4, 4.8, -2],   // City Hall wing
            [14, 4.2, -2],  // High Court wing
            [-6, 3.8, 7],   // Stadium concourse
            [-10, 2.6, -2]  // Sister Akua salon
        ];
        for (const [tx, ty, tz] of tankSpots) {
            this.addSintexTank(this.environmentGroup, tx, ty, tz, 'black');
        }
    }

    // --- CRISP CIRCULAR FLOATING BADGES (LAGOS LIFE STYLE) ---

    attachVenueBadge(venueId, name, emoji, x, y, z) {
        // High-contrast, pristine circular badge disc matching Lagos Life
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Crisp Circular White Disc
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(64, 64, 58, 0, Math.PI * 2);
        ctx.fill();

        // Sleek subtle border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 6;
        ctx.stroke();

        // High-DPI Emoji Icon in Center
        ctx.font = '68px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 64, 68);

        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({
            map: tex,
            depthTest: false,
            transparent: true
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(x, y, z);
        sprite.scale.set(3.2, 3.2, 1);
        this.environmentGroup.add(sprite);

        // Register for hovering sinusoidal animation
        this.floatingBadges.push({
            sprite,
            baseY: y,
            timeOffset: Math.random() * Math.PI * 2
        });

        // Click Hitbox for Raycasting
        const hitbox = new THREE.Mesh(
            new THREE.BoxGeometry(6, 6, 6),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitbox.position.set(x, y, z);
        hitbox.userData = { type: 'venue', venueId, name, emoji, posX: x, posZ: z };
        this.environmentGroup.add(hitbox);
        this.interactables.push(hitbox);

        this.interactivePoints.push({
            id: venueId,
            name,
            emoji,
            x,
            y,
            z,
            subType: 'venue',
            actionKey: venueId
        });
    }

    addInteractivePoint(id, name, emoji, posX, posY, posZ, subType = 'feature', actionKey = null) {
        const hitbox = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitbox.position.set(posX, posY, posZ);
        hitbox.userData = {
            type: 'interactive_point',
            pointId: id,
            name,
            emoji,
            posX,
            posY,
            posZ,
            subType,
            actionKey: actionKey || id
        };
        this.environmentGroup.add(hitbox);
        this.interactables.push(hitbox);
        this.interactivePoints.push({
            id,
            name,
            emoji,
            x: posX,
            y: posY,
            z: posZ,
            subType,
            actionKey: actionKey || id
        });
        return hitbox;
    }

    // --- CARS, TROTROS & PEDESTRIANS ---

    createCarMesh(colorHex) {
        const car = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: colorHex });

        const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 1.1), bodyMat);
        chassis.position.y = 0.3;
        car.add(chassis);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.95), this.materials.whiteMarble);
        cabin.position.set(-0.1, 0.75, 0);
        car.add(cabin);

        // 4 Wheels
        const wGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 8);
        wGeo.rotateZ(Math.PI / 2);
        const w1 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w1.position.set(-0.6, 0.22, 0.55);
        const w2 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w2.position.set(0.6, 0.22, 0.55);
        const w3 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w3.position.set(-0.6, 0.22, -0.55);
        const w4 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w4.position.set(0.6, 0.22, -0.55);
        car.add(w1, w2, w3, w4);

        return car;
    }

    createTrotroMesh(type = 'bones') {
        const bus = new THREE.Group();
        const isTaxi = type === 'taxi';

        if (isTaxi) {
            // Yellow Accra Taxi with Orange Fender Panels
            const taxi = this.createCarMesh(0xfacc15);
            // Orange fenders
            const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 1.12), this.materials.cabOrange);
            f1.position.set(0.8, 0.35, 0);
            taxi.add(f1);
            return taxi;
        }

        // Full Mercedes 207 Bones Trotro
        const bodyMat = type === 'sprinter' ? this.materials.trotroWhite : this.materials.trotroYellow;
        const busBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.3, 1.3), bodyMat);
        busBody.position.y = 0.85;
        bus.add(busBody);

        // Trotro Windows & Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, 1.32), this.materials.whiteMarble);
        roof.position.y = 1.55;
        bus.add(roof);

        // Rear window "Nyame Nhyira" Ghanaian slogan banner
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.3), this.materials.sintexBlack);
        sign.position.set(-1.51, 1.2, 0);
        sign.rotation.y = -Math.PI / 2;
        bus.add(sign);

        // Headlights
        const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.2), this.materials.headlightGlow);
        h1.position.set(1.5, 0.7, 0.45);
        const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.2), this.materials.headlightGlow);
        h2.position.set(1.5, 0.7, -0.45);
        bus.add(h1, h2);

        // Wheels
        const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 8);
        wGeo.rotateZ(Math.PI / 2);
        const w1 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w1.position.set(-0.9, 0.28, 0.65);
        const w2 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w2.position.set(0.9, 0.28, 0.65);
        const w3 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w3.position.set(-0.9, 0.28, -0.65);
        const w4 = new THREE.Mesh(wGeo, this.materials.wheelMat);
        w4.position.set(0.9, 0.28, -0.65);
        bus.add(w1, w2, w3, w4);

        return bus;
    }

    spawnTrafficAndPedestrians() {
        // Spawn 6 animated Trotros & Taxis navigating Accra avenues
        const routeConfigs = [
            { x: -38, z: 15, dx: 0.16, dz: 0, minX: -44, maxX: 44, type: 'bones' },
            { x: 38, z: 15, dx: -0.14, dz: 0, minX: -44, maxX: 44, type: 'taxi' },
            { x: -40, z: -10, dx: 0.18, dz: 0, minX: -44, maxX: 44, type: 'sprinter' },
            { x: 40, z: -10, dx: -0.15, dz: 0, minX: -44, maxX: 44, type: 'bones' },
            { x: -26, z: -30, dx: 0, dz: 0.14, minZ: -32, maxZ: 14, type: 'taxi' },
            { x: 14, z: 12, dx: 0, dz: -0.16, minZ: -32, maxZ: 14, type: 'bones' }
        ];

        for (const cfg of routeConfigs) {
            const vehicle = this.createTrotroMesh(cfg.type);
            vehicle.position.set(cfg.x, 0, cfg.z);
            if (cfg.dx < 0) vehicle.rotation.y = Math.PI;
            if (cfg.dz > 0) vehicle.rotation.y = -Math.PI / 2;
            if (cfg.dz < 0) vehicle.rotation.y = Math.PI / 2;

            this.environmentGroup.add(vehicle);
            this.miniTrotros.push({ group: vehicle, config: cfg });
        }

        // Spawn 8 animated Ghanaian pedestrians walking along the sidewalks
        const pedCoords = [
            [-24, 12, 0.04, 0], [-10, 12, -0.03, 0], [10, 12, 0.035, 0],
            [-24, -13, -0.04, 0], [-8, -13, 0.04, 0], [12, -13, -0.035, 0],
            [-28, 2, 0, 0.03], [12, 2, 0, -0.03]
        ];

        for (const [px, pz, dx, dz] of pedCoords) {
            const person = new THREE.Group();
            person.position.set(px, 0.5, pz);

            // Body in colorful Kente / clothing
            const bodyMat = new THREE.MeshLambertMaterial({
                color: Math.random() > 0.5 ? 0xf59e0b : (Math.random() > 0.5 ? 0xef4444 : 0x2563eb)
            });
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.7, 6), bodyMat);
            torso.position.y = 0.35;
            person.add(torso);

            // Head
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 6), this.materials.palmTrunk);
            head.position.y = 0.85;
            person.add(head);

            this.environmentGroup.add(person);
            this.pedestrians.push({ group: person, dx, dz, baseX: px, baseZ: pz });
        }
    }

    scatterPalmTreesAndGardens() {
        const treeLocations = [
            // Beach Coastline Palms
            [-40, 19], [-34, 21], [-28, 19], [-22, 21], [-16, 19], [-8, 21],
            [2, 19], [8, 21], [16, 19], [26, 21], [32, 19], [38, 21],
            // Avenue Island Palms
            [-20, 2], [-14, 2], [-2, 2], [6, 2], [18, 2], [28, 2],
            // North Gardens
            [-32, -22], [-20, -22], [18, -16], [34, -16]
        ];

        for (const [tx, tz] of treeLocations) {
            this.createCoconutPalm(tx, tz);
        }
    }

    createCoconutPalm(x, z) {
        const tree = new THREE.Group();
        tree.position.set(x, 0, z);

        // Segmented, curved trunk
        const segments = 5;
        let currY = 0;
        let currX = 0;
        const lean = (Math.random() - 0.5) * 0.15;

        for (let i = 0; i < segments; i++) {
            const h = 0.8;
            const r1 = 0.22 - (i * 0.02);
            const r2 = 0.20 - (i * 0.02);
            const seg = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, h, 6), this.materials.palmTrunk);
            seg.position.set(currX, currY + h / 2, 0);
            seg.rotation.z = lean * i;
            tree.add(seg);

            currY += h;
            currX += lean * h;
        }

        // Coconuts cluster
        for (let c = 0; c < 3; c++) {
            const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.15, 4, 4), this.materials.palmTrunk);
            coconut.position.set(currX + (Math.random() - 0.5) * 0.3, currY, (Math.random() - 0.5) * 0.3);
            tree.add(coconut);
        }

        // 8 Radiating Palm Fronds
        for (let a = 0; a < 8; a++) {
            const angle = (a / 8) * Math.PI * 2;
            const frondGeo = new THREE.BoxGeometry(2.4, 0.08, 0.45);
            frondGeo.translate(1.2, 0, 0);
            const frond = new THREE.Mesh(frondGeo, this.materials.palmFrond);
            frond.position.set(currX, currY, 0);
            frond.rotation.y = angle;
            frond.rotation.z = -0.35 + Math.random() * 0.1;
            tree.add(frond);
        }

        this.environmentGroup.add(tree);
    }

    // --- RENDER LOOP ANIMATIONS ---

    update(delta) {
        const time = Date.now() * 0.0025;

        // 1. Gently animate floating circular venue badges (Lagos Life hovering style)
        for (const item of this.floatingBadges) {
            item.sprite.position.y = item.baseY + Math.sin(time + item.timeOffset) * 0.32;
        }

        // 2. Animate mini Trotros & Taxis driving along avenues
        for (const trotro of this.miniTrotros) {
            const { group, config } = trotro;
            group.position.x += config.dx;
            group.position.z += config.dz;

            if (config.dx > 0 && group.position.x > config.maxX) group.position.x = config.minX;
            if (config.dx < 0 && group.position.x < config.minX) group.position.x = config.maxX;
            if (config.dz > 0 && group.position.z > config.maxZ) group.position.z = config.minZ;
            if (config.dz < 0 && group.position.z < config.minZ) group.position.z = config.maxZ;
        }

        // 3. Animate Pedestrians strolling along sidewalks
        for (const ped of this.pedestrians) {
            ped.group.position.x += ped.dx;
            ped.group.position.z += ped.dz;
            if (Math.hypot(ped.group.position.x - ped.baseX, ped.group.position.z - ped.baseZ) > 8) {
                ped.dx = -ped.dx;
                ped.dz = -ped.dz;
            }
        }

        // 4. Rotating Jamestown Lighthouse Light Beam
        if (this.lighthouseLight) {
            this.lighthouseLight.rotation.z += 0.035;
        }

        // 5. Fountain Water Droplet Particles
        for (const drop of this.fountainParticles) {
            drop.position.y += 0.03;
            if (drop.position.y > 1.8) {
                drop.position.y = 0.6;
            }
        }

        // 6. Gentle Ocean Waves Shimmer
        if (this.oceanMesh) {
            this.oceanMesh.position.y = 0.05 + Math.sin(time * 0.7) * 0.04;
        }
    }
}
