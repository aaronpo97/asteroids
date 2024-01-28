import { GameObject, Vector, ConstructorArgs } from '../types';

export default class Projectile implements GameObject {
  position: Vector;
  velocity: Vector;
  radius: number;
  ctx: CanvasRenderingContext2D;

  constructor({ position, velocity, ctx }: ConstructorArgs) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
