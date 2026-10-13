// Accra Life 3D - Isometric City Engine (Lagos Life Clone)
// WebGL Renderer, Smooth Isometric Pan/Zoom Controls, Venue Raycasting, Day/Night Atmosphere

import * as THREE from '../../libjs/three.module.js';
import { WorldManager } from './world.js';
import { gameState } from './state.js';
import { audio } from './audio.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        // Isometric Camera State (Lagos Life Style)
        this.camTarget = new THREE.Vector3(0, 0, 4);
        this.camZoom = 48; // Distance
        this.minZoom = 24;
        this.maxZoom = 75;

        this.isDragging = false;
        this.lastPointerX = 0;
        this.lastPointerY = 0;
        this.dragDist = 0;

        this.initRenderer();
        this.initCamera();
        this.initLighting();
        this.initWorld();
        this.initControls();
        this.initRaycaster();

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
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            38,
            window.innerWidth / window.innerHeight,
            0.1,
            500
        );
        this.updateCamera(1.0);
    }

    initLighting() {
        // Bright tropical Ghanaian sunlight
        const ambient = new THREE.AmbientLight(0xfff7ed, 0.85);
        this.scene.add(ambient);

        this.sun = new THREE.DirectionalLight(0xfef08a, 1.3);
        this.sun.position.set(30, 50, 25);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 1024;
        this.sun.shadow.mapSize.height = 1024;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 150;
        const d = 45;
        this.sun.shadow.camera.left = -d;
        this.sun.shadow.camera.right = d;
        this.sun.shadow.camera.top = d;
        this.sun.shadow.camera.bottom = -d;
        this.scene.add(this.sun);
    }

    initWorld() {
        this.world = new WorldManager(this.scene);
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

            // Pan camera across the map plane
            const panSpeed = 0.055 * (this.camZoom / 48);
            this.camTarget.x = Math.max(-36, Math.min(36, this.camTarget.x - dx * panSpeed));
            this.camTarget.z = Math.max(-28, Math.min(30, this.camTarget.z - dy * panSpeed));

            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
        });

        window.addEventListener('pointerup', (e) => {
            this.isDragging = false;
        });

        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camZoom + e.deltaY * 0.035));
        }, { passive: false });
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.canvas.addEventListener('click', (e) => {
            if (this.dragDist > 10) return; // Ignore drag release

            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects(this.world.interactables, false);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                if (hit.userData) {
                    audio.playTap();
                    if (hit.userData.type === 'venue') {
                        // Smoothly shift focus towards venue
                        this.focusOnVenue(hit.position.x + hit.parent.position.x, hit.position.z + hit.parent.position.z);
                        if (window.ui && typeof window.ui.openVenue === 'function') {
                            window.ui.openVenue(hit.userData.venueId);
                        }
                    } else if (hit.userData.type === 'npc') {
                        if (window.ui && typeof window.ui.openNpcDialogue === 'function') {
                            window.ui.openNpcDialogue(hit.userData.npcId);
                        }
                    }
                }
            }
        });
    }

    focusOnVenue(x, z) {
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

        this.updateCamera();
        if (this.world) this.world.update(delta);

        this.renderer.render(this.scene, this.camera);
    }
}
