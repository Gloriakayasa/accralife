// Accra Life 3D - Modular 3D Character Avatar System (Avakin Life / The Sims style)
// Powered by Three.js with Ghanaian Fashion (Kente, Batakari, Streetwear, Braids, Fades)

import * as THREE from '../../libjs/three.module.js';

// Generate authentic Ghanaian Kente texture procedurally via 2D Canvas
export function createKenteTexture(primaryColor = '#f59e0b', secondaryColor = '#10b981', accentColor = '#ef4444') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base background
    ctx.fillStyle = primaryColor; // Gold/Yellow
    ctx.fillRect(0, 0, 256, 256);

    // Kente striping & geometric diamond/chevron weaves
    const stripH = 32;
    for (let y = 0; y < 256; y += stripH) {
        ctx.fillStyle = (y / stripH) % 2 === 0 ? secondaryColor : accentColor;
        ctx.fillRect(0, y, 256, stripH / 2);

        // Intricate geometric weaves
        ctx.fillStyle = '#000000';
        for (let x = 0; x < 256; x += 32) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 16, y + stripH / 2);
            ctx.lineTo(x + 32, y);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = primaryColor;
            ctx.fillRect(x + 12, y + 6, 8, 8);
            ctx.fillStyle = '#000000';
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
}

// Generate Batakari / Northern Smock texture
export function createBatakariTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e3a8a'; // Deep indigo / royal blue
    ctx.fillRect(0, 0, 256, 256);

    // Vertical striped weaves
    for (let x = 0; x < 256; x += 16) {
        ctx.fillStyle = (x / 16) % 2 === 0 ? '#ffffff' : '#0284c7';
        ctx.fillRect(x, 0, 4, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
}

export class Avatar3D {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = Object.assign({
            name: "Kwame",
            gender: "male",
            skinTone: 0x3d2314, // Rich warm Ghanaian skin tone
            hairStyle: "braids", // braids, fade, afro, dreads
            hairColor: 0x111111,
            outfit: "kente", // kente, streetwear, suit, batakari
            topColor: 0xf59e0b,
            pantsColor: 0x1e293b,
            shoesColor: 0xffffff,
            accessories: ["sunglasses", "gold_chain"]
        }, config);

        this.bones = {};
        this.animTime = 0;
        this.currentAnim = "idle"; // idle, walk, dance_azonto, dance_kupe, wave, sit
        this.walkSpeed = 0;

        this.buildCharacter();
    }

    buildCharacter() {
        // Clear previous meshes
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        const skinMat = new THREE.MeshStandardMaterial({ color: this.config.skinTone, roughness: 0.8 });
        const hairMat = new THREE.MeshStandardMaterial({ color: this.config.hairColor, roughness: 0.9 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: this.config.pantsColor, roughness: 0.7 });
        const shoesMat = new THREE.MeshStandardMaterial({ color: this.config.shoesColor, roughness: 0.5 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
        const shadesMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

        // Outfit Top Material
        let topMat;
        if (this.config.outfit === 'kente') {
            topMat = new THREE.MeshLambertMaterial({ map: createKenteTexture() });
        } else if (this.config.outfit === 'batakari') {
            topMat = new THREE.MeshLambertMaterial({ map: createBatakariTexture() });
        } else if (this.config.outfit === 'suit') {
            topMat = new THREE.MeshLambertMaterial({ color: 0x0f172a }); // Luxury black blazer
        } else {
            topMat = new THREE.MeshLambertMaterial({ color: this.config.topColor }); // Osu graphic tee
        }

        // --- ROOT HIPS ---
        const hips = new THREE.Group();
        hips.position.y = 1.05;
        this.group.add(hips);
        this.bones.hips = hips;

        // Pelvis mesh
        const pelvisGeo = new THREE.BoxGeometry(0.38, 0.2, 0.26);
        const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMat);
        pelvisMesh.castShadow = true;
        hips.add(pelvisMesh);

        // --- TORSO ---
        const torso = new THREE.Group();
        torso.position.y = 0.15;
        hips.add(torso);
        this.bones.torso = torso;

        const torsoGeo = new THREE.BoxGeometry(0.44, 0.55, 0.28);
        const torsoMesh = new THREE.Mesh(torsoGeo, topMat);
        torsoMesh.position.y = 0.28;
        torsoMesh.castShadow = true;
        torso.add(torsoMesh);

        // Gold chain accessory
        if (this.config.accessories.includes("gold_chain")) {
            const chainGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
            const chainMesh = new THREE.Mesh(chainGeo, goldMat);
            chainMesh.position.set(0, 0.44, 0.12);
            chainMesh.rotation.x = Math.PI / 3;
            torso.add(chainMesh);
        }

        // --- HEAD & NECK ---
        const headGroup = new THREE.Group();
        headGroup.position.y = 0.6;
        torso.add(headGroup);
        this.bones.head = headGroup;

        // Head mesh
        const headGeo = new THREE.BoxGeometry(0.3, 0.32, 0.3);
        const headMesh = new THREE.Mesh(headGeo, skinMat);
        headMesh.position.y = 0.2;
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // Sunglasses accessory
        if (this.config.accessories.includes("sunglasses")) {
            const shadeGeo = new THREE.BoxGeometry(0.32, 0.08, 0.06);
            const shadeMesh = new THREE.Mesh(shadeGeo, shadesMat);
            shadeMesh.position.set(0, 0.22, 0.16);
            headGroup.add(shadeMesh);
        }

        // Hair Styles (Afro, Braids, Fade, Dreads)
        this.buildHair(headGroup, hairMat);

        // --- ARMS (Left & Right) ---
        // Left Arm
        const leftShoulder = new THREE.Group();
        leftShoulder.position.set(-0.28, 0.5, 0);
        torso.add(leftShoulder);
        this.bones.leftArm = leftShoulder;

        const armGeo = new THREE.BoxGeometry(0.12, 0.32, 0.12);
        const leftArmMesh = new THREE.Mesh(armGeo, topMat);
        leftArmMesh.position.y = -0.16;
        leftArmMesh.castShadow = true;
        leftShoulder.add(leftArmMesh);

        const leftForearm = new THREE.Group();
        leftForearm.position.y = -0.32;
        leftShoulder.add(leftForearm);
        this.bones.leftForearm = leftForearm;

        const forearmGeo = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        const leftForearmMesh = new THREE.Mesh(forearmGeo, skinMat);
        leftForearmMesh.position.y = -0.15;
        leftForearmMesh.castShadow = true;
        leftForearm.add(leftForearmMesh);

        // Right Arm
        const rightShoulder = new THREE.Group();
        rightShoulder.position.set(0.28, 0.5, 0);
        torso.add(rightShoulder);
        this.bones.rightArm = rightShoulder;

        const rightArmMesh = new THREE.Mesh(armGeo, topMat);
        rightArmMesh.position.y = -0.16;
        rightArmMesh.castShadow = true;
        rightShoulder.add(rightArmMesh);

        const rightForearm = new THREE.Group();
        rightForearm.position.y = -0.32;
        rightShoulder.add(rightForearm);
        this.bones.rightForearm = rightForearm;

        const rightForearmMesh = new THREE.Mesh(forearmGeo, skinMat);
        rightForearmMesh.position.y = -0.15;
        rightForearmMesh.castShadow = true;
        rightForearm.add(rightForearmMesh);

        // --- LEGS (Left & Right) ---
        // Left Leg
        const leftHip = new THREE.Group();
        leftHip.position.set(-0.13, -0.1, 0);
        hips.add(leftHip);
        this.bones.leftLeg = leftHip;

        const thighGeo = new THREE.BoxGeometry(0.16, 0.45, 0.18);
        const leftThighMesh = new THREE.Mesh(thighGeo, pantsMat);
        leftThighMesh.position.y = -0.22;
        leftThighMesh.castShadow = true;
        leftHip.add(leftThighMesh);

        const leftCalf = new THREE.Group();
        leftCalf.position.y = -0.45;
        leftHip.add(leftCalf);
        this.bones.leftCalf = leftCalf;

        const calfGeo = new THREE.BoxGeometry(0.14, 0.45, 0.16);
        const leftCalfMesh = new THREE.Mesh(calfGeo, pantsMat);
        leftCalfMesh.position.y = -0.22;
        leftCalfMesh.castShadow = true;
        leftCalf.add(leftCalfMesh);

        // Left Shoe
        const shoeGeo = new THREE.BoxGeometry(0.15, 0.12, 0.24);
        const leftShoeMesh = new THREE.Mesh(shoeGeo, shoesMat);
        leftShoeMesh.position.set(0, -0.48, 0.04);
        leftShoeMesh.castShadow = true;
        leftCalf.add(leftShoeMesh);

        // Right Leg
        const rightHip = new THREE.Group();
        rightHip.position.set(0.13, -0.1, 0);
        hips.add(rightHip);
        this.bones.rightLeg = rightHip;

        const rightThighMesh = new THREE.Mesh(thighGeo, pantsMat);
        rightThighMesh.position.y = -0.22;
        rightThighMesh.castShadow = true;
        rightHip.add(rightThighMesh);

        const rightCalf = new THREE.Group();
        rightCalf.position.y = -0.45;
        rightHip.add(rightCalf);
        this.bones.rightCalf = rightCalf;

        const rightCalfMesh = new THREE.Mesh(calfGeo, pantsMat);
        rightCalfMesh.position.y = -0.22;
        rightCalfMesh.castShadow = true;
        rightCalf.add(rightCalfMesh);

        // Right Shoe
        const rightShoeMesh = new THREE.Mesh(shoeGeo, shoesMat);
        rightShoeMesh.position.set(0, -0.48, 0.04);
        rightShoeMesh.castShadow = true;
        rightCalf.add(rightShoeMesh);

        // Build props and floating nametag
        this.buildProps();
        this.createNameTag();
    }

    buildProps() {
        // 1. Waakye Leaf Parcel Prop (for 'eat' anim)
        const waakyeGroup = new THREE.Group();
        const leafGeo = new THREE.BoxGeometry(0.24, 0.05, 0.22);
        const leafMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        waakyeGroup.add(leaf);
        const foodGeo = new THREE.BoxGeometry(0.18, 0.06, 0.16);
        const foodMat = new THREE.MeshLambertMaterial({ color: 0x451a03 }); // Dark waakye
        const food = new THREE.Mesh(foodGeo, foodMat);
        food.position.y = 0.05;
        waakyeGroup.add(food);
        waakyeGroup.position.set(0, -0.32, 0.14);
        waakyeGroup.visible = false;
        this.bones.leftForearm.add(waakyeGroup);
        this.waakyeProp = waakyeGroup;

        // 2. Boxing Gloves (for 'punch' anim)
        const gloveGeo = new THREE.BoxGeometry(0.18, 0.2, 0.18);
        const gloveMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
        const leftGlove = new THREE.Mesh(gloveGeo, gloveMat);
        leftGlove.position.set(0, -0.28, 0);
        leftGlove.visible = false;
        this.bones.leftForearm.add(leftGlove);

        const rightGlove = new THREE.Mesh(gloveGeo, gloveMat);
        rightGlove.position.set(0, -0.28, 0);
        rightGlove.visible = false;
        this.bones.rightForearm.add(rightGlove);
        this.boxingGloves = [leftGlove, rightGlove];

        // 3. Laptop Prop (for 'type' anim)
        const laptopGroup = new THREE.Group();
        const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.28), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
        laptopGroup.add(lapBase);
        const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.03), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        lapScreen.position.set(0, 0.14, -0.14);
        lapScreen.rotation.x = -0.2;
        laptopGroup.add(lapScreen);
        laptopGroup.position.set(0, 0.2, 0.38);
        laptopGroup.visible = false;
        this.bones.torso.add(laptopGroup);
        this.laptopProp = laptopGroup;

        // 4. Soccer Ball Prop (for 'kick' anim)
        const ballGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(0.1, -0.35, 0.35);
        ball.visible = false;
        this.group.add(ball);
        this.soccerBallProp = ball;

        // 5. Sleeping Zzz Sprite (for 'sleep' anim)
        const zCanvas = document.createElement('canvas');
        zCanvas.width = 128;
        zCanvas.height = 128;
        const zctx = zCanvas.getContext('2d');
        zctx.fillStyle = '#38bdf8';
        zctx.font = 'bold 54px sans-serif';
        zctx.textAlign = 'center';
        zctx.fillText('💤', 64, 70);
        const zTex = new THREE.CanvasTexture(zCanvas);
        const zSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: zTex, depthTest: false }));
        zSprite.position.set(0, 2.5, 0);
        zSprite.scale.set(0.9, 0.9, 1);
        zSprite.visible = false;
        this.group.add(zSprite);
        this.sleepingZzz = zSprite;
    }

    createNameTag() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Sleek badge background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(8, 8, 240, 48, 24);
        } else {
            ctx.rect(8, 8, 240, 48);
        }
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.config.name || 'Kwame'} 🇬🇭`, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(0, 2.35, 0);
        sprite.scale.set(1.6, 0.4, 1);
        this.group.add(sprite);
        this.nameTagSprite = sprite;
    }

    setName(name) {
        this.config.name = name;
        if (this.nameTagSprite) {
            this.group.remove(this.nameTagSprite);
        }
        this.createNameTag();
    }

    buildHair(headGroup, hairMat) {
        const style = this.config.hairStyle;

        if (style === 'afro') {
            // High volume round afro
            const afroGeo = new THREE.SphereGeometry(0.24, 8, 8);
            const afroMesh = new THREE.Mesh(afroGeo, hairMat);
            afroMesh.position.set(0, 0.32, -0.02);
            headGroup.add(afroMesh);
        } else if (style === 'braids') {
            // African box braids / cornrows falling backward & sideways
            const capGeo = new THREE.BoxGeometry(0.32, 0.12, 0.32);
            const capMesh = new THREE.Mesh(capGeo, hairMat);
            capMesh.position.y = 0.34;
            headGroup.add(capMesh);

            for (let i = -2; i <= 2; i++) {
                const braidGeo = new THREE.CylinderGeometry(0.025, 0.015, 0.38, 5);
                const braidMesh = new THREE.Mesh(braidGeo, hairMat);
                braidMesh.position.set(i * 0.06, 0.16, -0.15);
                braidMesh.rotation.x = -0.3;
                headGroup.add(braidMesh);
            }
        } else if (style === 'dreads') {
            // Textured locs
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                const locGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.3, 4);
                const locMesh = new THREE.Mesh(locGeo, hairMat);
                locMesh.position.set(Math.cos(angle) * 0.12, 0.28, Math.sin(angle) * 0.12);
                locMesh.rotation.z = Math.cos(angle) * 0.3;
                locMesh.rotation.x = Math.sin(angle) * 0.3;
                headGroup.add(locMesh);
            }
        } else {
            // Clean fade
            const fadeGeo = new THREE.BoxGeometry(0.32, 0.1, 0.32);
            const fadeMesh = new THREE.Mesh(fadeGeo, hairMat);
            fadeMesh.position.y = 0.34;
            headGroup.add(fadeMesh);
        }
    }

    update(delta) {
        this.animTime += delta;
        const t = this.animTime;

        if (this.currentAnim === 'walk') {
            // Natural walking stride
            const stride = Math.sin(t * 10);
            this.bones.leftLeg.rotation.set(stride * 0.65, 0, 0);
            this.bones.rightLeg.rotation.set(-stride * 0.65, 0, 0);
            this.bones.leftCalf.rotation.set(Math.max(0, -stride * 0.5), 0, 0);
            this.bones.rightCalf.rotation.set(Math.max(0, stride * 0.5), 0, 0);

            // Counter arm swing
            this.bones.leftArm.rotation.set(-stride * 0.5, 0, 0);
            this.bones.rightArm.rotation.set(stride * 0.5, 0, 0);
            this.bones.leftForearm.rotation.set(-0.2, 0, 0);
            this.bones.rightForearm.rotation.set(-0.2, 0, 0);

            // Hip bounce
            this.bones.hips.position.y = 1.05 + Math.abs(Math.sin(t * 10)) * 0.05;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0, Math.sin(t * 10) * 0.1, 0);
            this.bones.head.rotation.set(0, 0, 0);
        } else if (this.currentAnim === 'dance_azonto') {
            // Authentic Ghanaian Azonto Dance Move:
            // Elbow flicks, synchronized knee dip, side-to-side groove
            const bounce = Math.abs(Math.cos(t * 8));

            this.bones.hips.position.y = 0.95 + bounce * 0.08;
            this.bones.hips.rotation.set(0, 0, Math.sin(t * 4) * 0.15);
            this.bones.torso.position.y = 0.15;

            // Azonto Elbow Flick
            this.bones.leftArm.rotation.set(0.4, 0, Math.sin(t * 8) * 0.8 + 0.4);
            this.bones.rightArm.rotation.set(0.4, 0, -Math.sin(t * 8) * 0.8 - 0.4);
            this.bones.leftForearm.rotation.set(-1.2 + Math.cos(t * 8) * 0.3, 0, 0);
            this.bones.rightForearm.rotation.set(-1.2 + Math.cos(t * 8) * 0.3, 0, 0);

            // Knee step
            this.bones.leftLeg.rotation.set(Math.sin(t * 8) * 0.4, 0, 0);
            this.bones.rightLeg.rotation.set(-Math.sin(t * 8) * 0.4, 0, 0);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);
            this.bones.head.rotation.set(0, Math.sin(t * 4) * 0.25, 0);
        } else if (this.currentAnim === 'dance_kupe') {
            // Kupe / Afrobeats Slide Groove
            const groove = Math.sin(t * 6);
            this.bones.hips.position.y = 1.0 + Math.abs(groove) * 0.05;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0.15, 0, 0);
            this.bones.leftArm.rotation.set(-0.8, Math.sin(t * 6) * 0.5, 0.3);
            this.bones.rightArm.rotation.set(0.8, -Math.sin(t * 6) * 0.5, -0.3);
            this.bones.leftForearm.rotation.set(-0.9, 0, 0);
            this.bones.rightForearm.rotation.set(-0.9, 0, 0);
            this.bones.leftLeg.rotation.set(0, 0, groove * 0.2);
            this.bones.rightLeg.rotation.set(0, 0, -groove * 0.2);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);
        } else if (this.currentAnim === 'punch') {
            // Boxing Sparring Combos (Bukom Boxing Arena)
            const punchPhase = Math.sin(t * 12);
            this.bones.hips.position.y = 1.05 + Math.abs(Math.sin(t * 12)) * 0.04;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0.1, punchPhase * 0.35, 0);

            // Left arm jab
            this.bones.leftArm.rotation.set(-1.1 - Math.max(0, punchPhase) * 0.8, 0.3, 0.2);
            this.bones.leftForearm.rotation.set(-0.6 + Math.max(0, punchPhase) * 0.5, 0, 0);

            // Right arm cross
            this.bones.rightArm.rotation.set(-1.1 - Math.max(0, -punchPhase) * 0.8, -0.3, -0.2);
            this.bones.rightForearm.rotation.set(-0.6 + Math.max(0, -punchPhase) * 0.5, 0, 0);

            // Boxer shuffle footwork
            this.bones.leftLeg.rotation.set(Math.sin(t * 12) * 0.18, 0, 0);
            this.bones.rightLeg.rotation.set(-Math.sin(t * 12) * 0.18, 0, 0);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);
            this.bones.head.rotation.set(0.1, 0, 0);
        } else if (this.currentAnim === 'eat') {
            // Eating steaming Waakye (Auntie Muni)
            const chew = Math.sin(t * 7);
            this.bones.hips.position.y = 1.05;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0.12, 0, 0);
            this.bones.head.rotation.set(0.15 + chew * 0.08, 0, 0);

            // Right arm bringing spoonful to mouth
            this.bones.rightArm.rotation.set(-1.6 + chew * 0.22, 0.3, -0.25);
            this.bones.rightForearm.rotation.set(-1.4 + chew * 0.25, 0, 0);

            // Left arm holding parcel
            this.bones.leftArm.rotation.set(-1.1, -0.2, 0.35);
            this.bones.leftForearm.rotation.set(-1.2, 0, 0);

            this.bones.leftLeg.rotation.set(0, 0, 0);
            this.bones.rightLeg.rotation.set(0, 0, 0);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);
        } else if (this.currentAnim === 'sleep') {
            // Lying flat horizontally in bed (Kwame's Villa / Jamestown Compound)
            this.bones.hips.position.y = 0.42;
            this.bones.hips.rotation.set(-Math.PI / 2, 0, 0);
            const breathe = Math.sin(t * 2.2) * 0.03;
            this.bones.torso.position.y = 0.15 + breathe;
            this.bones.torso.rotation.set(0, 0, 0);
            this.bones.head.rotation.set(0.1, Math.sin(t * 0.6) * 0.1, 0);
            this.bones.leftArm.rotation.set(0, 0, 0.15);
            this.bones.rightArm.rotation.set(0, 0, -0.15);
            this.bones.leftForearm.rotation.set(0, 0, 0);
            this.bones.rightForearm.rotation.set(0, 0, 0);
            this.bones.leftLeg.rotation.set(0, 0, 0.04);
            this.bones.rightLeg.rotation.set(0, 0, -0.04);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);

            if (this.sleepingZzz) {
                this.sleepingZzz.position.set(0, 1.8 + Math.sin(t * 2) * 0.15, -0.4);
            }
        } else if (this.currentAnim === 'sit') {
            // Sitting on bench, sunbed, or chair
            this.bones.hips.position.y = 0.62;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0.08, 0, 0);
            this.bones.head.rotation.set(0, Math.sin(t * 0.8) * 0.1, 0);

            // 90-degree bent legs
            this.bones.leftLeg.rotation.set(-Math.PI / 2, 0, 0);
            this.bones.rightLeg.rotation.set(-Math.PI / 2, 0, 0);
            this.bones.leftCalf.rotation.set(Math.PI / 2, 0, 0);
            this.bones.rightCalf.rotation.set(Math.PI / 2, 0, 0);

            // Rest arms on thighs
            this.bones.leftArm.rotation.set(-0.6, 0, 0.2);
            this.bones.rightArm.rotation.set(-0.6, 0, -0.2);
            this.bones.leftForearm.rotation.set(-0.5, 0, 0);
            this.bones.rightForearm.rotation.set(-0.5, 0, 0);
        } else if (this.currentAnim === 'type') {
            // Typing on glowing laptop at MEST Silicon Accra
            const tap = Math.sin(t * 16);
            this.bones.hips.position.y = 0.62;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0.2, 0, 0);
            this.bones.head.rotation.set(0.3, 0, 0);

            this.bones.leftLeg.rotation.set(-Math.PI / 2, 0, 0);
            this.bones.rightLeg.rotation.set(-Math.PI / 2, 0, 0);
            this.bones.leftCalf.rotation.set(Math.PI / 2, 0, 0);
            this.bones.rightCalf.rotation.set(Math.PI / 2, 0, 0);

            this.bones.leftArm.rotation.set(-0.9, 0.3, 0.2);
            this.bones.rightArm.rotation.set(-0.9, -0.3, -0.2);
            this.bones.leftForearm.rotation.set(-1.0 + tap * 0.1, 0, 0);
            this.bones.rightForearm.rotation.set(-1.0 - tap * 0.1, 0, 0);
        } else if (this.currentAnim === 'kick') {
            // Kicking soccer ball at Accra Sports Stadium
            const cycle = (t * 5) % (Math.PI * 2);
            this.bones.hips.position.y = 1.05;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;

            if (cycle < Math.PI) {
                // Back swing
                this.bones.rightLeg.rotation.set(Math.sin(cycle) * 0.8, 0, 0);
                this.bones.rightCalf.rotation.set(Math.sin(cycle) * 0.6, 0, 0);
                this.bones.leftLeg.rotation.set(-0.2, 0, 0);
                this.bones.leftCalf.rotation.set(0, 0, 0);
                this.bones.torso.rotation.set(-0.1, 0, 0);
            } else {
                // Forward strike
                const strike = Math.sin(cycle - Math.PI);
                this.bones.rightLeg.rotation.set(-strike * 1.3, 0, 0);
                this.bones.rightCalf.rotation.set(-strike * 0.2, 0, 0);
                this.bones.leftLeg.rotation.set(0.1, 0, 0);
                this.bones.leftCalf.rotation.set(0, 0, 0);
                this.bones.torso.rotation.set(0.15, 0, 0);
            }

            this.bones.leftArm.rotation.set(0.6, 0, 0.5);
            this.bones.rightArm.rotation.set(-0.6, 0, -0.5);
            this.bones.leftForearm.rotation.set(-0.3, 0, 0);
            this.bones.rightForearm.rotation.set(-0.3, 0, 0);
            this.bones.head.rotation.set(0.1, 0, 0);
        } else if (this.currentAnim === 'wave') {
            // Friendly hand wave
            this.bones.rightArm.rotation.set(-1.8, 0, 0.4);
            this.bones.rightForearm.rotation.set(0, 0, Math.sin(t * 12) * 0.5 + 0.5);
            this.bones.leftArm.rotation.set(0, 0, 0.1);
            this.bones.leftForearm.rotation.set(0, 0, 0);
            this.bones.hips.position.y = 1.05;
            this.bones.hips.rotation.set(0, 0, 0);
            this.bones.torso.position.y = 0.15;
            this.bones.torso.rotation.set(0, 0, 0);
            this.bones.leftLeg.rotation.set(0, 0, 0);
            this.bones.rightLeg.rotation.set(0, 0, 0);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);
            this.bones.head.rotation.set(0, 0, 0);
        } else {
            // Idle breathing
            const breathe = Math.sin(t * 2.5) * 0.02;
            this.bones.torso.position.y = 0.15 + breathe;
            this.bones.torso.rotation.set(0, 0, 0);
            this.bones.head.rotation.set(0, Math.sin(t * 0.8) * 0.1, 0);
            this.bones.leftArm.rotation.set(breathe, 0, 0.08);
            this.bones.rightArm.rotation.set(breathe, 0, -0.08);
            this.bones.leftForearm.rotation.set(-0.1, 0, 0);
            this.bones.rightForearm.rotation.set(-0.1, 0, 0);
            this.bones.leftLeg.rotation.set(0, 0, 0);
            this.bones.rightLeg.rotation.set(0, 0, 0);
            this.bones.leftCalf.rotation.set(0, 0, 0);
            this.bones.rightCalf.rotation.set(0, 0, 0);
            this.bones.hips.position.y = 1.05;
            this.bones.hips.rotation.set(0, 0, 0);
        }
    }

    setAnimation(anim) {
        if (this.currentAnim !== anim) {
            this.currentAnim = anim;
            this.animTime = 0;

            // Toggle props visibility based on animation
            if (this.waakyeProp) this.waakyeProp.visible = (anim === 'eat');
            if (this.boxingGloves) {
                this.boxingGloves.forEach(g => g.visible = (anim === 'punch'));
            }
            if (this.laptopProp) this.laptopProp.visible = (anim === 'type');
            if (this.soccerBallProp) this.soccerBallProp.visible = (anim === 'kick');
            if (this.sleepingZzz) this.sleepingZzz.visible = (anim === 'sleep');
        }
    }

    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        this.buildCharacter();
    }
}
