import { Game } from '../Game';
import { GameState } from '../GameState';
import { ACCRA_LOCATIONS } from '../WorldData';
import { ACCRA_NPCS } from '../NPCData';
import { WorldLocation, NPC, InteractableObject } from '../Types';
import { DialogState } from './DialogState';
import { PhoneState } from './PhoneState';
import { PartyState } from './PartyState';
import { MiniGameState } from './MiniGameState';
import { SaveManager } from '../../engine/SaveManager';

export class WorldState implements GameState {
  private currentLocation: WorldLocation;
  private animTimer: number = 0;
  private activeInteractable: InteractableObject | null = null;
  private activeNpc: NPC | null = null;
  private notification: { text: string; time: number } | null = null;
  private saveTimer: number = 0;

  constructor(locationId?: string) {
    const locId = locationId || 'osu_apartment';
    this.currentLocation = ACCRA_LOCATIONS[locId] || ACCRA_LOCATIONS['osu_apartment'];
  }

  enter(game: Game): void {
    game.player.currentLocationId = this.currentLocation.id;
    game.input.setSoftkeyLabels('Interact', 'ChalePhone');
    game.audio.playBgm(this.currentLocation.themeMusic);
  }

  exit(game: Game): void {}

  update(game: Game, delta: number): void {
    this.animTimer += delta;
    game.player.updateTime(delta);

    // Auto-save every 15 seconds
    this.saveTimer += delta;
    if (this.saveTimer > 15) {
      this.saveTimer = 0;
      this.saveGame(game);
    }

    if (this.notification) {
      this.notification.time -= delta;
      if (this.notification.time <= 0) {
        this.notification = null;
      }
    }

    // 1. Player Directional Movement
    let moveX = 0;
    let moveY = 0;

    if (game.input.isDown('ArrowUp')) moveY -= 1;
    if (game.input.isDown('ArrowDown')) moveY += 1;
    if (game.input.isDown('ArrowLeft')) moveX -= 1;
    if (game.input.isDown('ArrowRight')) moveX += 1;

    if (moveX !== 0 || moveY !== 0) {
      const speed = 75 * delta;
      game.player.x += moveX * speed;
      game.player.y += moveY * speed;

      // Update player facing direction & action
      if (moveY > 0) game.player.dir = 'down';
      else if (moveY < 0) game.player.dir = 'up';
      else if (moveX < 0) game.player.dir = 'left';
      else if (moveX > 0) game.player.dir = 'right';

      game.player.action = 'walk';

      // Keep within room bounds
      game.player.x = Math.max(15, Math.min(305, game.player.x));
      game.player.y = Math.max(65, Math.min(205, game.player.y));
    } else {
      game.player.action = 'idle';
    }

    // 2. Mouse / Touch click to walk
    if (game.input.mouseClicked) {
      game.player.targetX = game.input.mouseX;
      game.player.targetY = Math.max(65, Math.min(205, game.input.mouseY));
    }

    if (Math.abs(game.player.targetX - game.player.x) > 4 || Math.abs(game.player.targetY - game.player.y) > 4) {
      const dx = game.player.targetX - game.player.x;
      const dy = game.player.targetY - game.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 4) {
        const step = Math.min(dist, 75 * delta);
        game.player.x += (dx / dist) * step;
        game.player.y += (dy / dist) * step;

        if (Math.abs(dx) > Math.abs(dy)) {
          game.player.dir = dx > 0 ? 'right' : 'left';
        } else {
          game.player.dir = dy > 0 ? 'down' : 'up';
        }
        game.player.action = 'walk';
      }
    }

    // 3. Detect nearby NPCs & Interactables
    this.activeInteractable = null;
    this.activeNpc = null;

    // Check NPCs
    for (const npcId of this.currentLocation.npcs) {
      const npc = ACCRA_NPCS[npcId];
      if (!npc) continue;
      const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
      if (dist < 32) {
        this.activeNpc = npc;
        break;
      }
    }

    // Check Interactables
    if (!this.activeNpc) {
      for (const item of this.currentLocation.interactables) {
        const cx = item.x + item.w / 2;
        const cy = item.y + item.h / 2;
        const dist = Math.sqrt((game.player.x - cx) ** 2 + (game.player.y - cy) ** 2);
        if (dist < 40) {
          this.activeInteractable = item;
          break;
        }
      }
    }

    // Check Exits
    if (!this.activeNpc && !this.activeInteractable) {
      for (const exit of this.currentLocation.exits) {
        const cx = exit.x + exit.w / 2;
        const cy = exit.y + exit.h / 2;
        const dist = Math.sqrt((game.player.x - cx) ** 2 + (game.player.y - cy) ** 2);
        if (dist < 35) {
          this.activeInteractable = {
            id: 'exit',
            name: exit.name,
            x: exit.x,
            y: exit.y,
            w: exit.w,
            h: exit.h,
            action: 'travel',
            isExit: true,
            targetLocation: exit.targetLocation,
            targetX: exit.targetX,
            targetY: exit.targetY
          };
          break;
        }
      }
    }

    // Dynamic softkey label updates
    if (this.activeNpc) {
      game.input.setSoftkeyLabels(`Talk: ${this.activeNpc.name}`, 'ChalePhone');
    } else if (this.activeInteractable) {
      game.input.setSoftkeyLabels(this.activeInteractable.isExit ? 'Go' : 'Use', 'ChalePhone');
    } else {
      game.input.setSoftkeyLabels('Actions', 'ChalePhone');
    }

    // 4. Interaction Triggers
    if (game.input.isJustPressed('Enter') || game.input.isJustPressed('Space') || game.input.isJustPressed('SoftLeft')) {
      if (this.activeNpc) {
        game.audio.playSfx(13);
        game.pushState(new DialogState(this.activeNpc));
      } else if (this.activeInteractable) {
        this.handleInteractable(game, this.activeInteractable);
      }
    }

    // 5. Phone Trigger
    if (game.input.isJustPressed('Phone') || game.input.isJustPressed('SoftRight')) {
      game.audio.playSfx(25);
      game.pushState(new PhoneState());
    }
  }

  private handleInteractable(game: Game, item: InteractableObject): void {
    game.audio.playSfx(15);

    if (item.isExit && item.targetLocation) {
      const newLoc = ACCRA_LOCATIONS[item.targetLocation];
      if (newLoc) {
        this.currentLocation = newLoc;
        game.player.currentLocationId = newLoc.id;
        game.player.x = item.targetX || 150;
        game.player.y = item.targetY || 140;
        game.player.targetX = game.player.x;
        game.player.targetY = game.player.y;
        game.audio.playBgm(newLoc.themeMusic);
        this.showNotification(`Arrived at ${newLoc.name}`);
        this.saveGame(game);
      }
      return;
    }

    switch (item.action) {
      case 'sleep':
        game.player.modifyStat('energy', 60);
        game.player.modifyStat('hunger', -15);
        game.player.hour = (game.player.hour + 6) % 24;
        this.showNotification('Slept soundly. Energy 100%!');
        break;

      case 'eat':
      case 'eat_jollof':
        game.player.modifyStat('hunger', 45);
        game.player.modifyStat('energy', 15);
        this.showNotification('Enjoyed hot Ghana Jollof! Hunger satisfied!');
        game.player.completeQuest('eat_local');
        break;

      case 'groom':
        game.player.modifyStat('style', 30);
        this.showNotification('Styled your hair and drip in the mirror. Looking fly!');
        break;

      case 'watch_tv':
        game.player.modifyStat('fun', 40);
        this.showNotification('Vibed to Afrobeats on TV. Fun +40!');
        break;

      case 'produce_music':
        game.player.modifyStat('fun', 30);
        game.player.modifyStat('style', 15);
        this.showNotification('Cooked up a fire beat in your studio!');
        game.player.completeQuest('produce_hit');
        break;

      case 'azonto_dance_game':
        game.pushState(new PartyState());
        break;

      case 'bartender_shift':
      case 'chop_bar_shift':
        game.pushState(new MiniGameState(item.action));
        break;

      case 'buy_kebab':
        if (game.player.cash >= 10) {
          game.player.cash -= 10;
          game.player.modifyStat('hunger', 25);
          this.showNotification('Bought spicy beef suya! Hunger +25 (GH₵ 10)');
        } else {
          this.showNotification('Not enough Cedis!');
        }
        break;

      case 'drink_coconut':
        if (game.player.cash >= 5) {
          game.player.cash -= 5;
          game.player.modifyStat('energy', 25);
          this.showNotification('Drank cold fresh coconut water! (GH₵ 5)');
        }
        break;

      case 'momo_agent':
        this.showNotification('MoMo Agent: Instant Mobile Money active!');
        break;

      default:
        this.showNotification(`${item.name} activated.`);
        break;
    }
  }

  private showNotification(text: string): void {
    this.notification = { text, time: 3.0 };
  }

  private saveGame(game: Game): void {
    SaveManager.saveGame({
      version: 1,
      appearance: game.player.appearance,
      stats: game.player.stats,
      cash: game.player.cash,
      career: game.player.career,
      day: game.player.day,
      hour: game.player.hour,
      minute: game.player.minute,
      currentLocationId: this.currentLocation.id,
      playerX: Math.round(game.player.x),
      playerY: Math.round(game.player.y),
      inventory: game.player.inventory,
      relationships: game.player.relationships,
      quests: game.player.quests
    });
  }

  render(game: Game, ctx: CanvasRenderingContext2D): void {
    // 1. Render Authentic Alvyd Environment (pack 9)
    game.sprites.drawEnvironment(ctx, this.currentLocation.id, this.animTimer);

    // 2. Render Authentic Alvyd Furniture & Props (pack 10)
    for (const item of this.currentLocation.interactables) {
      game.sprites.drawProp(ctx, item.id, item.x, item.y, this.animTimer);
    }

    // Exits indicators
    for (const exit of this.currentLocation.exits) {
      const glow = (Math.sin(this.animTimer * 5) + 1) * 0.5;
      ctx.fillStyle = `rgba(245, 184, 46, ${0.25 + glow * 0.35})`;
      ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
      ctx.strokeStyle = '#f5b82e';
      ctx.lineWidth = 1;
      ctx.strokeRect(exit.x, exit.y, exit.w, exit.h);
    }

    // 3. Render Authentic Alvyd NPCs (pack 11)
    for (const npcId of this.currentLocation.npcs) {
      const npc = ACCRA_NPCS[npcId];
      if (!npc) continue;

      // Draw real animated NPC character sprite
      game.sprites.drawCharacter(
        ctx,
        npc.gender,
        npc.styleOutfit,
        'idle',
        'down',
        this.animTimer,
        npc.x,
        npc.y
      );

      // Name Tag above head
      ctx.fillStyle = 'rgba(15, 18, 28, 0.85)';
      ctx.fillRect(npc.x - 16, npc.y - 12, 48, 11);
      ctx.strokeStyle = '#f5b82e';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(npc.x - 16, npc.y - 12, 48, 11);

      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x + 8, npc.y - 3);

      // Emotion bubble above active NPC
      if (this.activeNpc && this.activeNpc.id === npc.id) {
        game.sprites.drawEmotionBubble(ctx, 'heart', npc.x + 4, npc.y - 34);
      }
    }

    // 4. Render Authentic Alvyd Player Sprite (pack 11)
    game.sprites.drawCharacter(
      ctx,
      game.player.appearance.gender,
      game.player.appearance.styleOutfit,
      game.player.action,
      game.player.dir,
      this.animTimer,
      game.player.x,
      game.player.y
    );

    // 5. Render Interaction Prompt Badge
    this.renderInteractionBadge(ctx);

    // 6. Render Retro Alvyd Top HUD Bar
    this.renderHUD(game, ctx);

    // 7. Notification banner
    if (this.notification) {
      ctx.fillStyle = 'rgba(17, 21, 32, 0.94)';
      ctx.fillRect(35, 38, 250, 22);
      ctx.strokeStyle = '#f5b82e';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(35, 38, 250, 22);

      ctx.fillStyle = '#f5b82e';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.notification.text, 160, 52);
    }
  }

  private renderInteractionBadge(ctx: CanvasRenderingContext2D): void {
    if (!this.activeNpc && !this.activeInteractable) return;

    const label = this.activeNpc
      ? `Talk to ${this.activeNpc.name}`
      : this.activeInteractable!.name;

    ctx.fillStyle = 'rgba(15, 19, 29, 0.95)';
    ctx.fillRect(80, 204, 160, 18);
    ctx.strokeStyle = '#f5b82e';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 204, 160, 18);

    ctx.fillStyle = '#f5b82e';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`★ [A] ${label} ★`, 160, 216);
  }

  private renderHUD(game: Game, ctx: CanvasRenderingContext2D): void {
    // Top Bar HUD
    ctx.fillStyle = '#111520';
    ctx.fillRect(0, 0, 320, 22);
    ctx.fillStyle = '#f5b82e';
    ctx.fillRect(0, 21, 320, 1);

    // Location
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f5b82e';
    ctx.fillText(`📍 ${this.currentLocation.name}`, 6, 14);

    // Clock
    const h = String(game.player.hour).padStart(2, '0');
    const m = String(game.player.minute).padStart(2, '0');
    ctx.fillStyle = '#cfd7e8';
    ctx.fillText(`Day ${game.player.day} ${h}:${m}`, 155, 14);

    // Cedis Cash GH₵
    ctx.textAlign = 'right';
    ctx.fillStyle = '#57db80';
    ctx.fillText(`GH₵ ${game.player.cash}`, 314, 14);

    // Mini Needs Indicators at top right
    const drawMiniMeter = (name: string, val: number, x: number) => {
      ctx.fillStyle = '#262d40';
      ctx.fillRect(x, 26, 28, 4);
      ctx.fillStyle = val > 50 ? '#57db80' : val > 25 ? '#ffd242' : '#ff5252';
      ctx.fillRect(x, 26, (val / 100) * 28, 4);
    };

    drawMiniMeter('NRG', game.player.stats.energy, 200);
    drawMiniMeter('HUN', game.player.stats.hunger, 235);
    drawMiniMeter('STY', game.player.stats.style, 270);

    // Softkey bar at bottom
    ctx.fillStyle = '#11141e';
    ctx.fillRect(0, 225, 320, 15);
    ctx.fillStyle = '#8f9bb5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    const lsk = (document.getElementById('lbl-lsk') as HTMLElement)?.textContent || 'Interact';
    const rsk = (document.getElementById('lbl-rsk') as HTMLElement)?.textContent || 'ChalePhone';
    ctx.fillText(lsk, 8, 236);
    ctx.textAlign = 'right';
    ctx.fillText(rsk, 312, 236);
  }
}
