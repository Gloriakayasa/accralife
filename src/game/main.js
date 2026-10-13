// Accra Life 3D - Main Game Entry Point
import { GameEngine } from './engine.js';
import { UIManager } from './ui.js';
import { audio } from './audio.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Fatal: #game-canvas not found!');
        return;
    }

    const engine = new GameEngine(canvas);
    const ui = new UIManager(engine);
    window.ui = ui;
    window.engine = engine;

    // First user gesture unlocks procedural audio
    const unlockAudio = () => {
        audio.unlock();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    console.log('✨ Accra Life 3D successfully initialized!');
});
