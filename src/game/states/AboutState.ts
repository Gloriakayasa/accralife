import { Game } from '../Game';
import { GameState } from '../GameState';

export class AboutState implements GameState {
  private scrollY: number = 0;
  private readonly maxScroll: number = 190;

  enter(game: Game): void {
    game.input.setSoftkeyLabels('OK', 'Back');
    this.scrollY = 0;
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    if (game.input.isDown('ArrowUp')) {
      this.scrollY = Math.max(0, this.scrollY - 80 * delta);
    } else if (game.input.isDown('ArrowDown')) {
      this.scrollY = Math.min(this.maxScroll, this.scrollY + 80 * delta);
    }

    if (
      game.input.isJustPressed('Enter') ||
      game.input.isJustPressed('Space') ||
      game.input.isJustPressed('Escape') ||
      game.input.isJustPressed('SoftLeft') ||
      game.input.isJustPressed('SoftRight')
    ) {
      game.audio.playSfx(17);
      game.popState();
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, 320, 240);

    const wx = 20;
    const wy = 15;
    const ww = 280;
    const wh = 205;

    ctx.fillStyle = '#141824';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = '#3d465f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(wx, wy, ww, wh);

    // Title Bar
    ctx.fillStyle = '#1c2233';
    ctx.fillRect(wx + 2, wy + 2, ww - 4, 24);
    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ABOUT ACCRA LIFE 🇬🇭', 160, wy + 17);

    // Scrollable area
    ctx.save();
    ctx.beginPath();
    ctx.rect(wx + 4, wy + 28, ww - 8, wh - 34);
    ctx.clip();

    let curY = wy + 42 - this.scrollY;

    const drawHeader = (text: string) => {
      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, 160, curY);
      curY += 15;
    };

    const drawLine = (text: string, color: string = '#d2d8e8', isCenter: boolean = true) => {
      ctx.fillStyle = color;
      ctx.font = '9px monospace';
      ctx.textAlign = isCenter ? 'center' : 'left';
      ctx.fillText(text, isCenter ? 160 : wx + 14, curY);
      curY += 13;
    };

    drawHeader('ACCRA LIFE');
    drawLine('★ Nokia E71/E72 Landscape Retro Port ★', '#8ea2c6');
    drawLine('Authentic Gameloft Pixel Engine', '#8ea2c6');
    curY += 8;

    drawHeader('THE ACCRA EXPERIENCE');
    drawLine('• Oxford Street, Osu Nightlife & Vibes');
    drawLine('• Jamestown Lighthouse & Fishing Dock');
    drawLine('• Labadi Beach & Seaside Azonto Battles');
    drawLine('• East Legon VIP Champagne Lounges');
    drawLine('• Auntie Muni’s Chop Bar & Jollof Rush');
    drawLine('• Makola Market Kente Drip & Hustle');
    curY += 8;

    drawHeader('AUTHENTIC GRAPHICS & AUDIO');
    drawLine('• Real Gameloft ASprite sheets (Pack 9-15)');
    drawLine('• Full Character Walk Cycles & Stances');
    drawLine('• Authentic Sound Effects & Afrobeats Synths');
    drawLine('• ChalePhone PDA with MoMo Wallet');
    curY += 8;

    drawHeader('CONTROLS');
    drawLine('Move: Arrow Keys / WASD / Virtual D-Pad');
    drawLine('Action / Select: Space / Enter / [A]');
    drawLine('Back / Menu: Escape / Backspace / [B]');
    drawLine('ChalePhone: P Key / 📱 Phone Button');
    curY += 8;

    drawLine('★ Akwaaba! Enjoy Accra Life! ★', '#f5b82e');

    ctx.restore();

    // Scrollbar
    const scrollbarH = wh - 36;
    const thumbH = 24;
    const thumbY = wy + 28 + (this.scrollY / this.maxScroll) * (scrollbarH - thumbH);
    ctx.fillStyle = '#222839';
    ctx.fillRect(wx + ww - 6, wy + 28, 4, scrollbarH);
    ctx.fillStyle = '#f5b82e';
    ctx.fillRect(wx + ww - 6, thumbY, 4, thumbH);

    // Softkey bar
    ctx.fillStyle = '#10141e';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f97ae';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('OK', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Back', 312, 236);
  }
}
