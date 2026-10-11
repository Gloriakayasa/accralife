import { Game } from '../Game';
import { GameState } from '../GameState';

interface Order {
  name: string;
  recipe: number[];
  timeLeft: number;
  maxTime: number;
  rewardCash: number;
}

export class MiniGameState implements GameState {
  private mode: string;
  private currentOrder: Order | null = null;
  private currentRecipeStep: number = 0;
  private ordersCompleted: number = 0;
  private totalEarned: number = 0;
  private shiftTimer: number = 40; // 40 seconds shift
  private gameOver: boolean = false;
  private animTimer: number = 0;

  constructor(mode: string = 'chop_bar_shift') {
    this.mode = mode;
  }

  enter(game: Game): void {
    game.input.setSoftkeyLabels('Prepare', 'Leave');
    game.audio.playBgm(2);
    this.ordersCompleted = 0;
    this.totalEarned = 0;
    this.shiftTimer = 40;
    this.gameOver = false;
    this.spawnOrder();
  }

  exit(game: Game): void {}

  private spawnOrder(): void {
    const isChopBar = this.mode === 'chop_bar_shift';
    const menu = isChopBar
      ? [
          { name: 'Hot Ghana Jollof', recipe: [1, 3, 4], maxTime: 7.5, rewardCash: 25 },
          { name: 'Waakye & Shito Plate', recipe: [2, 1, 4], maxTime: 8.0, rewardCash: 30 },
          { name: 'Spicy Fried Kelewele', recipe: [3, 4], maxTime: 5.5, rewardCash: 18 },
          { name: 'Cold Sobolo Jug', recipe: [5, 3], maxTime: 5.0, rewardCash: 15 }
        ]
      : [
          { name: 'Accra Sunrise Cocktail', recipe: [1, 3, 5], maxTime: 7.0, rewardCash: 35 },
          { name: 'Palm Wine Punch', recipe: [2, 1, 4], maxTime: 7.5, rewardCash: 40 },
          { name: 'VIP Champagne Spark', recipe: [4, 5], maxTime: 6.0, rewardCash: 50 },
          { name: 'Lime Shaker Cooler', recipe: [1, 5], maxTime: 5.0, rewardCash: 20 }
        ];

    const pick = menu[Math.floor(Math.random() * menu.length)];
    this.currentOrder = {
      name: pick.name,
      recipe: pick.recipe,
      timeLeft: pick.maxTime,
      maxTime: pick.maxTime,
      rewardCash: pick.rewardCash
    };
    this.currentRecipeStep = 0;
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
        game.player.cash += this.totalEarned;
        game.player.modifyStat('energy', -20);
        game.player.modifyStat('hunger', 10);
        game.popState();
      }
      return;
    }

    this.shiftTimer -= delta;
    if (this.shiftTimer <= 0) {
      this.gameOver = true;
      game.audio.playSfx(18);
      return;
    }

    if (this.currentOrder) {
      this.currentOrder.timeLeft -= delta;
      if (this.currentOrder.timeLeft <= 0) {
        game.audio.playSfx(29);
        this.spawnOrder();
      }
    }

    // Recipe Input Mapping (Keys 1 to 5, Arrow Keys, Enter)
    const inputs: [string, number][] = [
      ['Digit1', 1],
      ['Digit2', 2],
      ['Digit3', 3],
      ['Digit4', 4],
      ['Digit5', 5],
      ['ArrowLeft', 1],
      ['ArrowUp', 2],
      ['ArrowDown', 3],
      ['ArrowRight', 4],
      ['Space', 5],
      ['Enter', 5]
    ];

    for (const [key, num] of inputs) {
      if (game.input.isJustPressed(key)) {
        this.processIngredient(num, game);
        break;
      }
    }

    if (game.input.isJustPressed('Escape') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(17);
      game.popState();
    }
  }

  private processIngredient(ingId: number, game: Game): void {
    if (!this.currentOrder) return;

    const expected = this.currentOrder.recipe[this.currentRecipeStep];
    if (ingId === expected) {
      this.currentRecipeStep += 1;
      game.audio.playSfx(14);

      if (this.currentRecipeStep >= this.currentOrder.recipe.length) {
        // Order Completed!
        this.ordersCompleted += 1;
        this.totalEarned += this.currentOrder.rewardCash;
        game.audio.playSfx(13);
        this.spawnOrder();
      }
    } else {
      // Mistake
      game.audio.playSfx(29);
      this.currentRecipeStep = 0;
    }
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    const isChopBar = this.mode === 'chop_bar_shift';

    // Background
    game.sprites.drawEnvironment(ctx, isChopBar ? 'chop_bar' : 'east_legon_club', this.animTimer);

    // Dim overlay
    ctx.fillStyle = 'rgba(10, 13, 20, 0.75)';
    ctx.fillRect(0, 0, 320, 240);

    // Header Bar
    ctx.fillStyle = '#171c2b';
    ctx.fillRect(10, 8, 300, 24);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 8, 300, 24);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(isChopBar ? "AUNTIE MUNI'S CHOP BAR SHIFT" : 'VIP CLUB COCKTAIL SHIFT', 18, 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#57db80';
    ctx.fillText(`EARNED: GH₵${this.totalEarned}  ⏱ ${Math.ceil(this.shiftTimer)}s`, 300, 24);

    // Current Customer Order Ticket
    const ticketX = 35;
    const ticketY = 42;
    const ticketW = 250;
    const ticketH = 80;

    ctx.fillStyle = '#1e2436';
    ctx.fillRect(ticketX, ticketY, ticketW, ticketH);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(ticketX, ticketY, ticketW, ticketH);

    if (this.currentOrder) {
      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ORDER: ${this.currentOrder.name.toUpperCase()}`, 160, ticketY + 22);

      // Recipe steps bubbles
      const ingredients = isChopBar
        ? ['Jollof Rice', 'Waakye', 'Plantain', 'Shito Pepper', 'Sobolo']
        : ['Ice Shaker', 'Palm Wine', 'Syrup', 'Champagne', 'Fresh Lime'];

      const steps = this.currentOrder.recipe;
      const stepW = 42;
      const startX = 160 - (steps.length * stepW) / 2;

      for (let s = 0; s < steps.length; s++) {
        const ingIdx = steps[s] - 1;
        const done = s < this.currentRecipeStep;
        const isCur = s === this.currentRecipeStep;
        const sx = startX + s * stepW;

        ctx.fillStyle = done ? '#1e7e48' : isCur ? '#f5b82e' : '#2d354a';
        ctx.fillRect(sx, ticketY + 34, 38, 22);
        ctx.strokeStyle = done ? '#57db80' : isCur ? '#ffffff' : '#455170';
        ctx.strokeRect(sx, ticketY + 34, 38, 22);

        ctx.fillStyle = isCur ? '#111' : '#fff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`[${steps[s]}]`, sx + 19, ticketY + 45);
        ctx.fillText(ingredients[ingIdx].slice(0, 5), sx + 19, ticketY + 54);
      }

      // Customer Patience Bar
      const pct = Math.max(0, this.currentOrder.timeLeft / this.currentOrder.maxTime);
      ctx.fillStyle = '#222839';
      ctx.fillRect(ticketX + 15, ticketY + 64, ticketW - 30, 6);
      ctx.fillStyle = pct > 0.5 ? '#57db80' : pct > 0.25 ? '#ffd242' : '#ff4d4d';
      ctx.fillRect(ticketX + 15, ticketY + 64, (ticketW - 30) * pct, 6);
    }

    // Ingredient Stations Keypad Guide
    const padY = 132;
    const ingNames = isChopBar
      ? ['[1] 🍚 Rice Pot', '[2] 🍲 Waakye', '[3] 🍌 Plantain', '[4] 🌶 Shito', '[5] 🍷 Sobolo']
      : ['[1] 🧊 Ice', '[2] 🍶 Palm Wine', '[3] 🍯 Syrup', '[4] 🍾 Champagne', '[5] 🍋 Lime'];

    for (let k = 0; k < 5; k++) {
      const kx = 18 + k * 58;
      ctx.fillStyle = '#1c2234';
      ctx.fillRect(kx, padY, 52, 42);
      ctx.strokeStyle = '#39435d';
      ctx.strokeRect(kx, padY, 52, 42);

      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ingNames[k].split(' ')[0], kx + 26, padY + 16);

      ctx.fillStyle = '#d2d8ea';
      ctx.font = '7px monospace';
      ctx.fillText(ingNames[k].split(' ')[1] || '', kx + 26, padY + 32);
    }

    // Help instructions
    ctx.fillStyle = '#9ea7bd';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Press 1, 2, 3, 4, 5 (or D-Pad) to add ingredients in order!', 160, 190);

    // Game Over Results Modal
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 18, 28, 0.95)';
      ctx.fillRect(45, 55, 230, 120);
      ctx.strokeStyle = '#f5b82e';
      ctx.lineWidth = 2;
      ctx.strokeRect(45, 55, 230, 120);

      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ SHIFT COMPLETED! ★', 160, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`Orders Served: ${this.ordersCompleted}`, 160, 104);

      ctx.fillStyle = '#57db80';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Total Earned: +GH₵ ${this.totalEarned}`, 160, 128);

      ctx.fillStyle = '#9ea7bd';
      ctx.font = '8px monospace';
      ctx.fillText('[ Press Space / OK to continue ]', 160, 155);
    }

    // Softkey bar
    ctx.fillStyle = '#10131d';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Prepare', 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText('Leave', 312, 236);
  }
}
