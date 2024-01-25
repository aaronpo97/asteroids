import { GameObject, Vector, ConstructorArgs } from '../types';

export default class Asteroid implements GameObject {
  position: Vector;

  velocity: Vector;

  radius: number;

  c: CanvasRenderingContext2D;

  constructor({ position, velocity, radius, c }: ConstructorArgs & { radius: number }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.c = c;
  }

  draw() {
    this.c.beginPath();
    this.c.arc(
      this.position.x, // x
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false,
    );
    this.c.closePath();

    this.c.strokeStyle = 'white';
    this.c.stroke();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
