import { Game } from '../Game';
import { GameState } from '../GameState';

interface DanceBeat {
  id: number;
  dir: 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'ArrowRight';
  time: number;
  hit: boolean;
  missed: boolean;
}

export class PartyState implements GameState {
  private beats: DanceBeat[] = [];
  private songTime: number = 0;
  private score: number = 0;
  private combo: number = 0;
  private maxCombo: number = 0;
  private feedbackText: string = '';
  private feedbackTimer: number = 0;
  private gameOver: boolean = false;
  private animTimer: number = 0;

  private readonly hitY = 185;

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Dance', 'Exit');
    game.audio.playBgm(3); // Azonto Club Beat

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.songTime = 0;
    this.gameOver = false;
    this.feedbackText = '';
    this.animTimer = 0;

    // Generate rhythm sequence
    this.beats = [];
    const dirs: DanceBeat['dir'][] = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'];
    for (let i = 0; i < 40; i++) {
      const beatTime = 1.2 + i * 0.75 + (Math.sin(i * 1.5) * 0.15);
      const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
      this.beats.push({
        id: i,
        dir: randomDir,
        time: beatTime,
        hit: false,
        missed: false
      });
    }
  }

  exit(game: Game): void {
    game.audio.playBgm(game.player.currentLocationId === 'labadi_beach' ? 4 : 3);
  }

  update(game: Game, delta: number): void {
    this.animTimer += delta;

    if (this.gameOver) {
      if (
        game.input.isJustPressed('Enter') ||
        game.input.isJustPressed('Space') ||
        game.input.isJustPressed('Escape') ||
        game.input.isJustPressed('SoftLeft') ||
        game.input.isJustPressed('SoftRight')
      ) {
        game.player.modifyStat('fun', 50);
        game.player.modifyStat('style', 25);
        game.player.cash += Math.floor(this.score / 20);
        game.player.completeQuest('dance_battle');
        game.popState();
      }
      return;
    }

    this.songTime += delta;

    if (this.feedbackTimer > 0) {
      this.feedbackTimer -= delta;
      if (this.feedbackTimer <= 0) {
        this.feedbackText = '';
      }
    }

    // Check misses
    for (const b of this.beats) {
      if (!b.hit && !b.missed && this.songTime > b.time + 0.35) {
        b.missed = true;
        this.combo = 0;
        this.feedbackText = 'MISS! ❌';
        this.feedbackTimer = 0.5;
        game.audio.playSfx(29);
      }
    }

    // Check player key hits
    const dirs: DanceBeat['dir'][] = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'];
    for (const dir of dirs) {
      if (game.input.isJustPressed(dir)) {
        this.handleHit(dir, game);
      }
    }

    if (game.input.isJustPressed('Escape') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(17);
      game.popState();
    }

    // End after all beats
    const allDone = this.beats.every((b) => b.hit || b.missed);
    if (allDone && this.songTime > 32) {
      this.gameOver = true;
      game.audio.playSfx(18);
    }
  }

  private handleHit(dir: DanceBeat['dir'], game: Game): void {
    const candidates = this.beats.filter((b) => !b.hit && !b.missed && b.dir === dir);
    if (candidates.length === 0) return;

    let closest = candidates[0];
    let minDiff = Math.abs(closest.time - this.songTime);
    for (const c of candidates) {
      const diff = Math.abs(c.time - this.songTime);
      if (diff < minDiff) {
        closest = c;
        minDiff = diff;
      }
    }

    if (minDiff < 0.16) {
      closest.hit = true;
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.score += 100 * Math.min(this.combo, 4);
      this.feedbackText = 'PERFECT! 🔥';
      this.feedbackTimer = 0.6;
      game.audio.playSfx(28);
    } else if (minDiff < 0.32) {
      closest.hit = true;
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.score += 50;
      this.feedbackText = 'GREAT! ⭐';
      this.feedbackTimer = 0.5;
      game.audio.playSfx(14);
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    // Stage Backdrop (Pack 9_11 club background)
    game.sprites.drawEnvironment(ctx, 'east_legon_club', this.animTimer);

    // Dark overlay for rhythm tracks
    ctx.fillStyle = 'rgba(8, 11, 18, 0.78)';
    ctx.fillRect(0, 0, 320, 240);

    // Title Header
    ctx.fillStyle = '#171c2b';
    ctx.fillRect(10, 8, 300, 22);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 8, 300, 22);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('AZONTO DANCE BATTLE', 20, 23);

    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${this.score}  🔥 x${this.combo}`, 300, 23);

    // Center Stage: Animated Dancing Player Sprite!
    game.sprites.drawCharacter(
      ctx,
      game.player.appearance.gender,
      game.player.appearance.styleOutfit,
      'dance',
      'down',
      this.animTimer,
      150,
      70
    );

    // 4 Directional Rhythm Lanes
    const lanes: { dir: DanceBeat['dir']; x: number; symbol: string }[] = [
      { dir: 'ArrowLeft', x: 45, symbol: '◀' },
      { dir: 'ArrowUp', x: 115, symbol: '▲' },
      { dir: 'ArrowDown', x: 185, symbol: '▼' },
      { dir: 'ArrowRight', x: 255, symbol: '▶' }
    ];

    // Target Hit Zone Line
    ctx.fillStyle = '#22293d';
    ctx.fillRect(20, this.hitY - 14, 280, 28);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, this.hitY - 14, 280, 28);

    for (const lane of lanes) {
      // Lane guideline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(lane.x - 12, 35, 24, 150);

      // Target socket
      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lane.symbol, lane.x, this.hitY + 5);
    }

    // Render falling beat arrows
    for (const b of this.beats) {
      if (b.hit || b.missed) continue;
      const timeDiff = b.time - this.songTime;
      if (timeDiff > 2.0 || timeDiff < -0.3) continue;

      const y = this.hitY - timeDiff * 100;
      if (y < 35 || y > 210) continue;

      const lane = lanes.find((l) => l.dir === b.dir);
      if (!lane) continue;

      ctx.fillStyle = '#57db80';
      ctx.beginPath();
      ctx.arc(lane.x, y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#11131a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lane.symbol, lane.x, y + 4);
    }

    // Feedback Toast (PERFECT / GREAT / MISS)
    if (this.feedbackText) {
      ctx.fillStyle = this.feedbackText.includes('MISS') ? '#ff4d4d' : '#f5b82e';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.feedbackText, 160, 130);
    }

    // Game Over Victory Dialog
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 18, 28, 0.94)';
      ctx.fillRect(40, 50, 240, 130);
      ctx.strokeStyle = '#f5b82e';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 50, 240, 130);

      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ BATTLE FINISHED! ★', 160, 78);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`Final Score: ${this.score}`, 160, 102);
      ctx.fillText(`Max Combo: ${this.maxCombo}x`, 160, 120);
      ctx.fillStyle = '#57db80';
      ctx.fillText(`Reward: +GH₵ ${Math.floor(this.score / 20)}`, 160, 142);

      ctx.fillStyle = '#9ea7bd';
      ctx.font = '8px monospace';
      ctx.fillText('[ Press Space / OK to continue ]', 160, 165);
    }

    // Softkeys
    ctx.fillStyle = '#10131d';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Dance', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Exit', 312, 236);
  }
}
