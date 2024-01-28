import { GameObject, Vector, ConstructorArgs } from '../types';

export default class Asteroid implements GameObject {
  position: Vector;
  velocity: Vector;
  radius: number;
  ctx: CanvasRenderingContext2D;

  constructor({ position, velocity, radius, ctx }: ConstructorArgs & { radius: number }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.closePath();

    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
