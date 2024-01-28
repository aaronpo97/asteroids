import { GameStateObject, Vector } from '../types';
import GameState from './GameState';

export default class ScoreDisplay implements GameStateObject {
  ctx: CanvasRenderingContext2D;
  velocity: Vector;
  position: Vector;
  state: GameState;

  constructor(ctx: CanvasRenderingContext2D, state: GameState, position: Vector) {
    this.ctx = ctx;
    this.velocity = { x: 0, y: 0 };
    this.position = position;
    this.state = state;
  }

  draw() {
    this.ctx.font = 'bold 30px Courier New';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`Score: ${this.state.getScore()}`, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}
