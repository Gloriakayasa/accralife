import { Game } from './Game';

export interface GameState {
  enter(game: Game): void;
  exit(game: Game): void;
  update(game: Game, delta: number): void;
  render(game: Game, ctx: CanvasRenderingContext2D): void;
}
