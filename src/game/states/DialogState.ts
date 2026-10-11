import { Game } from '../Game';
import { GameState } from '../GameState';
import { NPC, DialogueOption } from '../Types';

export class DialogState implements GameState {
  private npc: NPC;
  private selectedIndex: number = 0;
  private isShowingResponse: boolean = false;
  private currentResponse: string = '';
  private heartAnim: number = 0;

  constructor(npc: NPC) {
    this.npc = npc;
  }

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Reply', 'Close');
    this.selectedIndex = 0;
    this.isShowingResponse = false;
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    this.heartAnim += delta * 4;

    if (this.isShowingResponse) {
      if (
        game.input.isJustPressed('Enter') ||
        game.input.isJustPressed('Space') ||
        game.input.isJustPressed('Escape') ||
        game.input.isJustPressed('SoftLeft') ||
        game.input.isJustPressed('SoftRight')
      ) {
        game.audio.playSfx(14);
        game.popState();
      }
      return;
    }

    const optsCount = this.npc.dialogue.options.length;
    if (game.input.isJustPressed('ArrowUp')) {
      this.selectedIndex = (this.selectedIndex - 1 + optsCount) % optsCount;
      game.audio.playSfx(14);
    } else if (game.input.isJustPressed('ArrowDown')) {
      this.selectedIndex = (this.selectedIndex + 1) % optsCount;
      game.audio.playSfx(14);
    }

    if (game.input.isJustPressed('Enter') || game.input.isJustPressed('SoftLeft') || game.input.isJustPressed('Space')) {
      this.selectOption(game);
    } else if (game.input.isJustPressed('Escape') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(17);
      game.popState();
    }
  }

  private selectOption(game: Game): void {
    const opt: DialogueOption = this.npc.dialogue.options[this.selectedIndex];
    if (!opt) return;

    if (opt.costCash && game.player.cash < opt.costCash) {
      game.audio.playSfx(29);
      this.currentResponse = "Chale, you don't have enough Cedis for this!";
      this.isShowingResponse = true;
      game.input.setSoftkeyLabels('OK', 'OK');
      return;
    }

    if (opt.costCash) {
      game.player.cash -= opt.costCash;
      game.audio.playSfx(18);
    }
    if (opt.givesCash) {
      game.player.cash += opt.givesCash;
      game.audio.playSfx(18);
    }

    // Relationship update
    const rel = game.player.relationships[this.npc.id];
    if (rel) {
      rel.friendship = Math.max(-100, Math.min(100, rel.friendship + opt.relationshipDelta));
      if (rel.friendship > 60) rel.status = 'Best Chale';
      else if (rel.friendship > 30) rel.status = 'Friend';
      else if (rel.friendship > 0) rel.status = 'Chale';
    }

    if (opt.givesQuest) {
      game.player.completeQuest(opt.givesQuest);
    }
    if (opt.completesQuest) {
      game.player.completeQuest(opt.completesQuest);
    }

    if (opt.relationshipDelta > 0) {
      game.audio.playSfx(28);
    } else {
      game.audio.playSfx(15);
    }

    this.currentResponse = opt.response;
    this.isShowingResponse = true;
    game.input.setSoftkeyLabels('Continue', 'Close');
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    // Dim background overlay
    ctx.fillStyle = 'rgba(6, 8, 14, 0.72)';
    ctx.fillRect(0, 0, 320, 240);

    // Modal Box Container
    const bx = 16;
    const by = 30;
    const bw = 288;
    const bh = 185;

    ctx.fillStyle = '#141724';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#39435b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, bw, bh);

    // Top Header with NPC Name & Title
    ctx.fillStyle = '#1d2233';
    ctx.fillRect(bx + 2, by + 2, bw - 4, 24);
    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.npc.name.toUpperCase()}  [${this.npc.title}]`, bx + 10, by + 17);

    // Relationship status badge on right
    const rel = game.player.relationships[this.npc.id];
    ctx.textAlign = 'right';
    ctx.fillStyle = '#57db80';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`♥ ${rel ? rel.status : 'Chale'} (${rel ? rel.friendship : 0})`, bx + bw - 10, by + 17);

    // Left Column: Authentic Character Portrait (Pack 13)
    const portX = bx + 10;
    const portY = by + 34;
    ctx.fillStyle = '#1c2234';
    ctx.fillRect(portX, portY, 52, 60);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1;
    ctx.strokeRect(portX, portY, 52, 60);

    // Draw authentic portrait sprite!
    game.sprites.drawPortrait(ctx, this.npc.portraitIdx, portX + 8, portY + 6);

    // Speech / Greeting Box
    const speechX = bx + 68;
    const speechY = by + 34;
    const speechW = bw - 78;

    ctx.fillStyle = '#202638';
    ctx.fillRect(speechX, speechY, speechW, 60);
    ctx.strokeStyle = '#434e6b';
    ctx.lineWidth = 1;
    ctx.strokeRect(speechX, speechY, speechW, 60);

    ctx.fillStyle = '#f0f3fa';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    const textToShow = this.isShowingResponse ? this.currentResponse : this.npc.dialogue.greeting;
    this.wrapText(ctx, textToShow, speechX + 8, speechY + 16, speechW - 16, 13);

    // Options Area
    const optsY = by + 102;
    if (!this.isShowingResponse) {
      for (let i = 0; i < this.npc.dialogue.options.length; i++) {
        const opt = this.npc.dialogue.options[i];
        const isSel = i === this.selectedIndex;
        const oy = optsY + i * 24;

        if (isSel) {
          ctx.fillStyle = '#2b344c';
          ctx.fillRect(bx + 8, oy - 2, bw - 16, 20);
          ctx.strokeStyle = '#f5b82e';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx + 8, oy - 2, bw - 16, 20);
        }

        ctx.font = isSel ? 'bold 9px monospace' : '9px monospace';
        ctx.fillStyle = isSel ? '#f5b82e' : '#c8cfdf';
        ctx.textAlign = 'left';
        ctx.fillText(`${isSel ? '▶ ' : '  '}${opt.text}`, bx + 14, oy + 12);
      }
    } else {
      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ Press Space / OK to continue ]', 160, optsY + 30);
    }

    // Softkey bar
    ctx.fillStyle = '#10131d';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(this.isShowingResponse ? 'Continue' : 'Reply', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Close', 312, 236);
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }
}
