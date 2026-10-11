import { Input } from '../engine/Input';
import { AudioManager } from '../engine/Audio';
import { StringsManager } from '../engine/Strings';
import { SpriteManager } from '../engine/SpriteManager';
import { Player } from './Player';
import { GameState } from './GameState';
import { SplashState } from './states/SplashState';

export class Game {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public input: Input;
  public audio: AudioManager;
  public strings: StringsManager;
  public sprites: SpriteManager;
  public player: Player;

  private stateStack: GameState[] = [];
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.ctx.imageSmoothingEnabled = false;

    this.input = new Input(canvas);
    this.audio = new AudioManager();
    this.strings = new StringsManager();
    this.sprites = new SpriteManager();
    this.player = new Player();
  }

  public async init(): Promise<void> {
    await Promise.all([
      this.strings.load(),
      this.sprites.load()
    ]);
    this.changeState(new SplashState());
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(delta);
    this.render();

    this.input.update();
    requestAnimationFrame((t) => this.loop(t));
  }

  private update(delta: number): void {
    if (this.stateStack.length > 0) {
      const topState = this.stateStack[this.stateStack.length - 1];
      topState.update(this, delta);
    }
  }

  private render(): void {
    this.ctx.save();
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.stateStack.length > 0) {
      // Support rendering bottom state under modal popups
      const startIdx = Math.max(0, this.stateStack.length - 2);
      for (let i = startIdx; i < this.stateStack.length; i++) {
        this.stateStack[i].render(this, this.ctx);
      }
    }

    this.ctx.restore();
  }

  public pushState(state: GameState): void {
    state.enter(this);
    this.stateStack.push(state);
  }

  public popState(): void {
    if (this.stateStack.length > 0) {
      const state = this.stateStack.pop()!;
      state.exit(this);
    }
  }

  public changeState(state: GameState): void {
    while (this.stateStack.length > 0) {
      const top = this.stateStack.pop()!;
      top.exit(this);
    }
    this.pushState(state);
  }

  public getCurrentState(): GameState | null {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
  }
}
