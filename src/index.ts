import GameState from './classes/GameState';
import Player from './classes/Player';
import { circleTriangleCollision, circleCollision } from './collisionHelpers';
import { ASTEROID_SPAWN_INTERVAL, SPEED, FRICTION, ROTATIONAL_SPEED } from './constants';
import { handleKeyDown, handleKeyUp } from './events';
import { spawnAsteroid } from './spawnHelpers';

const canvas = document.querySelector<HTMLCanvasElement>('#game-container')!;
const c = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
  c,
});

const state = new GameState();

const intervalId = window.setInterval(
  () => spawnAsteroid({ canvas, c, state }),
  ASTEROID_SPAWN_INTERVAL,
);

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = state.projectiles[i];
    projectile.update();

    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      state.removeProjectile(projectile);
    }
  }

  // asteroid management
  for (let i = state.asteroids.length - 1; i >= 0; i -= 1) {
    const asteroid = state.asteroids[i];
    asteroid.update();

    /**
     * If the player collides with an asteroid, stop the animation and clear the asteroid spawning
     * interval.
     */
    if (circleTriangleCollision(asteroid, player.getVertices())) {
      window.cancelAnimationFrame(animationId);
      window.clearInterval(intervalId);
    }

    /** If the asteroid is outside of the canvas, remove it from the state.asteroids array. */
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      state.removeAsteroid(asteroid);
    }

    for (let j = state.projectiles.length - 1; j >= 0; j -= 1) {
      const projectile = state.projectiles[j];

      // todo: make the state.asteroids smaller when they are hit if they are big enough
      if (circleCollision(asteroid, projectile)) {
        state.removeProjectile(projectile);
        state.removeAsteroid(asteroid);

        break;
      }
    }
  }

  if (state.keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else if (!state.keys.w.pressed) {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }

  if (state.keys.d.pressed) {
    player.rotation += ROTATIONAL_SPEED;
  } else if (state.keys.a.pressed) {
    player.rotation -= ROTATIONAL_SPEED;
  }
}

animate();

window.addEventListener('keydown', (event) => handleKeyDown({ event, state, player, c }));
window.addEventListener('keyup', (event) => handleKeyUp({ event, state }));
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
