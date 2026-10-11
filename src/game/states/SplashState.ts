import { Game } from '../Game';
import { GameState } from '../GameState';
import { MenuState } from './MenuState';

export class SplashState implements GameState {
  private timer: number = 0;
  private alpha: number = 0;

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Skip', 'Skip');
    game.audio.playSfx(13);
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    this.timer += delta;

    if (this.timer < 1.0) {
      this.alpha = Math.min(1.0, this.timer / 1.0);
    } else if (this.timer < 2.5) {
      this.alpha = 1.0;
    } else if (this.timer < 3.5) {
      this.alpha = Math.max(0.0, 1.0 - (this.timer - 2.5) / 1.0);
    } else {
      game.changeState(new MenuState());
      return;
    }

    if (game.input.isJustPressed('Enter') || game.input.isJustPressed('Space') || game.input.isJustPressed('SoftLeft') || game.input.isJustPressed('SoftRight')) {
      game.changeState(new MenuState());
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, 320, 240);

    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Ghanaian national colors bar accent
    ctx.fillStyle = '#cf2a2a';
    ctx.fillRect(60, 55, 66, 3);
    ctx.fillStyle = '#f5b82e';
    ctx.fillRect(126, 55, 68, 3);
    ctx.fillStyle = '#1e7e48';
    ctx.fillRect(194, 55, 66, 3);

    // Gameloft style banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAMELOFT RETRO ARCHIVE', 160, 95);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('PRESENTS', 160, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px monospace';
    ctx.fillText('★ ACCRA LIFE ★', 160, 150);

    ctx.fillStyle = '#8e9bb5';
    ctx.font = '10px monospace';
    ctx.fillText('Nokia E71 / E72 Edition', 160, 178);

    ctx.restore();
  }
}
