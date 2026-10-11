import { Game } from './game/Game';

window.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element #game-canvas not found!');
    return;
  }

  const game = new Game(canvas);

  // Initialize UI Header Buttons
  const soundBtn = document.getElementById('btn-toggle-sound');
  const musicBtn = document.getElementById('btn-toggle-music');
  const crtBtn = document.getElementById('btn-toggle-crt');
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  const crtOverlay = document.getElementById('crt-overlay');

  if (soundBtn) {
    soundBtn.classList.toggle('active', game.audio.isSfxEnabled());
    soundBtn.addEventListener('click', () => {
      const enabled = game.audio.toggleSfx();
      soundBtn.classList.toggle('active', enabled);
    });
  }

  if (musicBtn) {
    musicBtn.classList.toggle('active', game.audio.isMusicEnabled());
    musicBtn.addEventListener('click', () => {
      const enabled = game.audio.toggleMusic();
      musicBtn.classList.toggle('active', enabled);
    });
  }

  // CRT Filter Toggle
  const savedCrt = localStorage.getItem('accra_crt');
  const isCrtOn = savedCrt !== 'false';
  if (crtOverlay) {
    crtOverlay.classList.toggle('crt-active', isCrtOn);
  }
  if (crtBtn) {
    crtBtn.classList.toggle('active', isCrtOn);
    crtBtn.addEventListener('click', () => {
      if (crtOverlay) {
        const active = !crtOverlay.classList.contains('crt-active');
        crtOverlay.classList.toggle('crt-active', active);
        localStorage.setItem('accra_crt', String(active));
        crtBtn.classList.toggle('active', active);
      }
    });
  }

  // Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Audio gesture unlock
  const unlockAudio = () => {
    game.audio.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // Start Accra Life!
  try {
    await game.init();
    game.start();
  } catch (err) {
    console.error('Failed to initialize Accra Life:', err);
  }
});
