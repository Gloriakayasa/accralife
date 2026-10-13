// Accra Life 3D - Accra World & Districts Engine (Three.js)
// Procedurally modeled stylized environments: Osu Oxford St, East Legon, Labadi Beach, Jamestown, Penthouse

import * as THREE from '../../libjs/three.module.js';

export class WorldManager {
    constructor(scene) {
        this.scene = scene;
        this.currentDistrict = "osu"; // osu, east_legon, labadi, jamestown, penthouse
        this.environmentGroup = new THREE.Group();
        this.interactables = []; // Objects with click/interaction callbacks
        this.colliders = [];     // Collision bounding volumes for obstacles
        this.scene.add(this.environmentGroup);

        this.initMaterials();
        this.loadDistrict("osu");
    }

    addBoxCollider(minX, maxX, minZ, maxZ) {
        this.colliders.push({ type: 'box', minX, maxX, minZ, maxZ });
    }

    addCircleCollider(x, z, radius) {
        this.colliders.push({ type: 'circle', x, z, radius });
    }

    initMaterials() {
        this.materials = {
            road: new THREE.MeshLambertMaterial({ color: 0x27272a }),
            sidewalk: new THREE.MeshLambertMaterial({ color: 0xa1a1aa }),
            curb: new THREE.MeshLambertMaterial({ color: 0xeab308 }), // Yellow curb
            grass: new THREE.MeshLambertMaterial({ color: 0x15803d }),
            sand: new THREE.MeshLambertMaterial({ color: 0xfde047 }),
            ocean: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.1 }),
            wood: new THREE.MeshLambertMaterial({ color: 0x78350f }),
            palmLeaf: new THREE.MeshLambertMaterial({ color: 0x166534 }),
            brick: new THREE.MeshLambertMaterial({ color: 0xb91c1c }),
            whiteWall: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
            glass: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.7 }),
            neonPink: new THREE.MeshBasicMaterial({ color: 0xf43f5e }),
            neonGold: new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
            poolWater: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.2 }),
            floorParquet: new THREE.MeshLambertMaterial({ color: 0x92400e }),
            sofaVelvet: new THREE.MeshLambertMaterial({ color: 0x4f46e5 })
        };
    }

    clearWorld() {
        while (this.environmentGroup.children.length > 0) {
            this.environmentGroup.remove(this.environmentGroup.children[0]);
        }
        this.interactables = [];
        this.colliders = [];
    }

    loadDistrict(districtId) {
        this.clearWorld();
        this.currentDistrict = districtId;

        if (districtId === 'osu') {
            this.buildOsuOxfordStreet();
        } else if (districtId === 'east_legon') {
            this.buildEastLegon();
        } else if (districtId === 'labadi') {
            this.buildLabadiBeach();
        } else if (districtId === 'jamestown') {
            this.buildJamestown();
        } else if (districtId === 'penthouse') {
            this.buildPenthouse();
        }
    }

    // --- DISTRICT 1: OSU OXFORD STREET & BLOOM BAR ---
    buildOsuOxfordStreet() {
        // Ground Pavement & Street
        const groundGeo = new THREE.PlaneGeometry(60, 60);
        const ground = new THREE.Mesh(groundGeo, this.materials.sidewalk);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.environmentGroup.add(ground);

        // Asphalt Main Street
        const roadGeo = new THREE.PlaneGeometry(12, 60);
        const road = new THREE.Mesh(roadGeo, this.materials.road);
        road.rotation.x = -Math.PI / 2;
        road.position.set(-8, 0.02, 0);
        road.receiveShadow = true;
        this.environmentGroup.add(road);

        // Road yellow center dashes
        for (let z = -26; z <= 26; z += 6) {
            const stripeGeo = new THREE.PlaneGeometry(0.3, 3);
            const stripe = new THREE.Mesh(stripeGeo, this.materials.curb);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(-8, 0.04, z);
            this.environmentGroup.add(stripe);
        }

        // Bloom Bar Complex
        const bloomBase = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 20), this.materials.whiteWall);
        bloomBase.position.set(12, 2.5, -2);
        bloomBase.castShadow = true;
        this.environmentGroup.add(bloomBase);

        // Rooftop Pergola & DJ Lounge
        const roofFloor = new THREE.Mesh(new THREE.BoxGeometry(15, 0.3, 19), this.materials.wood);
        roofFloor.position.set(12, 5.15, -2);
        this.environmentGroup.add(roofFloor);

        // Neon Sign: "BLOOM BAR OSU"
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 0.2), this.materials.neonPink);
        signBoard.position.set(12, 5.8, 7.8);
        this.environmentGroup.add(signBoard);

        // DJ Stage & Turntables (Interactable Gig)
        const djBooth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.2), this.materials.neonGold);
        djBooth.position.set(12, 5.7, 0);
        this.environmentGroup.add(djBooth);

        this.addInteractable(djBooth, {
            type: "gig",
            title: "🎧 Bloom Bar DJ Gig",
            desc: "Perform an Afrobeats live DJ set for the crowd!",
            reward: 250,
            energyCost: 20
        });

        // Street Food Stall: "Kelewele & Waakye Spot"
        const stall = new THREE.Mesh(new THREE.BoxGeometry(3, 2.4, 2.4), this.materials.wood);
        stall.position.set(1, 1.2, -8);
        this.environmentGroup.add(stall);

        const stallRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), this.materials.brick);
        stallRoof.position.set(1, 3.0, -8);
        stallRoof.rotation.y = Math.PI / 4;
        this.environmentGroup.add(stallRoof);

        this.addInteractable(stall, {
            type: "food",
            title: "🍛 Auntie Muni Waakye & Kelewele",
            desc: "Replenish hunger and boost energy with hot fried plantain & Waakye!",
            cost: 25,
            energyGain: 40,
            hungerGain: 60
        });

        // Palm Trees
        this.createPalmTree(2, 0, 8);
        this.createPalmTree(2, 0, -16);
        this.createPalmTree(18, 0, 10);

        // Osu Colliders
        this.addBoxCollider(3.5, 20.5, -12.5, 8.5); // Bloom Bar building
        this.addBoxCollider(-0.8, 2.8, -9.5, -6.5);  // Food stall
    }

    // --- DISTRICT 2: EAST LEGON LUXURY MANSIONS ---
    buildEastLegon() {
        const groundGeo = new THREE.PlaneGeometry(60, 60);
        const ground = new THREE.Mesh(groundGeo, this.materials.grass);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.environmentGroup.add(ground);

        // Paved luxury driveway
        const driveway = new THREE.Mesh(new THREE.PlaneGeometry(16, 40), this.materials.sidewalk);
        driveway.rotation.x = -Math.PI / 2;
        driveway.position.set(-12, 0.02, 0);
        this.environmentGroup.add(driveway);

        // Glass Tech Hub & Villa
        const mansion = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 16), this.materials.whiteWall);
        mansion.position.set(8, 3.5, -6);
        mansion.castShadow = true;
        this.environmentGroup.add(mansion);

        // Glass facade
        const glassWall = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 0.2), this.materials.glass);
        glassWall.position.set(8, 3.5, 2.1);
        this.environmentGroup.add(glassWall);

        // Luxury Swimming Pool
        const poolBorder = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 12), this.materials.sidewalk);
        poolBorder.position.set(8, 0.2, 10);
        this.environmentGroup.add(poolBorder);

        const poolWater = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 11), this.materials.poolWater);
        poolWater.position.set(8, 0.3, 10);
        this.environmentGroup.add(poolWater);

        // Tech Startup Desk / Work Station (Interactable Gig)
        const techDesk = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 1.5), this.materials.whiteWall);
        techDesk.position.set(-6, 0.6, 2);
        this.environmentGroup.add(techDesk);

        this.addInteractable(techDesk, {
            type: "gig",
            title: "💻 East Legon Tech Hub",
            desc: "Code high-yield FinTech apps for mobile payments!",
            reward: 500,
            energyCost: 35
        });

        // Palm trees lining driveway
        this.createPalmTree(-3, 0, -10);
        this.createPalmTree(-3, 0, 4);
        this.createPalmTree(-3, 0, 16);

        // East Legon Colliders
        this.addBoxCollider(-1.5, 17.5, -14.5, 2.5); // Luxury Villa / Tech Hub
        this.addBoxCollider(-7.5, -4.5, 1.0, 3.0);   // Workstation Desk
    }

    // --- DISTRICT 3: LABADI BEACH ---
    buildLabadiBeach() {
        // Golden Sandy Beach
        const beach = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), this.materials.sand);
        beach.rotation.x = -Math.PI / 2;
        beach.position.z = 8;
        beach.receiveShadow = true;
        this.environmentGroup.add(beach);

        // Ocean Waves
        const ocean = new THREE.Mesh(new THREE.PlaneGeometry(60, 24), this.materials.ocean);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.set(0, 0.05, -20);
        this.environmentGroup.add(ocean);

        // Boardwalk
        const boardwalk = new THREE.Mesh(new THREE.BoxGeometry(50, 0.3, 4), this.materials.wood);
        boardwalk.position.set(0, 0.15, 16);
        this.environmentGroup.add(boardwalk);

        // Beach Bar
        const bar = new THREE.Mesh(new THREE.BoxGeometry(6, 2.8, 3.5), this.materials.wood);
        bar.position.set(0, 1.4, 4);
        this.environmentGroup.add(bar);

        this.addInteractable(bar, {
            type: "chill",
            title: "🍹 Labadi Coconut & Cocktail Bar",
            desc: "Chill by the ocean breeze, recharge energy and relax!",
            cost: 15,
            energyGain: 50,
            hungerGain: 30
        });

        // Coconut Palms on sand
        this.createPalmTree(-14, 0, 8);
        this.createPalmTree(14, 0, 6);
        this.createPalmTree(-22, 0, 2);
        this.createPalmTree(22, 0, 10);

        // Labadi Beach Colliders
        this.addBoxCollider(-3.3, 3.3, 2.0, 6.0); // Beach Bar
    }

    // --- DISTRICT 4: JAMESTOWN & LIGHTHOUSE ---
    buildJamestown() {
        // Cobblestone / Sandy ground
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), this.materials.sidewalk);
        ground.rotation.x = -Math.PI / 2;
        this.environmentGroup.add(ground);

        // Iconic Red & White Striped Jamestown Lighthouse
        const towerGroup = new THREE.Group();
        towerGroup.position.set(12, 0, -8);
        this.environmentGroup.add(towerGroup);

        const stripeHeight = 2.5;
        for (let i = 0; i < 6; i++) {
            const seg = new THREE.Mesh(
                new THREE.CylinderGeometry(2.0 - i * 0.15, 2.2 - i * 0.15, stripeHeight, 16),
                i % 2 === 0 ? this.materials.brick : this.materials.whiteWall
            );
            seg.position.y = i * stripeHeight + stripeHeight / 2;
            towerGroup.add(seg);
        }

        // Lantern room
        const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2, 16), this.materials.neonGold);
        lantern.position.y = 6 * stripeHeight + 1;
        towerGroup.add(lantern);

        // Bukom Boxing Gym Ring
        const ringBase = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 7), this.materials.wood);
        ringBase.position.set(-8, 0.3, 0);
        this.environmentGroup.add(ringBase);

        // 4 Corner Posts
        const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
        const corners = [[-11, -3], [-5, -3], [-11, 3], [-5, 3]];
        corners.forEach(([x, z]) => {
            const post = new THREE.Mesh(postGeo, this.materials.brick);
            post.position.set(x, 1.4, z);
            this.environmentGroup.add(post);
        });

        this.addInteractable(ringBase, {
            type: "gig",
            title: "🥊 Bukom Boxing Champion Spar",
            desc: "Train in the famous Jamestown boxing ring to earn big Cedis and respect!",
            reward: 350,
            energyCost: 25
        });

        // Jamestown Colliders
        this.addCircleCollider(12, -8, 2.5);          // Red & White Lighthouse
        this.addBoxCollider(-11.5, -4.5, -3.5, 3.5);  // Boxing Gym Ring
    }

    // --- DISTRICT 5: MY PENTHOUSE APARTMENT ---
    buildPenthouse() {
        // Parquet Luxury Floor
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), this.materials.floorParquet);
        floor.rotation.x = -Math.PI / 2;
        this.environmentGroup.add(floor);

        // Walls
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 6, 0.4), this.materials.whiteWall);
        backWall.position.set(0, 3, -12);
        this.environmentGroup.add(backWall);

        // Floor-to-ceiling panoramic glass balcony overlooking Accra
        const glassWindow = new THREE.Mesh(new THREE.BoxGeometry(24, 6, 0.2), this.materials.glass);
        glassWindow.position.set(0, 3, 12);
        this.environmentGroup.add(glassWindow);

        // Luxury Velvet L-Shape Sofa
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.9, 2), this.materials.sofaVelvet);
        sofa.position.set(0, 0.45, -6);
        this.environmentGroup.add(sofa);

        // Wardrobe Dressing Closet (Interactable Drip Customization)
        const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.2, 1.2), this.materials.wood);
        wardrobe.position.set(-9, 2.1, -11);
        this.environmentGroup.add(wardrobe);

        this.addInteractable(wardrobe, {
            type: "wardrobe",
            title: "👗 VIP Wardrobe Closet",
            desc: "Customize your Kente drip, hairstyles, and luxury accessories!"
        });

        // King Size Bed (Instant Energy Sleep)
        const bed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 4.5), this.materials.whiteWall);
        bed.position.set(8, 0.4, -8);
        this.environmentGroup.add(bed);

        this.addInteractable(bed, {
            type: "sleep",
            title: "🛏️ Master Bed Rest",
            desc: "Sleep in your penthouse to fully restore 100% Energy!"
        });

        // Penthouse Colliders
        this.addBoxCollider(-12, 12, -12.5, -11.5);    // Back wall
        this.addBoxCollider(-12, 12, 11.5, 12.5);      // Balcony glass
        this.addBoxCollider(-2.4, 2.4, -7.2, -4.8);    // Velvet sofa
        this.addBoxCollider(6.0, 10.0, -10.5, -5.5);   // King bed
        this.addBoxCollider(-10.4, -7.6, -11.8, -10.2);// Wardrobe
    }

    createPalmTree(x, y, z) {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(x, y, z);

        // Curved Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.32, 5, 8);
        const trunk = new THREE.Mesh(trunkGeo, this.materials.wood);
        trunk.position.y = 2.5;
        trunk.rotation.z = (Math.random() - 0.5) * 0.2;
        treeGroup.add(trunk);

        // Palm Fronds
        for (let i = 0; i < 7; i++) {
            const angle = (i / 7) * Math.PI * 2;
            const frondGeo = new THREE.ConeGeometry(0.8, 3.2, 4);
            const frond = new THREE.Mesh(frondGeo, this.materials.palmLeaf);
            frond.position.set(Math.cos(angle) * 1.2, 4.8, Math.sin(angle) * 1.2);
            frond.rotation.set(Math.sin(angle) * 1.1, angle, Math.cos(angle) * 1.1);
            treeGroup.add(frond);
        }

        this.environmentGroup.add(treeGroup);
    }

    addInteractable(mesh, data) {
        mesh.userData = data;
        this.interactables.push(mesh);
    }
}
