import { Game } from '../Game';
import { GameState } from '../GameState';
import { WorldState } from './WorldState';
import { MenuState } from './MenuState';

export class CharacterCreateState implements GameState {
  private selectedRow: number = 0;
  private gender: 'male' | 'female' = 'male';
  private skinTone: number = 1; // 0: Ebony, 1: Bronze, 2: Caramel, 3: Golden
  private styleOutfit: number = 0; // 0: Casual, 1: Street Drip, 2: VIP Club
  private nameIndex: number = 0;
  private animTimer: number = 0;

  private readonly maleNames = ['Kofi', 'Kwame', 'Kojo', 'Yaw', 'Kwesi', 'Ebo'];
  private readonly femaleNames = ['Ama', 'Akosua', 'Abena', 'Yaa', 'Afia', 'Esi'];
  private readonly skinNames = ['Deep Ebony', 'Rich Bronze', 'Warm Caramel', 'Golden'];
  private readonly outfitNames = ['Casual Chale', 'Oxford St Drip', 'East Legon VIP'];

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Start', 'Back');
    this.gender = 'male';
    this.skinTone = 1;
    this.styleOutfit = 0;
    this.nameIndex = 0;
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    this.animTimer += delta;

    if (game.input.isJustPressed('ArrowUp')) {
      this.selectedRow = (this.selectedRow - 1 + 4) % 4;
      game.audio.playSfx(14);
    } else if (game.input.isJustPressed('ArrowDown')) {
      this.selectedRow = (this.selectedRow + 1) % 4;
      game.audio.playSfx(14);
    }

    if (game.input.isJustPressed('ArrowLeft')) {
      this.changeValue(-1, game);
    } else if (game.input.isJustPressed('ArrowRight')) {
      this.changeValue(1, game);
    }

    if (game.input.isJustPressed('Enter') || game.input.isJustPressed('SoftLeft') || game.input.isJustPressed('Space')) {
      game.audio.playSfx(13);
      this.startGame(game);
    } else if (game.input.isJustPressed('Escape') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(17);
      game.changeState(new MenuState());
    }
  }

  private changeValue(dir: number, game: Game): void {
    game.audio.playSfx(14);
    if (this.selectedRow === 0) {
      this.gender = this.gender === 'male' ? 'female' : 'male';
    } else if (this.selectedRow === 1) {
      const names = this.gender === 'male' ? this.maleNames : this.femaleNames;
      this.nameIndex = (this.nameIndex + dir + names.length) % names.length;
    } else if (this.selectedRow === 2) {
      this.skinTone = (this.skinTone + dir + this.skinNames.length) % this.skinNames.length;
    } else if (this.selectedRow === 3) {
      this.styleOutfit = (this.styleOutfit + dir + this.outfitNames.length) % this.outfitNames.length;
    }
  }

  private startGame(game: Game): void {
    const names = this.gender === 'male' ? this.maleNames : this.femaleNames;
    game.player.appearance = {
      gender: this.gender,
      skinTone: this.skinTone,
      hairColor: 0,
      styleOutfit: this.styleOutfit,
      name: names[this.nameIndex]
    };
    game.changeState(new WorldState('osu_apartment'));
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    // Backdrop
    ctx.fillStyle = '#0b0e18';
    ctx.fillRect(0, 0, 320, 240);

    // Title Bar
    ctx.fillStyle = '#171c2b';
    ctx.fillRect(10, 10, 300, 28);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, 300, 28);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CREATE YOUR ACCRA CHARACTER', 160, 28);

    // Left Side: Live Character Sprite Preview Stage
    const stageX = 25;
    const stageY = 50;
    const stageW = 100;
    const stageH = 160;

    ctx.fillStyle = '#141826';
    ctx.fillRect(stageX, stageY, stageW, stageH);
    ctx.strokeStyle = '#323a50';
    ctx.lineWidth = 1;
    ctx.strokeRect(stageX, stageY, stageW, stageH);

    // Stage spotlight circular gradient
    ctx.fillStyle = 'rgba(245, 184, 46, 0.15)';
    ctx.beginPath();
    ctx.ellipse(stageX + 50, stageY + 130, 32, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Render Real Live Gameloft Character Sprite Walking in Place!
    game.sprites.drawCharacter(
      ctx,
      this.gender,
      this.styleOutfit,
      'walk',
      'down',
      this.animTimer,
      stageX + 40,
      stageY + 75
    );

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LIVE PREVIEW', stageX + 50, stageY + 150);

    // Right Side: Customizer Options
    const optX = 135;
    const optY = 50;
    const optW = 160;
    const optH = 160;

    ctx.fillStyle = '#141826';
    ctx.fillRect(optX, optY, optW, optH);
    ctx.strokeStyle = '#323a50';
    ctx.lineWidth = 1;
    ctx.strokeRect(optX, optY, optW, optH);

    const names = this.gender === 'male' ? this.maleNames : this.femaleNames;
    const currentName = names[this.nameIndex];

    const fields = [
      { label: 'Gender', val: this.gender.toUpperCase() },
      { label: 'Name', val: currentName },
      { label: 'Complexion', val: this.skinNames[this.skinTone] },
      { label: 'Wardrobe', val: this.outfitNames[this.styleOutfit] }
    ];

    for (let i = 0; i < fields.length; i++) {
      const isSelected = i === this.selectedRow;
      const rowY = optY + 12 + i * 36;

      if (isSelected) {
        ctx.fillStyle = '#262f46';
        ctx.fillRect(optX + 6, rowY - 2, optW - 12, 30);
        ctx.strokeStyle = '#f5b82e';
        ctx.lineWidth = 1;
        ctx.strokeRect(optX + 6, rowY - 2, optW - 12, 30);
      }

      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = isSelected ? '#f5b82e' : '#9aa5be';
      ctx.fillText(fields[i].label, optX + 12, rowY + 9);

      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isSelected ? '#ffffff' : '#d2d9ea';
      ctx.fillText(`◀  ${fields[i].val}  ▶`, optX + optW / 2, rowY + 23);
    }

    // Softkey bar
    ctx.fillStyle = '#10131d';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Start Life', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Back', 312, 236);
  }
}
