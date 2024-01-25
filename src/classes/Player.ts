import { TriangularGameObject, Vector, ConstructorArgs } from '../types';

export default class Player implements TriangularGameObject {
  position: Vector;

  velocity: Vector;

  rotation: number;

  c: CanvasRenderingContext2D;

  constructor({ position, velocity, c }: ConstructorArgs) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
    this.c = c;
  }

  draw() {
    /**
     * `c.save()` and `c.restore()` are used to save and restore the canvas state so we can apply
     * transformations without affecting the rest of the canvas.
     */
    this.c.save();

    /**
     * Handle the rotation by translating the canvas to the player's position, rotating it, then
     * translating it back. This way, the rotation will be applied to the player's position.
     */
    this.c.translate(this.position.x, this.position.y);
    this.c.rotate(this.rotation);
    this.c.translate(-this.position.x, -this.position.y);

    this.c.beginPath();
    this.c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
    this.c.fillStyle = 'red';
    this.c.fill();
    this.c.closePath();

    this.c.beginPath();
    this.c.moveTo(this.position.x + 30, this.position.y);
    this.c.lineTo(this.position.x - 10, this.position.y - 10);
    this.c.lineTo(this.position.x - 10, this.position.y + 10);
    this.c.closePath();

    this.c.strokeStyle = 'white';
    this.c.stroke();
    this.c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  getVertices() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ];
  }
}
