import { GameObject, Vector, ConstructorArgs } from '../types';

export default class Projectile implements GameObject {
  position: Vector;

  velocity: Vector;

  radius: number;

  c: CanvasRenderingContext2D;

  constructor({ position, velocity, c }: ConstructorArgs) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
    this.c = c;
  }

  draw() {
    this.c.beginPath();
    this.c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    this.c.closePath();

    this.c.fillStyle = 'white';
    this.c.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
