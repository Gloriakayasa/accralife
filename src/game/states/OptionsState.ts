import { Game } from '../Game';
import { GameState } from '../GameState';
import { SaveManager } from '../../engine/SaveManager';

export class OptionsState implements GameState {
  private selectedIndex: number = 0;
  private confirmReset: boolean = false;
  private noticeText: string = '';
  private noticeTimer: number = 0;
  private crtActive: boolean = true;

  private readonly options = [
    { id: 'sfx', label: 'Sound FX' },
    { id: 'music', label: 'Music & Beats' },
    { id: 'crt', label: 'CRT Retro Filter' },
    { id: 'reset', label: 'Clear Save Data' },
    { id: 'back', label: 'Back to Menu' }
  ];

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Toggle', 'Back');
    const overlay = document.getElementById('crt-overlay');
    this.crtActive = overlay ? overlay.classList.contains('crt-active') : true;
    this.confirmReset = false;
    this.noticeTimer = 0;
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    if (this.noticeTimer > 0) {
      this.noticeTimer -= delta;
      if (this.noticeTimer <= 0) {
        this.noticeText = '';
      }
    }

    if (this.confirmReset) {
      if (game.input.isJustPressed('Enter') || game.input.isJustPressed('SoftLeft') || game.input.isJustPressed('Space')) {
        SaveManager.clearSave();
        this.confirmReset = false;
        this.noticeText = 'Save Data Cleared!';
        this.noticeTimer = 2.5;
        game.audio.playSfx(18);
        game.input.setSoftkeyLabels('Toggle', 'Back');
      } else if (game.input.isJustPressed('Escape') || game.input.isJustPressed('SoftRight')) {
        this.confirmReset = false;
        game.audio.playSfx(17);
        game.input.setSoftkeyLabels('Toggle', 'Back');
      }
      return;
    }

    if (game.input.isJustPressed('ArrowUp')) {
      this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
      game.audio.playSfx(14);
    } else if (game.input.isJustPressed('ArrowDown')) {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
      game.audio.playSfx(14);
    }

    if (
      game.input.isJustPressed('Enter') ||
      game.input.isJustPressed('Space') ||
      game.input.isJustPressed('SoftLeft') ||
      game.input.isJustPressed('ArrowLeft') ||
      game.input.isJustPressed('ArrowRight')
    ) {
      this.handleSelect(game);
    } else if (game.input.isJustPressed('Escape') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(17);
      game.popState();
    }
  }

  private handleSelect(game: Game): void {
    const opt = this.options[this.selectedIndex];
    if (opt.id === 'sfx') {
      const state = game.audio.toggleSfx();
      const btn = document.getElementById('btn-toggle-sound');
      if (btn) btn.classList.toggle('active', state);
      if (state) game.audio.playSfx(13);
    } else if (opt.id === 'music') {
      const state = game.audio.toggleMusic();
      const btn = document.getElementById('btn-toggle-music');
      if (btn) btn.classList.toggle('active', state);
      game.audio.playSfx(14);
    } else if (opt.id === 'crt') {
      const overlay = document.getElementById('crt-overlay');
      const btn = document.getElementById('btn-toggle-crt');
      if (overlay) {
        overlay.classList.toggle('crt-active');
        this.crtActive = overlay.classList.contains('crt-active');
        localStorage.setItem('accra_crt', String(this.crtActive));
        if (btn) btn.classList.toggle('active', this.crtActive);
      }
      game.audio.playSfx(14);
    } else if (opt.id === 'reset') {
      game.audio.playSfx(29);
      this.confirmReset = true;
      game.input.setSoftkeyLabels('Confirm', 'Cancel');
    } else if (opt.id === 'back') {
      game.audio.playSfx(17);
      game.popState();
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(8, 11, 18, 0.90)';
    ctx.fillRect(0, 0, 320, 240);

    const wx = 35;
    const wy = 22;
    const ww = 250;
    const wh = 196;

    ctx.fillStyle = '#141824';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = '#3d465f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(wx, wy, ww, wh);

    // Title Bar
    ctx.fillStyle = '#1e2436';
    ctx.fillRect(wx + 2, wy + 2, ww - 4, 26);
    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚙ GAME OPTIONS ⚙', 160, wy + 19);

    const startY = wy + 42;
    const rowH = 26;

    for (let i = 0; i < this.options.length; i++) {
      const item = this.options[i];
      const isSelected = i === this.selectedIndex;
      const ry = startY + i * rowH;

      if (isSelected) {
        ctx.fillStyle = '#29324d';
        ctx.fillRect(wx + 8, ry - 3, ww - 16, 22);
        ctx.strokeStyle = '#f5b82e';
        ctx.lineWidth = 1;
        ctx.strokeRect(wx + 8, ry - 3, ww - 16, 22);
      }

      ctx.font = isSelected ? 'bold 10px monospace' : '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = isSelected ? '#f5b82e' : '#cdd3e5';
      ctx.fillText(`${isSelected ? '▶ ' : '  '}${item.label}`, wx + 14, ry + 12);

      ctx.textAlign = 'right';
      if (item.id === 'sfx') {
        const on = game.audio.isSfxEnabled();
        ctx.fillStyle = on ? '#57db80' : '#888e9f';
        ctx.fillText(on ? '[ ON ]' : '[ OFF ]', wx + ww - 16, ry + 12);
      } else if (item.id === 'music') {
        const on = game.audio.isMusicEnabled();
        ctx.fillStyle = on ? '#57db80' : '#888e9f';
        ctx.fillText(on ? '[ ON ]' : '[ OFF ]', wx + ww - 16, ry + 12);
      } else if (item.id === 'crt') {
        ctx.fillStyle = this.crtActive ? '#57db80' : '#888e9f';
        ctx.fillText(this.crtActive ? '[ ON ]' : '[ OFF ]', wx + ww - 16, ry + 12);
      } else if (item.id === 'reset') {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText('[ RESET ]', wx + ww - 16, ry + 12);
      } else if (item.id === 'back') {
        ctx.fillStyle = '#a0a8be';
        ctx.fillText('[ ↵ ]', wx + ww - 16, ry + 12);
      }
    }

    if (this.noticeText) {
      ctx.fillStyle = '#ff4d4d';
      ctx.fillRect(wx + 10, wy + wh - 26, ww - 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.noticeText, 160, wy + wh - 12);
    }

    if (this.confirmReset) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(wx + 10, wy + 40, ww - 20, 110);
      ctx.strokeStyle = '#ff4d4d';
      ctx.lineWidth = 2;
      ctx.strokeRect(wx + 10, wy + 40, ww - 20, 110);

      ctx.fillStyle = '#ff6b6b';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RESET ACCRA LIFE SAVE?', 160, wy + 64);

      ctx.fillStyle = '#f0f3ff';
      ctx.font = '9px monospace';
      ctx.fillText('All player stats and Cedis', 160, wy + 84);
      ctx.fillText('will be permanently erased!', 160, wy + 98);

      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('[ Left: Confirm ]   [ Right: Cancel ]', 160, wy + 130);
    }

    // Softkey bar
    ctx.fillStyle = '#10141e';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f97ae';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(this.confirmReset ? 'Confirm' : 'Toggle', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText(this.confirmReset ? 'Cancel' : 'Back', 312, 236);
  }
}
