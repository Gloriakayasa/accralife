// Accra Life 3D - Master 3D Game Engine (Three.js)
// 60FPS WebGL Renderer, 360-degree Orbit & Drag-to-Look Camera, Avatar Movement, & World Interactions

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

        this.moveInput = { x: 0, z: 0 };
        this.playerSpeed = 5.4; // Units per second

        // 3rd-Person Orbital Camera Parameters (Avakin Life / Sims style)
        this.orbitDistance = 7.0;
        this.targetDistance = 7.0;
        this.minDistance = 3.2;
        this.maxDistance = 14.0;

        this.orbitYaw = 0.28;
        this.targetYaw = 0.28;

        this.orbitPitch = 0.36; // ~21 degrees
        this.targetPitch = 0.36;
        this.minPitch = 0.08;   // ~4.5 degrees
        this.maxPitch = 1.15;   // ~66 degrees
        this.cameraPivotHeight = 1.35;

        // Pointer Drag State for Camera Orbit
        this.isDragging = false;
        this.lastPointerX = 0;
        this.lastPointerY = 0;
        this.pointerDragDist = 0;
        this.activePointers = new Map();
        this.initialPinchDistance = null;

        this.initRenderer();
        this.initCamera();
        this.initLighting();
        this.initWorld();
        this.initPlayer();
        this.initOrbitControls();
        this.initRaycaster();

        // Spawn in user's active district
        const initialDistrict = gameState.data.district || 'osu';
        this.loadDistrict(initialDistrict);

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
        this.scene.background = new THREE.Color(0x0a1122); // Atmospheric night sky
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            250
        );
        this.camera.position.set(0, 5, 8);
    }

    initLighting() {
        // West African tropical ambient warmth
        const ambient = new THREE.AmbientLight(0xffedd5, 0.75);
        this.scene.add(ambient);

        // Directional Sun / Street Spotlight with soft shadows
        this.sun = new THREE.DirectionalLight(0xfef08a, 1.25);
        this.sun.position.set(16, 26, 16);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 1024;
        this.sun.shadow.mapSize.height = 1024;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 65;
        const d = 26;
        this.sun.shadow.camera.left = -d;
        this.sun.shadow.camera.right = d;
        this.sun.shadow.camera.top = d;
        this.sun.shadow.camera.bottom = -d;
        this.scene.add(this.sun);

        // Evening tropical sky fill
        const hemi = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.45);
        this.scene.add(hemi);
    }

    initWorld() {
        this.world = new WorldManager(this.scene);
    }

    initPlayer() {
        this.avatar = new Avatar3D(gameState.data.avatar);
        this.avatar.group.position.set(0, 0, 0);
        this.scene.add(this.avatar.group);
    }

    initOrbitControls() {
        // Drag-to-orbit camera rotation on canvas (Mouse & Touch)
        this.canvas.addEventListener('pointerdown', (e) => {
            this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (this.activePointers.size === 1) {
                this.isDragging = true;
                this.lastPointerX = e.clientX;
                this.lastPointerY = e.clientY;
                this.pointerDragDist = 0;
            } else if (this.activePointers.size === 2) {
                // Two-finger pinch zoom
                const pts = Array.from(this.activePointers.values());
                this.initialPinchDistance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            }
        });

        window.addEventListener('pointermove', (e) => {
            if (this.activePointers.has(e.pointerId)) {
                this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            }

            // Pinch zoom handling
            if (this.activePointers.size === 2 && this.initialPinchDistance) {
                const pts = Array.from(this.activePointers.values());
                const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
                const pinchDelta = currentDist - this.initialPinchDistance;
                this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance - pinchDelta * 0.02));
                this.initialPinchDistance = currentDist;
                return;
            }

            if (!this.isDragging) return;

            const dx = e.clientX - this.lastPointerX;
            const dy = e.clientY - this.lastPointerY;
            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
            this.pointerDragDist += Math.hypot(dx, dy);

            // Orbit Yaw & Pitch sensitivity
            this.targetYaw -= dx * 0.0055;
            this.targetPitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.targetPitch - dy * 0.0045));
        });

        const endPointer = (e) => {
            this.activePointers.delete(e.pointerId);
            if (this.activePointers.size === 0) {
                this.isDragging = false;
                this.initialPinchDistance = null;
            } else if (this.activePointers.size === 1) {
                const pt = Array.from(this.activePointers.values())[0];
                this.lastPointerX = pt.x;
                this.lastPointerY = pt.y;
                this.initialPinchDistance = null;
            }
        };

        window.addEventListener('pointerup', endPointer);
        window.addEventListener('pointercancel', endPointer);

        // Desktop mouse wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            this.targetDistance = Math.max(
                this.minDistance,
                Math.min(this.maxDistance, this.targetDistance + e.deltaY * 0.006)
            );
        }, { passive: true });
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.canvas.addEventListener('pointerup', (e) => {
            // Only fire interactable clicks if user didn't drag the camera
            if (this.pointerDragDist > 8) return;

            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.world.interactables, true);

            if (intersects.length > 0) {
                let obj = intersects[0].object;
                while (obj && !obj.userData?.type && obj.parent) {
                    obj = obj.parent;
                }

                if (obj && obj.userData?.type) {
                    this.handleInteraction(obj.userData);
                }
            }
        });
    }

    loadDistrict(districtId) {
        this.world.loadDistrict(districtId);
        this.spawnInDistrict(districtId);
    }

    spawnInDistrict(districtId) {
        if (!this.avatar) return;

        if (districtId === 'osu') {
            this.avatar.group.position.set(0, 0, 4);
            this.avatar.group.rotation.y = 0;
            this.targetYaw = 0.28;
            this.targetPitch = 0.35;
            this.targetDistance = 7.0;
        } else if (districtId === 'east_legon') {
            this.avatar.group.position.set(0, 0, 4);
            this.avatar.group.rotation.y = 0.2;
            this.targetYaw = -0.35;
            this.targetPitch = 0.38;
            this.targetDistance = 7.5;
        } else if (districtId === 'labadi') {
            this.avatar.group.position.set(0, 0, 11);
            this.avatar.group.rotation.y = 0;
            this.targetYaw = 0.05;
            this.targetPitch = 0.28;
            this.targetDistance = 7.2;
        } else if (districtId === 'jamestown') {
            this.avatar.group.position.set(0, 0, 4);
            this.avatar.group.rotation.y = -0.3;
            this.targetYaw = -0.45;
            this.targetPitch = 0.36;
            this.targetDistance = 7.5;
        } else if (districtId === 'penthouse') {
            this.avatar.group.position.set(0, 0, 2);
            this.avatar.group.rotation.y = 0;
            this.targetYaw = 0.15;
            this.targetPitch = 0.30;
            this.targetDistance = 6.2;
        }

        this.orbitYaw = this.targetYaw;
        this.orbitPitch = this.targetPitch;
        this.orbitDistance = this.targetDistance;
        this.updateCamera(1.0);
    }

    handleInteraction(data) {
        audio.playTap();
        if (data.type === 'npc') {
            window.ui.openNpcDialogue(data.npcId);
        } else if (data.type === 'gig') {
            window.ui.triggerCurrentGig();
        } else if (data.type === 'food') {
            window.ui.triggerFoodPrompt();
        } else if (data.type === 'wardrobe') {
            window.ui.openWardrobe();
        } else if (data.type === 'sleep') {
            gameState.refillEnergy(100);
            window.ui.showToast('Slept peacefully in your Penthouse! Energy 100% restored.', '🛏️');
        } else if (data.type === 'chill') {
            gameState.refillEnergy(50);
            gameState.consumeHunger(-30);
            window.ui.showToast('Relaxed at Labadi Beach with coconut drink!', '🍹');
        }
    }

    setMoveInput(x, y) {
        this.moveInput.x = x;
        this.moveInput.z = y;
    }

    updatePlayer(delta) {
        const mx = this.moveInput.x;
        const mz = this.moveInput.z;
        const isMoving = (Math.abs(mx) > 0.05 || Math.abs(mz) > 0.05);

        if (isMoving) {
            // Footstep audio pulse
            if (Math.random() < 0.08) audio.playFootstep();

            // Camera forward vector in XZ plane
            const camForwardX = -Math.sin(this.orbitYaw);
            const camForwardZ = -Math.cos(this.orbitYaw);

            // Camera right vector (90 degrees clockwise)
            const camRightX = -camForwardZ;
            const camRightZ = camForwardX;

            // In joystick input: mx is right/left, mz is down/up (negative = forward)
            const worldMoveX = (camRightX * mx) + (camForwardX * (-mz));
            const worldMoveZ = (camRightZ * mx) + (camForwardZ * (-mz));

            const moveLength = Math.hypot(worldMoveX, worldMoveZ);
            if (moveLength > 0.01) {
                const normX = worldMoveX / moveLength;
                const normZ = worldMoveZ / moveLength;

                let nextX = this.avatar.group.position.x + normX * this.playerSpeed * delta;
                let nextZ = this.avatar.group.position.z + normZ * this.playerSpeed * delta;

                // Boundary clamping so avatar stays in playable area
                const district = this.world.currentDistrict;
                if (district === 'penthouse') {
                    nextX = Math.max(-10.5, Math.min(10.5, nextX));
                    nextZ = Math.max(-10.5, Math.min(10.5, nextZ));
                } else if (district === 'labadi') {
                    nextX = Math.max(-26, Math.min(26, nextX));
                    nextZ = Math.max(-4, Math.min(25, nextZ));
                } else {
                    nextX = Math.max(-26, Math.min(26, nextX));
                    nextZ = Math.max(-26, Math.min(26, nextZ));
                }

                // Obstacle collision detection with wall sliding
                let canMoveX = true;
                let canMoveZ = true;
                const pad = 0.4; // Avatar collision radius

                if (this.world && this.world.colliders) {
                    for (const col of this.world.colliders) {
                        if (col.type === 'box') {
                            if (nextX + pad > col.minX && nextX - pad < col.maxX &&
                                this.avatar.group.position.z + pad > col.minZ && this.avatar.group.position.z - pad < col.maxZ) {
                                canMoveX = false;
                            }
                            if (this.avatar.group.position.x + pad > col.minX && this.avatar.group.position.x - pad < col.maxX &&
                                nextZ + pad > col.minZ && nextZ - pad < col.maxZ) {
                                canMoveZ = false;
                            }
                        } else if (col.type === 'circle') {
                            if (Math.hypot(nextX - col.x, this.avatar.group.position.z - col.z) < col.radius + pad) {
                                canMoveX = false;
                            }
                            if (Math.hypot(this.avatar.group.position.x - col.x, nextZ - col.z) < col.radius + pad) {
                                canMoveZ = false;
                            }
                        }
                    }
                }

                if (canMoveX) this.avatar.group.position.x = nextX;
                if (canMoveZ) this.avatar.group.position.z = nextZ;

                // Smoothly rotate avatar towards movement direction (shortest angle)
                const targetAngle = Math.atan2(normX, normZ);
                let angleDiff = (targetAngle - this.avatar.group.rotation.y) % (Math.PI * 2);
                if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                this.avatar.group.rotation.y += angleDiff * Math.min(1, 14 * delta);

                this.avatar.setAnimation('walk');
            }
        } else if (this.avatar.currentAnim === 'walk') {
            this.avatar.setAnimation('idle');
        }

        this.avatar.update(delta);
    }

    updateCamera(delta) {
        this.orbitYaw = THREE.MathUtils.lerp(this.orbitYaw, this.targetYaw, 12 * delta);
        this.orbitPitch = THREE.MathUtils.lerp(this.orbitPitch, this.targetPitch, 12 * delta);
        this.orbitDistance = THREE.MathUtils.lerp(this.orbitDistance, this.targetDistance, 10 * delta);

        const avatarPos = this.avatar.group.position;
        const pivotY = avatarPos.y + this.cameraPivotHeight;

        const horizDist = this.orbitDistance * Math.cos(this.orbitPitch);
        const vertDist = this.orbitDistance * Math.sin(this.orbitPitch);

        const camX = avatarPos.x + horizDist * Math.sin(this.orbitYaw);
        const camZ = avatarPos.z + horizDist * Math.cos(this.orbitYaw);
        const camY = pivotY + vertDist;

        this.camera.position.set(camX, camY, camZ);
        this.camera.lookAt(avatarPos.x, pivotY, avatarPos.z);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = Math.min(this.clock.getDelta(), 0.1);

        this.updatePlayer(delta);
        if (this.world && this.world.update) {
            this.world.update(delta);
        }
        this.updateCamera(delta);
        this.renderer.render(this.scene, this.camera);
    }
}
