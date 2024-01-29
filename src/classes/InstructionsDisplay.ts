import { GameObject } from '../types';

export default class InstructionsDisplay implements GameObject {
  ctx: CanvasRenderingContext2D;
  position: { x: number; y: number };
  velocity: { x: number; y: number };

  constructor(ctx: CanvasRenderingContext2D, position: { x: number; y: number }) {
    this.ctx = ctx;
    this.position = position;
    this.velocity = { x: 0, y: 0 };
  }

  draw() {
    this.ctx.font = 'bold 18px IBM Plex Mono';

    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      'Use W, A and D to move and use the space bar to shoot.',
      this.position.x,
      this.position.y,
    );
  }

  update() {
    this.draw();
  }
}
