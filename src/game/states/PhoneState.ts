import { Game } from '../Game';
import { GameState } from '../GameState';
import { ACCRA_NPCS } from '../NPCData';

export class PhoneState implements GameState {
  private activeTab: number = 0; // 0: Contacts, 1: Quests, 2: Status, 3: MoMo Wallet
  private selectedIndex: number = 0;
  private readonly tabs = ['Chales', 'Quests', 'Status', 'MoMo'];

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Select', 'Close');
    game.audio.playSfx(25); // Phone chime
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    if (game.input.isJustPressed('ArrowLeft')) {
      this.activeTab = (this.activeTab - 1 + this.tabs.length) % this.tabs.length;
      this.selectedIndex = 0;
      game.audio.playSfx(14);
    } else if (game.input.isJustPressed('ArrowRight')) {
      this.activeTab = (this.activeTab + 1) % this.tabs.length;
      this.selectedIndex = 0;
      game.audio.playSfx(14);
    }

    if (game.input.isJustPressed('ArrowUp')) {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      game.audio.playSfx(14);
    } else if (game.input.isJustPressed('ArrowDown')) {
      this.selectedIndex += 1;
      game.audio.playSfx(14);
    }

    if (game.input.isJustPressed('Escape') || game.input.isJustPressed('Phone') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(17);
      game.popState();
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    // Dim background overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, 320, 240);

    // Phone Container Body
    const px = 25;
    const py = 15;
    const pw = 270;
    const ph = 210;

    ctx.fillStyle = '#141824';
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = '#38435d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pw, ph);

    // Top Phone Status Header
    ctx.fillStyle = '#1c2234';
    ctx.fillRect(px + 4, py + 4, pw - 8, 22);

    ctx.fillStyle = '#57db80';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('📶 MTN Ghana 4G', px + 10, py + 18);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CHALE-PHONE', px + pw / 2, py + 18);

    const h = String(game.player.hour).padStart(2, '0');
    const m = String(game.player.minute).padStart(2, '0');
    ctx.fillStyle = '#c5ceea';
    ctx.textAlign = 'right';
    ctx.fillText(`${h}:${m} 🔋`, px + pw - 10, py + 18);

    // Tab Navigation Bar
    const tabY = py + 28;
    const tabW = (pw - 8) / this.tabs.length;

    for (let i = 0; i < this.tabs.length; i++) {
      const isSel = i === this.activeTab;
      const tx = px + 4 + i * tabW;

      ctx.fillStyle = isSel ? '#f5b82e' : '#1f2537';
      ctx.fillRect(tx, tabY, tabW - 2, 20);

      ctx.font = isSel ? 'bold 9px monospace' : '9px monospace';
      ctx.fillStyle = isSel ? '#11141e' : '#9ba5be';
      ctx.textAlign = 'center';
      ctx.fillText(this.tabs[i], tx + tabW / 2, tabY + 14);
    }

    // Content Display Box
    const contentY = tabY + 24;
    const contentH = ph - 58;

    ctx.fillStyle = '#0f131f';
    ctx.fillRect(px + 4, contentY, pw - 8, contentH);
    ctx.strokeStyle = '#2d354a';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 4, contentY, pw - 8, contentH);

    // Tab Renderers
    if (this.activeTab === 0) {
      this.renderContacts(game, ctx, px + 8, contentY + 6, pw - 16);
    } else if (this.activeTab === 1) {
      this.renderQuests(game, ctx, px + 8, contentY + 6, pw - 16);
    } else if (this.activeTab === 2) {
      this.renderStatus(game, ctx, px + 8, contentY + 6, pw - 16);
    } else if (this.activeTab === 3) {
      this.renderMoMo(game, ctx, px + 8, contentY + 6, pw - 16);
    }

    // Softkey bar
    ctx.fillStyle = '#10131d';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Select', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Close', 312, 236);
  }

  private renderContacts(game: Game, ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
    const npcs = Object.values(ACCRA_NPCS);
    const visibleCount = 5;
    const startIdx = Math.min(Math.max(0, this.selectedIndex - visibleCount + 1), Math.max(0, npcs.length - visibleCount));

    for (let i = 0; i < visibleCount && startIdx + i < npcs.length; i++) {
      const idx = startIdx + i;
      const npc = npcs[idx];
      const rel = game.player.relationships[npc.id];
      const isSel = idx === this.selectedIndex;
      const cy = y + i * 26;

      if (isSel) {
        ctx.fillStyle = '#222a3d';
        ctx.fillRect(x, cy, w, 24);
        ctx.strokeStyle = '#f5b82e';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, cy, w, 24);
      }

      ctx.fillStyle = isSel ? '#f5b82e' : '#e0e5f4';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${isSel ? '▶ ' : '  '}${npc.name} (${npc.title})`, x + 6, cy + 15);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#57db80';
      ctx.fillText(`♥ ${rel ? rel.status : 'Chale'}`, x + w - 8, cy + 15);
    }
  }

  private renderQuests(game: Game, ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
    const quests = Object.values(game.player.quests);
    for (let i = 0; i < Math.min(4, quests.length); i++) {
      const q = quests[i];
      const qy = y + i * 32;

      ctx.fillStyle = q.completed ? '#192b1e' : '#1b202e';
      ctx.fillRect(x, qy, w, 28);
      ctx.strokeStyle = q.completed ? '#3ba762' : '#333b50';
      ctx.strokeRect(x, qy, w, 28);

      ctx.fillStyle = q.completed ? '#57db80' : '#f5b82e';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${q.completed ? '✔ ' : '○ '}${q.title}`, x + 6, qy + 11);

      ctx.fillStyle = '#9ea7bd';
      ctx.font = '8px monospace';
      ctx.fillText(q.description.slice(0, 36), x + 6, qy + 22);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#57db80';
      ctx.fillText(`+GH₵${q.rewardCash}`, x + w - 6, qy + 11);
    }
  }

  private renderStatus(game: Game, ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${game.player.appearance.name.toUpperCase()} - ${game.player.career.title}`, x + 6, y + 14);

    const stats: [string, number][] = [
      ['Energy', game.player.stats.energy],
      ['Hunger', game.player.stats.hunger],
      ['Hygiene', game.player.stats.hygiene],
      ['Fun', game.player.stats.fun],
      ['Social', game.player.stats.social],
      ['Style Drip', game.player.stats.style]
    ];

    for (let i = 0; i < stats.length; i++) {
      const [name, val] = stats[i];
      const sy = y + 26 + i * 16;

      ctx.fillStyle = '#c5ceea';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(name, x + 6, sy + 8);

      // Bar
      const barX = x + 85;
      const barW = w - 95;
      ctx.fillStyle = '#202638';
      ctx.fillRect(barX, sy, barW, 9);

      ctx.fillStyle = val > 60 ? '#57db80' : val > 30 ? '#ffd242' : '#ff4d4d';
      ctx.fillRect(barX, sy, (val / 100) * barW, 9);

      ctx.fillStyle = '#111';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(val)}%`, barX + barW - 4, sy + 7);
    }
  }

  private renderMoMo(game: Game, ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
    // MTN MoMo Wallet Look
    ctx.fillStyle = '#ffc800'; // Yellow MoMo branding
    ctx.fillRect(x + 10, y + 10, w - 20, 46);

    ctx.fillStyle = '#002f6c';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('MTN MoMo WALLET', x + 20, y + 28);

    ctx.font = 'bold 14px monospace';
    ctx.fillText(`GH₵ ${game.player.cash}.00`, x + 20, y + 46);

    // Features
    ctx.fillStyle = '#e0e5f4';
    ctx.font = '9px monospace';
    ctx.fillText('✔ Instant Cashout at Any Agent', x + 15, y + 75);
    ctx.fillText('✔ Send Cedis to Friends in Accra', x + 15, y + 95);
    ctx.fillText('✔ Daily Salary Deposit Enabled', x + 15, y + 115);
  }
}
