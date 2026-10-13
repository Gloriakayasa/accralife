// Accra Life 3D - Isometric Mega City World (Lagos Life Clone)
// Features: Gulf of Guinea Ocean, Ring Road, Oxford St, Low-Poly Landmarks, Floating Pin Badges, Animated Miniature Trotros

import * as THREE from '../../libjs/three.module.js';

export class WorldManager {
    constructor(scene) {
        this.scene = scene;
        this.environmentGroup = new THREE.Group();
        this.interactables = [];
        this.pinSprites = [];
        this.miniTrotros = [];
        this.scene.add(this.environmentGroup);

        this.initMaterials();
        this.buildIsometricAccra();
    }

    initMaterials() {
        this.materials = {
            terrainGrass: new THREE.MeshLambertMaterial({ color: 0x15803d }),
            terrainSand: new THREE.MeshLambertMaterial({ color: 0xfef08a }),
            oceanWater: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.1 }),
            roadAsphalt: new THREE.MeshLambertMaterial({ color: 0x1e293b }),
            roadStripe: new THREE.MeshLambertMaterial({ color: 0xfacc15 }),
            sidewalk: new THREE.MeshLambertMaterial({ color: 0x94a3b8 }),
            buildingWhite: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
            buildingModern: new THREE.MeshLambertMaterial({ color: 0x0f172a }),
            buildingBrick: new THREE.MeshLambertMaterial({ color: 0xb91c1c }),
            buildingKenteYellow: new THREE.MeshLambertMaterial({ color: 0xf59e0b }),
            glassBlue: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.75 }),
            palmBark: new THREE.MeshLambertMaterial({ color: 0x78350f }),
            palmLeaves: new THREE.MeshLambertMaterial({ color: 0x166534 }),
            neonPink: new THREE.MeshBasicMaterial({ color: 0xf43f5e }),
            neonGold: new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
            trotroYellow: new THREE.MeshLambertMaterial({ color: 0xf59e0b }),
            trotroWhite: new THREE.MeshLambertMaterial({ color: 0xffffff })
        };
    }

    clearWorld() {
        while (this.environmentGroup.children.length > 0) {
            this.environmentGroup.remove(this.environmentGroup.children[0]);
        }
        this.interactables = [];
        this.pinSprites = [];
        this.miniTrotros = [];
    }

    buildIsometricAccra() {
        this.clearWorld();

        // 1. Terrain Landmass (North / Central Accra)
        const landGeo = new THREE.PlaneGeometry(90, 60);
        const land = new THREE.Mesh(landGeo, this.materials.terrainGrass);
        land.rotation.x = -Math.PI / 2;
        land.position.set(0, 0, -10);
        land.receiveShadow = true;
        this.environmentGroup.add(land);

        // 2. Coastline Beach (Labadi Sand strip)
        const beachGeo = new THREE.PlaneGeometry(90, 8);
        const beach = new THREE.Mesh(beachGeo, this.materials.terrainSand);
        beach.rotation.x = -Math.PI / 2;
        beach.position.set(0, 0.02, 20);
        beach.receiveShadow = true;
        this.environmentGroup.add(beach);

        // 3. Gulf of Guinea (Atlantic Ocean)
        const oceanGeo = new THREE.PlaneGeometry(90, 32);
        const ocean = new THREE.Mesh(oceanGeo, this.materials.oceanWater);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.set(0, 0.04, 38);
        this.environmentGroup.add(ocean);
        this.oceanMesh = ocean;

        // 4. Main Highway Grid (Ring Road, Oxford Street, Independence Ave)
        this.createRoadNetwork();

        // 5. Build Iconic Accra 3D Landmarks
        this.buildLandmarks();

        // 6. Spawn Animated Mini Trotros along the roads
        this.spawnMiniTrotros();

        // 7. Ambient Palm Trees & Streetlights
        this.scatterPalmTrees();
    }

    createRoadNetwork() {
        // Main Coastal Highway (East-West)
        const coastRoad = new THREE.Mesh(new THREE.PlaneGeometry(90, 6), this.materials.roadAsphalt);
        coastRoad.rotation.x = -Math.PI / 2;
        coastRoad.position.set(0, 0.03, 16);
        this.environmentGroup.add(coastRoad);

        // Ring Road (Central East-West)
        const ringRoad = new THREE.Mesh(new THREE.PlaneGeometry(90, 6), this.materials.roadAsphalt);
        ringRoad.rotation.x = -Math.PI / 2;
        ringRoad.position.set(0, 0.03, -10);
        this.environmentGroup.add(ringRoad);

        // North Expressway (Liberation Road / Airport)
        const northRoad = new THREE.Mesh(new THREE.PlaneGeometry(90, 6), this.materials.roadAsphalt);
        northRoad.rotation.x = -Math.PI / 2;
        northRoad.position.set(0, 0.03, -32);
        this.environmentGroup.add(northRoad);

        // Vertical Avenues (Oxford St, High St, Independence Ave)
        const avenueXCoords = [-26, -6, 14, 32];
        for (const x of avenueXCoords) {
            const ave = new THREE.Mesh(new THREE.PlaneGeometry(5, 54), this.materials.roadAsphalt);
            ave.rotation.x = -Math.PI / 2;
            ave.position.set(x, 0.035, -8);
            this.environmentGroup.add(ave);
        }

        // Yellow Road Center Dashes
        for (let x = -40; x <= 40; x += 6) {
            const dash1 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.3), this.materials.roadStripe);
            dash1.rotation.x = -Math.PI / 2;
            dash1.position.set(x, 0.05, 16);
            this.environmentGroup.add(dash1);

            const dash2 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.3), this.materials.roadStripe);
            dash2.rotation.x = -Math.PI / 2;
            dash2.position.set(x, 0.05, -10);
            this.environmentGroup.add(dash2);
        }
    }

    buildLandmarks() {
        // 1. Auntie Muni Waakye (Oxford St, Osu)
        this.createBuilding('auntie_muni', 'Auntie Muni', '🍛', -16, 0, -2, {
            w: 4, h: 2.2, d: 3,
            colorMat: this.materials.buildingKenteYellow,
            roofColor: 0xef4444,
            badgeLabel: 'Auntie Muni Waakye'
        });

        // 2. Bloom Bar (Osu Nightlife)
        this.createBuilding('bloom_bar', 'Bloom Bar', '🪩', -20, 0, 7, {
            w: 6, h: 3.5, d: 6,
            colorMat: this.materials.buildingModern,
            neonMat: this.materials.neonPink,
            badgeLabel: 'Bloom Bar'
        });

        // 3. Bukom Boxing Arena (Jamestown)
        this.createBuilding('bukom_boxing', 'Bukom Boxing', '🥊', -35, 0, 6, {
            w: 7, h: 4, d: 7,
            colorMat: this.materials.buildingBrick,
            badgeLabel: 'Bukom Arena'
        });

        // 4. MEST Tech Hub (East Legon Silicon Accra)
        this.createBuilding('mest_tech', 'MEST Tech', '💡', 22, 0, -22, {
            w: 6, h: 9, d: 6,
            colorMat: this.materials.glassBlue,
            badgeLabel: 'MEST Tech Hub'
        });

        // 5. Circle Neoplan Station (Trotro HQ)
        this.createBuilding('circle_trotro', 'Circle Trotro', '🚌', -6, 0, -22, {
            w: 8, h: 2.8, d: 7,
            colorMat: this.materials.buildingKenteYellow,
            badgeLabel: 'Trotro Terminal'
        });

        // 6. Accra City Hall (AMA / Mayor of Accra)
        this.createBuilding('city_hall', 'City Hall', '🏛️', 4, 0, -2, {
            w: 7, h: 5.5, d: 6,
            colorMat: this.materials.buildingWhite,
            pillared: true,
            badgeLabel: 'Accra City Hall'
        });

        // 7. Labadi Beach & Tawala (Beach Raves)
        this.createBuilding('labadi_beach', 'Labadi Beach', '🏖️', 20, 0, 18, {
            w: 6, h: 2, d: 5,
            colorMat: this.materials.terrainSand,
            badgeLabel: 'Labadi Beach'
        });

        // 8. Makola Market (Commercial Bazaar)
        this.createBuilding('makola_market', 'Makola Market', '🛒', -35, 0, -10, {
            w: 7, h: 3, d: 8,
            colorMat: this.materials.buildingKenteYellow,
            badgeLabel: 'Makola Market'
        });

        // 9. Accra Sports Stadium
        this.createBuilding('stadium', 'Sports Stadium', '⚽', -6, 0, 7, {
            w: 9, h: 3.8, d: 7,
            colorMat: this.materials.buildingWhite,
            badgeLabel: 'Accra Stadium'
        });

        // 10. Kempinski Hotel Gold Coast City
        this.createBuilding('kempinski', 'Kempinski Hotel', '🏨', 8, 0, 6, {
            w: 8, h: 7, d: 7,
            colorMat: this.materials.buildingWhite,
            badgeLabel: 'Kempinski Hotel'
        });

        // 11. High Court of Ghana
        this.createBuilding('high_court', 'High Court', '⚖️', 14, 0, -2, {
            w: 6, h: 4.8, d: 5,
            colorMat: this.materials.buildingWhite,
            pillared: true,
            badgeLabel: 'High Court'
        });

        // 12. Sister Akua's Salon
        this.createBuilding('salon', "Akua's Salon", '💇🏾‍♀️', -10, 0, -2, {
            w: 3.5, h: 2.4, d: 3,
            colorMat: this.materials.buildingWhite,
            badgeLabel: "Akua's Salon"
        });

        // 13. Papaye Fast Food
        this.createBuilding('papaye', 'Papaye', '🍕', 2, 0, -18, {
            w: 4.5, h: 2.8, d: 4,
            colorMat: this.materials.buildingBrick,
            badgeLabel: 'Papaye Fast Food'
        });

        // 14. Sea Plots Billboard (Floating on Gulf of Guinea)
        this.createSeaPlotsBillboard();
    }

    createBuilding(id, name, emoji, x, y, z, config) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Building Body
        const geo = new THREE.BoxGeometry(config.w, config.h, config.d);
        const mesh = new THREE.Mesh(geo, config.colorMat);
        mesh.position.y = config.h / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        // Pillared front if Civic
        if (config.pillared) {
            const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, config.h, 8);
            for (let px = -config.w / 2 + 0.4; px <= config.w / 2 - 0.4; px += 1.2) {
                const pillar = new THREE.Mesh(pillarGeo, this.materials.buildingWhite);
                pillar.position.set(px, config.h / 2, config.d / 2 + 0.3);
                group.add(pillar);
            }
        }

        // Roof Accent / Pergola
        if (config.neonMat) {
            const roof = new THREE.Mesh(new THREE.BoxGeometry(config.w + 0.4, 0.3, config.d + 0.4), config.neonMat);
            roof.position.y = config.h + 0.15;
            group.add(roof);
        }

        this.environmentGroup.add(group);

        // Floating 3D Circular Pin Bubble (Lagos Life Style)
        const pinSprite = this.createFloatingPinSprite(emoji, config.badgeLabel || name, config.h + 2.0);
        group.add(pinSprite);
        this.pinSprites.push({ sprite: pinSprite, baseY: config.h + 2.0, timeOffset: Math.random() * Math.PI * 2 });

        // Click Hitbox for venue interaction
        const hitbox = new THREE.Mesh(
            new THREE.BoxGeometry(config.w + 1, config.h + 3.5, config.d + 1),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitbox.position.y = (config.h + 3.5) / 2;
        hitbox.userData = { type: 'venue', venueId: id, name, emoji };
        group.add(hitbox);
        this.interactables.push(hitbox);
    }

    createFloatingPinSprite(emoji, label, yPos) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        // Draw Circular Bubble
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(128, 56, 44, 0, Math.PI * 2);
        ctx.fill();

        // Shadow & Border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Emoji
        ctx.font = '40px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 128, 56);

        // Label Pill underneath
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(14, 110, 228, 42, 21);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText(label, 128, 132);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set(0, yPos, 0);
        sprite.scale.set(4.0, 2.5, 1);
        return sprite;
    }

    createSeaPlotsBillboard() {
        const group = new THREE.Group();
        group.position.set(2, 0, 36);

        // Floating wooden barge
        const barge = new THREE.Mesh(new THREE.BoxGeometry(10, 0.6, 6), this.materials.palmBark);
        barge.position.y = 0.3;
        group.add(barge);

        // Billboard Board
        const board = new THREE.Mesh(new THREE.BoxGeometry(8, 3.5, 0.3), this.materials.buildingModern);
        board.position.set(0, 3.0, 0);
        group.add(board);

        // Billboard Canvas Texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 512, 256);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, 504, 248);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌊 SEA & BEACH PLOTS', 256, 70);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.fillText('Advertise on Accra Water!', 256, 120);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.fillText('Tap to Lease Plot or Post Ad ⛵', 256, 175);

        const tex = new THREE.CanvasTexture(canvas);
        const screenMat = new THREE.MeshBasicMaterial({ map: tex });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 3.2), screenMat);
        screen.position.set(0, 3.0, 0.17);
        group.add(screen);

        this.environmentGroup.add(group);

        const hitbox = new THREE.Mesh(
            new THREE.BoxGeometry(10, 6, 6),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitbox.position.y = 3;
        hitbox.userData = { type: 'venue', venueId: 'sea_plots', name: 'Sea Plots', emoji: '🌊' };
        group.add(hitbox);
        this.interactables.push(hitbox);
    }

    spawnMiniTrotros() {
        // Create 4 miniature Trotros cruising along the avenues
        const trotroConfigs = [
            { x: -38, z: 16, dx: 0.12, dz: 0, minX: -42, maxX: 42, color: 0xf59e0b },
            { x: 38, z: -10, dx: -0.15, dz: 0, minX: -42, maxX: 42, color: 0xffffff },
            { x: -6, z: -30, dx: 0, dz: 0.14, minZ: -32, maxZ: 14, color: 0xf59e0b },
            { x: 14, z: 12, dx: 0, dz: -0.16, minZ: -32, maxZ: 14, color: 0xffffff }
        ];

        for (const cfg of trotroConfigs) {
            const bus = new THREE.Group();
            bus.position.set(cfg.x, 0.35, cfg.z);

            // Bus Body
            const bodyMat = new THREE.MeshLambertMaterial({ color: cfg.color });
            const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.2), bodyMat);
            bus.add(body);

            // Roof
            const roof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.2), this.materials.buildingWhite);
            roof.position.y = 0.65;
            bus.add(roof);

            // Wheels
            const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 8);
            wheelGeo.rotateZ(Math.PI / 2);
            const wheelMat = this.materials.roadAsphalt;
            const w1 = new THREE.Mesh(wheelGeo, wheelMat);
            w1.position.set(-0.7, -0.3, 0.6);
            const w2 = new THREE.Mesh(wheelGeo, wheelMat);
            w2.position.set(0.7, -0.3, 0.6);
            const w3 = new THREE.Mesh(wheelGeo, wheelMat);
            w3.position.set(-0.7, -0.3, -0.6);
            const w4 = new THREE.Mesh(wheelGeo, wheelMat);
            w4.position.set(0.7, -0.3, -0.6);
            bus.add(w1, w2, w3, w4);

            this.environmentGroup.add(bus);
            this.miniTrotros.push({ group: bus, config: cfg });
        }
    }

    scatterPalmTrees() {
        const treeLocs = [
            [-32, 20], [-10, 20], [8, 20], [28, 20], [38, 20],
            [-22, 1], [-2, 1], [18, 1],
            [-28, -25], [10, -25], [28, -15]
        ];

        for (const [x, z] of treeLocs) {
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 3.2, 6), this.materials.palmBark);
            trunk.position.set(x, 1.6, z);
            this.environmentGroup.add(trunk);

            const crown = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 6), this.materials.palmLeaves);
            crown.position.set(x, 3.8, z);
            this.environmentGroup.add(crown);
        }
    }

    update(delta) {
        const time = Date.now() * 0.002;

        // 1. Gently animate floating pin bubbles (hovering effect)
        for (const pin of this.pinSprites) {
            pin.sprite.position.y = pin.baseY + Math.sin(time + pin.timeOffset) * 0.25;
        }

        // 2. Animate mini Trotros driving along Accra streets
        for (const trotro of this.miniTrotros) {
            const { group, config } = trotro;
            group.position.x += config.dx;
            group.position.z += config.dz;

            if (config.dx > 0 && group.position.x > config.maxX) group.position.x = config.minX;
            if (config.dx < 0 && group.position.x < config.minX) group.position.x = config.maxX;
            if (config.dz > 0 && group.position.z > config.maxZ) group.position.z = config.minZ;
            if (config.dz < 0 && group.position.z < config.minZ) group.position.z = config.maxZ;
        }

        // 3. Gentle ocean wave animation
        if (this.oceanMesh) {
            this.oceanMesh.position.y = 0.04 + Math.sin(time * 0.8) * 0.04;
        }
    }
}
