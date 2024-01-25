/* eslint-disable max-classes-per-file */

export interface Vector {
  x: number;
  y: number;
}

interface ConstructorArgs {
  position: Vector;
  velocity: Vector;
  c: CanvasRenderingContext2D;
}

export interface GameObject {
  position: Vector;
  velocity: Vector;
  update: () => void;
  draw: () => void;
}

export interface CircularGameObject extends GameObject {
  radius: number;
}

export interface TriangularGameObject extends GameObject {
  getVertices(): Vector[];
}

export class Player implements TriangularGameObject {
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

export class Projectile implements GameObject {
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

export class Asteroid implements GameObject {
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

interface ValidKeys {
  w: { pressed: boolean };
  a: { pressed: boolean };
  d: { pressed: boolean };
}

export class GameState {
  keys: ValidKeys;

  projectiles: Projectile[];

  asteroids: Asteroid[];

  constructor() {
    this.keys = {
      w: { pressed: false },
      a: { pressed: false },
      d: { pressed: false },
    };
    this.projectiles = [];
    this.asteroids = [];
  }

  addProjectile(projectile: Projectile) {
    this.projectiles.push(projectile);
  }

  addAsteroid(asteroid: Asteroid) {
    this.asteroids.push(asteroid);
  }

  removeProjectile(projectile: Projectile) {
    const index = this.projectiles.indexOf(projectile);
    this.projectiles.splice(index, 1);
  }

  removeAsteroid(asteroid: Asteroid) {
    const index = this.asteroids.indexOf(asteroid);
    this.asteroids.splice(index, 1);
  }
}
