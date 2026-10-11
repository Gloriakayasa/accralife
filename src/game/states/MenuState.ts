import { Game } from '../Game';
import { GameState } from '../GameState';
import { SaveManager } from '../../engine/SaveManager';
import { CharacterCreateState } from './CharacterCreateState';
import { WorldState } from './WorldState';
import { OptionsState } from './OptionsState';
import { AboutState } from './AboutState';

export class MenuState implements GameState {
  private selectedIndex: number = 0;
  private menuItems: { id: string; label: string }[] = [];
  private animTimer: number = 0;

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Select', 'Exit');
    game.audio.playBgm(1); // Title Highlife Theme

    const hasSave = SaveManager.hasSave();
    this.menuItems = [];
    if (hasSave) {
      this.menuItems.push({ id: 'continue', label: 'CONTINUE' });
    }
    this.menuItems.push({ id: 'new_game', label: 'NEW GAME' });
    this.menuItems.push({ id: 'options', label: 'OPTIONS' });
    this.menuItems.push({ id: 'help', label: 'HELP & CONTROLS' });
    this.menuItems.push({ id: 'about', label: 'ABOUT ACCRA' });

    this.selectedIndex = 0;
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    this.animTimer += delta;

    if (game.input.isJustPressed('ArrowUp')) {
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
      game.audio.playSfx(14);
    } else if (game.input.isJustPressed('ArrowDown')) {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
      game.audio.playSfx(14);
    }

    if (game.input.isJustPressed('Enter') || game.input.isJustPressed('SoftLeft') || game.input.isJustPressed('Space')) {
      game.audio.playSfx(13);
      this.selectCurrent(game);
    }
  }

  private selectCurrent(game: Game): void {
    const item = this.menuItems[this.selectedIndex];
    if (item.id === 'continue') {
      const save = SaveManager.loadGame();
      if (save) {
        game.player.appearance = save.appearance;
        game.player.stats = save.stats;
        game.player.cash = save.cash;
        game.player.career = save.career;
        game.player.day = save.day;
        game.player.hour = save.hour;
        game.player.minute = save.minute;
        game.player.currentLocationId = save.currentLocationId;
        game.player.x = save.playerX;
        game.player.y = save.playerY;
        game.player.targetX = save.playerX;
        game.player.targetY = save.playerY;
        game.player.inventory = save.inventory;
        game.player.relationships = save.relationships;
        game.player.quests = save.quests;
      }
      game.changeState(new WorldState());
    } else if (item.id === 'new_game') {
      game.changeState(new CharacterCreateState());
    } else if (item.id === 'options') {
      game.pushState(new OptionsState());
    } else if (item.id === 'help') {
      alert("Controls:\n\n• Move: Arrow Keys / WASD / Virtual D-Pad\n• Action / Select: Space / Enter / 'A' Button\n• Back / Menu: Escape / Backspace / 'B' Button\n• ChalePhone: 'P' Key / 📱 Phone Button\n\nLive your best Accra life! Balance your Energy, Hunger (eat Jollof/Waakye!), Hygiene, Fun, Social, and Style meters!");
    } else if (item.id === 'about') {
      game.pushState(new AboutState());
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    // 1. Authentic Gameloft Retro City Map Backdrop (Pack 9_9 Frame 0)
    ctx.fillStyle = '#080c16';
    ctx.fillRect(0, 0, 320, 240);
    game.sprites.drawFrame(ctx, 9, 9, 0, 0, 0);

    // Warm tropical night overlay
    ctx.fillStyle = 'rgba(10, 14, 24, 0.68)';
    ctx.fillRect(0, 0, 320, 240);

    // Jamestown Lighthouse beam sweeping the night sky
    const beamAngle = this.animTimer * 1.5;
    const beamX = 260 + Math.cos(beamAngle) * 90;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 235, 150, 0.15)';
    ctx.beginPath();
    ctx.moveTo(270, 130);
    ctx.lineTo(beamX - 35, 20);
    ctx.lineTo(beamX + 35, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Street ground
    ctx.fillStyle = 'rgba(14, 18, 28, 0.88)';
    ctx.fillRect(0, 195, 320, 45);
    ctx.fillStyle = '#f5b82e';
    ctx.fillRect(0, 195, 320, 1.5);

    // Animated yellow-orange taxi / tro-tro driving across the street
    const cabX = (Math.floor(this.animTimer * 55) % 420) - 90;
    ctx.fillStyle = '#e69517'; // Yellow trotro
    ctx.fillRect(cabX, 207, 44, 16);
    ctx.fillStyle = '#1e7e48'; // Green side stripe
    ctx.fillRect(cabX, 215, 44, 3);
    ctx.fillStyle = '#11131a';
    ctx.fillRect(cabX + 6, 203, 30, 8); // Roof
    ctx.fillStyle = '#222';
    ctx.fillRect(cabX + 5, 222, 9, 5); // Wheel
    ctx.fillRect(cabX + 30, 222, 9, 5); // Wheel
    ctx.fillStyle = '#fff';
    ctx.fillRect(cabX + 42, 211, 4, 4); // Headlight

    // Title Box
    ctx.fillStyle = 'rgba(18, 22, 33, 0.94)';
    ctx.fillRect(20, 12, 280, 52);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 12, 280, 52);

    // Flag stripe on top of title
    ctx.fillStyle = '#cf2a2a';
    ctx.fillRect(22, 14, 91, 3);
    ctx.fillStyle = '#f5b82e';
    ctx.fillRect(113, 14, 94, 3);
    ctx.fillStyle = '#1e7e48';
    ctx.fillRect(207, 14, 91, 3);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACCRA LIFE', 160, 36);

    ctx.fillStyle = '#9aa5be';
    ctx.font = '9px monospace';
    ctx.fillText('★ NOKIA E71 RETRO EDITION ★', 160, 52);

    // Menu Box
    const menuY = 74;
    const boxH = this.menuItems.length * 22 + 8;
    ctx.fillStyle = 'rgba(18, 22, 33, 0.95)';
    ctx.fillRect(60, menuY, 200, boxH);
    ctx.strokeStyle = '#374158';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, menuY, 200, boxH);

    for (let i = 0; i < this.menuItems.length; i++) {
      const item = this.menuItems[i];
      const isSelected = i === this.selectedIndex;
      const itemY = menuY + 12 + i * 22;

      if (isSelected) {
        ctx.fillStyle = '#f5b82e';
        ctx.fillRect(65, itemY - 4, 190, 18);
        ctx.fillStyle = '#11131a';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`▶ ${item.label} ◀`, 160, itemY + 9);
      } else {
        ctx.fillStyle = '#d5dceb';
        ctx.font = '11px monospace';
        ctx.fillText(item.label, 160, itemY + 9);
      }
    }

    // Softkey bar
    ctx.fillStyle = '#11141e';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Select', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Exit', 312, 236);
  }
}
