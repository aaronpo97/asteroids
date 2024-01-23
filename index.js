const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

class Player {
  /**
   * @param {{
   *   position: { x: number; y: number };
   *   velocity: { x: number; y: number };
   * }} args
   */
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
  }

  draw() {
    /**
     * `c.save()` and `c.restore()` are used to save and restore the canvas state so we
     * can apply transformations without affecting the rest of the canvas.
     */
    c.save();

    /**
     * Handle the rotation by translating the canvas to the player's position, rotating
     * it, then translating it back. This way, the rotation will be applied to the
     * player's position.
     */
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
    c.fillStyle = 'red';
    c.fill();

    c.beginPath();
    c.moveTo(this.position.x + 30, this.position.y);
    c.lineTo(this.position.x - 10, this.position.y - 10);
    c.lineTo(this.position.x - 10, this.position.y + 10);
    c.closePath();

    c.strokeStyle = 'white';
    c.stroke();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Projectile {
  /**
   * @param {{
   *   position: { x: number; y: number };
   *   velocity: { x: number; y: number };
   * }} args
   */
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.closePath();

    c.fillStyle = 'white';
    c.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.98;
const PROJECTILE_SPEED = 10;
const projectiles = [];

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    projectile.update();

    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(i, 1);
    }
  }

  if (keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else if (!keys.w.pressed) {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }
  if (keys.d.pressed) {
    player.rotation += ROTATIONAL_SPEED;
  } else if (keys.a.pressed) {
    player.rotation -= ROTATIONAL_SPEED;
  }
}

animate();

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'KeyA':
      keys.a.pressed = true;
      break;

    case 'KeyD':
      keys.d.pressed = true;
      break;

    case 'Space': {
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        }),
      );
    }
    default:
      break;
  }
});
window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;

    default:
      break;
  }
});
