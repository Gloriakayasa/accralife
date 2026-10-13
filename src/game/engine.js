// Accra Life 3D - Isometric City Engine (Lagos Life Clone)
// Features: 3D Controllable Player Character (Avatar3D), Tap-to-Walk with Destination Marker,
// Virtual Mobile Touch Joystick, WASD/Arrow Desktop Controls, Proximity Interaction System,
// East Legon Executive Villa & Jamestown Compound Houses, Physical In-World Animations

import * as THREE from '../../libjs/three.module.js';
import { WorldManager } from './world.js';
import { Avatar3D } from './avatar.js';
import { gameState } from './state.js';
import { audio } from './audio.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        // Isometric Camera State (Lagos Life Style)
        this.camTarget = new THREE.Vector3(0, 0, 4);
        this.camZoom = 42; // Distance
        this.minZoom = 20;
        this.maxZoom = 70;

        this.isDragging = false;
        this.lastPointerX = 0;
        this.lastPointerY = 0;
        this.dragDist = 0;
        this.cameraFollow = true;

        // Player Movement & Interaction State
        this.moveTarget = null;
        this.moveSpeed = 8.5; // Walk speed
        this.keys = {};
        this.joystickVector = { x: 0, z: 0 };
        this.activeNearbyTarget = null;
        this.actionTimer = 0;
        this.currentAction = null;
        this.onArriveCallback = null;

        this.initRenderer();
        this.initCamera();
        this.initLighting();
        this.initWorld();
        this.initPlayer();
        this.initDestinationMarker();
        this.initControls();
        this.initKeyboard();
        this.initVirtualJoystick();
        this.initRaycaster();
        this.initProximityPrompt();

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.scene.background = new THREE.Color(0xdbeafe); // Warm sunny coastal Accra sky
        this.scene.fog = new THREE.FogExp2(0xdbeafe, 0.0055);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            36,
            window.innerWidth / window.innerHeight,
            0.1,
            500
        );
        this.updateCamera(1.0);
    }

    initLighting() {
        // Bright tropical Ghanaian sunlight & warm ambient sky bounce
        const hemi = new THREE.HemisphereLight(0xfffbeb, 0x166534, 0.75);
        this.scene.add(hemi);

        this.sun = new THREE.DirectionalLight(0xfffaed, 1.4);
        this.sun.position.set(35, 55, 30);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 2048;
        this.sun.shadow.mapSize.height = 2048;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 160;
        const d = 50;
        this.sun.shadow.camera.left = -d;
        this.sun.shadow.camera.right = d;
        this.sun.shadow.camera.top = d;
        this.sun.shadow.camera.bottom = -d;
        this.sun.shadow.bias = -0.0005;
        this.scene.add(this.sun);
    }

    initWorld() {
        this.world = new WorldManager(this.scene);
    }

    initPlayer() {
        const charConfig = Object.assign({
            name: gameState.data.name || "Kwame",
            gender: gameState.data.gender || "male"
        }, gameState.data.avatar || {});

        this.player = new Avatar3D(charConfig);
        this.scene.add(this.player.group);

        // Spawn player at their residential home or initial origin
        if (gameState.data.housing?.id === 'east_legon_villa') {
            this.player.group.position.set(24, 0, -4);
        } else {
            this.player.group.position.set(-28, 0, 6);
        }

        this.camTarget.copy(this.player.group.position);
    }

    initDestinationMarker() {
        // Glowing circular ring decal indicating tap-to-walk ground target
        const group = new THREE.Group();
        const innerRing = new THREE.Mesh(
            new THREE.RingGeometry(0.5, 0.85, 32),
            new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85
            })
        );
        innerRing.rotation.x = -Math.PI / 2;
        group.add(innerRing);

        const centerDot = new THREE.Mesh(
            new THREE.CircleGeometry(0.25, 16),
            new THREE.MeshBasicMaterial({
                color: 0xf59e0b,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95
            })
        );
        centerDot.rotation.x = -Math.PI / 2;
        group.add(centerDot);

        group.position.y = 0.08;
        group.visible = false;
        this.scene.add(group);
        this.destinationMarker = group;
    }

    initControls() {
        // Pointer events for panning across Accra
        this.canvas.addEventListener('pointerdown', (e) => {
            this.isDragging = true;
            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
            this.dragDist = 0;
            audio.unlock();
        });

        window.addEventListener('pointermove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.lastPointerX;
            const dy = e.clientY - this.lastPointerY;
            this.dragDist += Math.hypot(dx, dy);

            if (this.dragDist > 12) {
                // Free camera pan mode (breaks follow until player moves)
                this.cameraFollow = false;
                const panSpeed = 0.055 * (this.camZoom / 48);
                this.camTarget.x = Math.max(-40, Math.min(40, this.camTarget.x - dx * panSpeed));
                this.camTarget.z = Math.max(-35, Math.min(32, this.camTarget.z - dy * panSpeed));
            }

            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
        });

        window.addEventListener('pointerup', () => {
            this.isDragging = false;
        });

        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camZoom + e.deltaY * 0.035));
        }, { passive: false });
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // 'E' or Space or Enter to trigger proximity interaction
            if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
                if (this.activeNearbyTarget && !document.querySelector('.modal-overlay')) {
                    e.preventDefault();
                    this.triggerActiveInteraction();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    initVirtualJoystick() {
        let joyContainer = document.getElementById('virtual-joystick');
        if (!joyContainer) {
            joyContainer = document.createElement('div');
            joyContainer.id = 'virtual-joystick';
            joyContainer.innerHTML = `
                <div id="joystick-base">
                    <div id="joystick-thumb"></div>
                </div>
            `;
            document.body.appendChild(joyContainer);
        }

        const base = document.getElementById('joystick-base');
        const thumb = document.getElementById('joystick-thumb');
        if (!base || !thumb) return;

        let touchId = null;
        let baseRect = null;
        const maxDist = 42;

        base.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (touchId !== null) return;
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            baseRect = base.getBoundingClientRect();
            audio.unlock();
            this.cameraFollow = true;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (touchId === null) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === touchId) {
                    const centerX = baseRect.left + baseRect.width / 2;
                    const centerY = baseRect.top + baseRect.height / 2;
                    const dx = touch.clientX - centerX;
                    const dy = touch.clientY - centerY;
                    const dist = Math.hypot(dx, dy);
                    const clampedDist = Math.min(dist, maxDist);
                    const angle = Math.atan2(dy, dx);

                    const knobX = Math.cos(angle) * clampedDist;
                    const knobY = Math.sin(angle) * clampedDist;

                    thumb.style.transform = `translate(${knobX}px, ${knobY}px)`;

                    // Isometric conversion (dx -> X, dy -> Z)
                    this.joystickVector.x = (knobX / maxDist);
                    this.joystickVector.z = (knobY / maxDist);
                    this.cameraFollow = true;
                }
            }
        });

        const resetJoystick = (e) => {
            if (touchId === null) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchId) {
                    touchId = null;
                    thumb.style.transform = `translate(0px, 0px)`;
                    this.joystickVector.x = 0;
                    this.joystickVector.z = 0;
                }
            }
        };

        window.addEventListener('touchend', resetJoystick);
        window.addEventListener('touchcancel', resetJoystick);
    }

    initProximityPrompt() {
        let promptEl = document.getElementById('interaction-prompt');
        if (!promptEl) {
            promptEl = document.createElement('div');
            promptEl.id = 'interaction-prompt';
            promptEl.className = 'interaction-prompt hidden';
            promptEl.onclick = () => this.triggerActiveInteraction();
            document.body.appendChild(promptEl);
        }
        this.promptEl = promptEl;
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.groundMathPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        this.canvas.addEventListener('click', (e) => {
            if (this.dragDist > 10) return; // Ignore drag release

            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);

            // 1. Check if user clicked an interactive object or venue badge hitbox
            const intersects = this.raycaster.intersectObjects(this.world.interactables, false);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                if (hit.userData) {
                    audio.playTap();
                    const targetX = hit.userData.posX !== undefined ? hit.userData.posX : hit.position.x;
                    const targetZ = hit.userData.posZ !== undefined ? hit.userData.posZ : hit.position.z;

                    // Walk the player to the clicked interactable
                    this.moveTo(targetX, targetZ, () => {
                        if (hit.userData.type === 'venue') {
                            if (window.ui && typeof window.ui.openVenue === 'function') {
                                window.ui.openVenue(hit.userData.venueId);
                            }
                        } else if (hit.userData.type === 'interactive_point') {
                            this.interactWithPoint(hit.userData);
                        } else if (hit.userData.type === 'npc') {
                            if (window.ui && typeof window.ui.openNpcDialogue === 'function') {
                                window.ui.openNpcDialogue(hit.userData.npcId);
                            }
                        }
                    });
                    return;
                }
            }

            // 2. Ground click: Tap-to-walk to ground point
            const groundIntersectPoint = new THREE.Vector3();
            if (this.raycaster.ray.intersectPlane(this.groundMathPlane, groundIntersectPoint)) {
                audio.playTap();
                this.moveTo(groundIntersectPoint.x, groundIntersectPoint.z);
            }
        });
    }

    moveTo(x, z, onArrive = null) {
        // Clamp to Accra city limits
        const targetX = THREE.MathUtils.clamp(x, -40, 40);
        const targetZ = THREE.MathUtils.clamp(z, -32, 24);

        this.moveTarget = new THREE.Vector3(targetX, 0, targetZ);
        this.destinationMarker.position.set(targetX, 0.08, targetZ);
        this.destinationMarker.visible = true;
        this.destinationMarker.scale.set(1, 1, 1);
        this.onArriveCallback = onArrive;

        this.actionTimer = 0;
        this.currentAction = null;
        this.cameraFollow = true;
    }

    teleportTo(x, z) {
        this.player.group.position.set(x, 0, z);
        this.moveTarget = null;
        this.destinationMarker.visible = false;
        this.camTarget.copy(this.player.group.position);
        this.cameraFollow = true;
        this.player.setAnimation('idle');
    }

    goToHome() {
        audio.playCashJingle();
        const isVilla = gameState.data.housing?.id === 'east_legon_villa';
        const targetX = isVilla ? 24 : -28;
        const targetZ = isVilla ? -4 : 6;

        this.teleportTo(targetX, targetZ);
        const homeName = isVilla ? "Kwame's East Legon Executive Villa" : "Kwame's Jamestown Compound House";
        if (window.ui && typeof window.ui.showToast === 'function') {
            window.ui.showToast(`🏡 Arrived at ${homeName}!`, '✨');
        }
    }

    updatePlayerMovement(delta) {
        if (!this.player) return;

        let inputX = 0;
        let inputZ = 0;

        // Desktop WASD & Arrow Keys
        if (this.keys['KeyW'] || this.keys['ArrowUp']) inputZ -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) inputZ += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) inputX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) inputX += 1;

        // Virtual Touch Joystick input
        if (Math.hypot(this.joystickVector.x, this.joystickVector.z) > 0.12) {
            inputX += this.joystickVector.x;
            inputZ += this.joystickVector.z;
        }

        const inputLen = Math.hypot(inputX, inputZ);

        if (inputLen > 0.1) {
            // Direct user steering overrides tap destination
            this.moveTarget = null;
            this.destinationMarker.visible = false;
            this.actionTimer = 0;
            this.currentAction = null;
            this.cameraFollow = true;

            const normX = inputX / inputLen;
            const normZ = inputZ / inputLen;

            const step = this.moveSpeed * delta;
            this.player.group.position.x += normX * step;
            this.player.group.position.z += normZ * step;

            // Clamp inside walkable map limits
            this.player.group.position.x = THREE.MathUtils.clamp(this.player.group.position.x, -40, 40);
            this.player.group.position.z = THREE.MathUtils.clamp(this.player.group.position.z, -32, 24);

            // Rotate player to face movement direction
            const targetAngle = Math.atan2(normX, normZ);
            let diff = targetAngle - this.player.group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.player.group.rotation.y += diff * 0.25;

            this.player.setAnimation('walk');
        } else if (this.moveTarget) {
            // Tap-to-walk navigation towards moveTarget
            const dx = this.moveTarget.x - this.player.group.position.x;
            const dz = this.moveTarget.z - this.player.group.position.z;
            const dist = Math.hypot(dx, dz);

            if (dist > 0.35) {
                const normX = dx / dist;
                const normZ = dz / dist;
                const step = Math.min(dist, this.moveSpeed * delta);

                this.player.group.position.x += normX * step;
                this.player.group.position.z += normZ * step;

                // Face target
                const targetAngle = Math.atan2(normX, normZ);
                let diff = targetAngle - this.player.group.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                this.player.group.rotation.y += diff * 0.25;

                this.player.setAnimation('walk');

                // Destination ring pulse
                const pulse = 1.0 + Math.sin(this.clock.elapsedTime * 8) * 0.15;
                this.destinationMarker.scale.set(pulse, pulse, pulse);
            } else {
                // Reached destination!
                this.moveTarget = null;
                this.destinationMarker.visible = false;
                this.player.setAnimation('idle');

                if (this.onArriveCallback) {
                    const cb = this.onArriveCallback;
                    this.onArriveCallback = null;
                    cb();
                }
            }
        } else if (this.actionTimer > 0) {
            // Playing timed action animation (e.g. eating waakye, punch sparring, azonto dancing, sleeping)
            this.actionTimer -= delta;
            if (this.actionTimer <= 0) {
                this.actionTimer = 0;
                this.currentAction = null;
                this.player.setAnimation('idle');
            }
        } else {
            // Idle state
            if (this.player.currentAnim === 'walk') {
                this.player.setAnimation('idle');
            }
        }

        // Update avatar bone animations
        this.player.update(delta);

        // Smooth camera follow
        if (this.cameraFollow) {
            this.camTarget.lerp(this.player.group.position, 0.08);
        }

        // Check proximity to venues and houses
        this.checkProximity();
    }

    checkProximity() {
        if (!this.world?.interactivePoints || !this.promptEl) return;

        let closestPoint = null;
        let minDistance = 4.8; // Trigger radius

        for (const pt of this.world.interactivePoints) {
            const dist = Math.hypot(
                pt.x - this.player.group.position.x,
                pt.z - this.player.group.position.z
            );
            if (dist < minDistance) {
                minDistance = dist;
                closestPoint = pt;
            }
        }

        this.activeNearbyTarget = closestPoint;

        if (closestPoint && !document.querySelector('.modal-overlay')) {
            this.promptEl.classList.remove('hidden');
            let actionVerb = "Interact";
            if (closestPoint.subType === 'bed') actionVerb = "Sleep (100% Energy)";
            else if (closestPoint.subType === 'pool') actionVerb = "Take a Swim";
            else if (closestPoint.subType === 'wardrobe') actionVerb = "Change Wardrobe Drip";
            else if (closestPoint.subType === 'basin') actionVerb = "Wash & Refresh";
            else if (closestPoint.id === 'auntie_muni') actionVerb = "Chop Steaming Waakye";
            else if (closestPoint.id === 'bloom_bar') actionVerb = "Azonto Dancefloor";
            else if (closestPoint.id === 'bukom_boxing') actionVerb = "Boxing Sparring";
            else if (closestPoint.id === 'stadium') actionVerb = "Kick Soccer Ball";
            else if (closestPoint.id === 'mest_tech') actionVerb = "Code FinTech Laptop";
            else if (closestPoint.id === 'circle_trotro') actionVerb = "Board Trotro";

            this.promptEl.innerHTML = `
                <div class="prompt-badge">E / TAP</div>
                <div class="prompt-content">
                    <span class="prompt-emoji">${closestPoint.emoji}</span>
                    <span class="prompt-text">${closestPoint.name}: <strong>${actionVerb}</strong></span>
                </div>
            `;
        } else {
            this.promptEl.classList.add('hidden');
        }
    }

    triggerActiveInteraction() {
        if (!this.activeNearbyTarget) return;
        audio.playTap();
        this.interactWithPoint(this.activeNearbyTarget);
    }

    interactWithPoint(target) {
        if (target.subType === 'venue' || target.type === 'venue') {
            const venueId = target.actionKey || target.id || target.venueId;
            if (window.ui && typeof window.ui.openVenue === 'function') {
                window.ui.openVenue(venueId);
            }
        } else if (target.subType === 'bed') {
            // Sleep in bed (Kwame's Villa or Jamestown Compound)
            this.player.setAnimation('sleep');
            this.actionTimer = 5.0;
            this.currentAction = 'sleep';
            gameState.refillEnergy(100);
            gameState.save();
            audio.playLevelUp();
            if (window.ui) {
                window.ui.showToast('Resting peacefully in bed! Energy fully restored to 100%! 🛏️💤', '✨');
            }
        } else if (target.subType === 'pool') {
            // Swim in East Legon pool
            this.player.setAnimation('wave');
            this.actionTimer = 3.5;
            this.currentAction = 'swim';
            gameState.refillEnergy(35);
            audio.playTap();
            if (window.ui) {
                window.ui.showToast('Splashing in private East Legon swimming pool! Refreshed! 🏊', '💦');
            }
        } else if (target.subType === 'wardrobe') {
            // Open wardrobe
            this.player.setAnimation('wave');
            if (window.ui && typeof window.ui.openWardrobeModal === 'function') {
                window.ui.openWardrobeModal();
            }
        } else if (target.subType === 'basin') {
            // Wash at Jamestown basin
            this.player.setAnimation('wave');
            this.actionTimer = 3.0;
            gameState.refillEnergy(30);
            audio.playTap();
            if (window.ui) {
                window.ui.showToast('Refreshed at the Jamestown compound water basin! 🪣', '💧');
            }
        }
    }

    performVenueAction(venueId) {
        // Physical in-world action triggered from venue card or proximity
        audio.playCashJingle();

        const venueActions = {
            auntie_muni: { x: -16, z: -1, rotY: Math.PI, anim: 'eat', duration: 4.5, toast: 'Chop steaming Auntie Muni Waakye with shito & wele! 🍛', icon: '🔥' },
            bloom_bar: { x: -20, z: 7, rotY: 0, anim: 'dance_azonto', duration: 6.0, toast: 'Dropping authentic Ghanaian Azonto moves on Bloom Bar stage! 🪩', icon: '🎉' },
            bukom_boxing: { x: -35, z: 6, rotY: Math.PI / 2, anim: 'punch', duration: 5.0, toast: 'Sparring 3 rounds with rapid jabs at Bukom Arena! 🥊', icon: '💥' },
            stadium: { x: -6, z: 7, rotY: -Math.PI / 2, anim: 'kick', duration: 4.5, toast: 'GOOOAL! Scored at Accra Sports Stadium! 🇬🇭⚽', icon: '🏆' },
            mest_tech: { x: 22, z: -20, rotY: Math.PI, anim: 'type', duration: 5.0, toast: 'Coding Mobile Money FinTech smart contract at MEST Tech! 💻', icon: '🚀' },
            circle_trotro: { x: -6, z: -19, rotY: 0, anim: 'wave', duration: 4.5, toast: 'Hopped onto Mercedes 207 Trotro! Route fare collected! 🚌', icon: '🪙' },
            labadi_beach: { x: 20, z: 18, rotY: Math.PI, anim: 'sit', duration: 5.0, toast: 'Lounging on Labadi Beach sand with sweet fresh coconut! 🥥🏖️', icon: '🌊' }
        };

        const act = venueActions[venueId];
        if (!act) return;

        // If distance is far (> 8 units), glide / place player directly there so interaction begins promptly
        const dist = Math.hypot(act.x - this.player.group.position.x, act.z - this.player.group.position.z);
        if (dist > 8) {
            this.player.group.position.set(act.x, 0, act.z);
            this.moveTarget = null;
            this.destinationMarker.visible = false;
            this.camTarget.copy(this.player.group.position);
            this.cameraFollow = true;
            this.player.group.rotation.y = act.rotY;
            this.player.setAnimation(act.anim);
            this.actionTimer = act.duration;
            this.currentAction = act.anim;
            if (window.ui) window.ui.showToast(act.toast, act.icon);
        } else {
            this.moveTo(act.x, act.z, () => {
                this.player.group.rotation.y = act.rotY;
                this.player.setAnimation(act.anim);
                this.actionTimer = act.duration;
                this.currentAction = act.anim;
                if (window.ui) window.ui.showToast(act.toast, act.icon);
            });
        }
    }

    focusOnVenue(x, z) {
        this.cameraFollow = false;
        this.camTarget.x = THREE.MathUtils.clamp(x, -36, 36);
        this.camTarget.z = THREE.MathUtils.clamp(z, -28, 30);
    }

    updateCamera(smoothness = 0.08) {
        // Isometric perspective angle: (x: 0.6 * zoom, y: 0.75 * zoom, z: 0.8 * zoom)
        const targetX = this.camTarget.x + this.camZoom * 0.45;
        const targetY = this.camZoom * 0.82;
        const targetZ = this.camTarget.z + this.camZoom * 0.75;

        this.camera.position.x += (targetX - this.camera.position.x) * smoothness;
        this.camera.position.y += (targetY - this.camera.position.y) * smoothness;
        this.camera.position.z += (targetZ - this.camera.position.z) * smoothness;

        this.camera.lookAt(this.camTarget);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();

        this.updatePlayerMovement(delta);
        this.updateCamera();
        if (this.world) this.world.update(delta);

        this.renderer.render(this.scene, this.camera);
    }
}
