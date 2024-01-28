import { GameStateObject, Vector } from '../types';
import GameState from './GameState';

export default class LivesDisplay implements GameStateObject {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  state: GameState;

  constructor(ctx: CanvasRenderingContext2D, state: GameState, position: Vector) {
    this.ctx = ctx;
    this.position = position;
    this.state = state;
  }

  draw() {
    this.ctx.font = 'bold 30px Courier New';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`Lives: ${this.state.getLives()}`, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}
