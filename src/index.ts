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

let intervalId = window.setInterval(
  () => spawnAsteroid({ canvas, c, state }),
  ASTEROID_SPAWN_INTERVAL,
);

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  if (document.visibilityState === 'hidden') {
    window.cancelAnimationFrame(animationId);
    window.clearInterval(intervalId);
    return;
  }

  const score = state.getScore();
  const lives = state.getLives();

  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  c.font = 'bold 30px Courier New';
  c.fillStyle = 'white';

  // place it on the top left corner
  c.fillText(`Score: ${score}`, 10, 40);

  c.font = 'bold 30px Courier New';
  c.fillStyle = 'white';
  c.fillText(`Lives: ${lives}`, 10, 80);

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
      if (lives <= 0) {
        window.cancelAnimationFrame(animationId);
        window.clearInterval(intervalId);
        return;
      }
      state.decrementLives();
      player.position.x = canvas.width / 2;
      player.position.y = canvas.height / 2;
      player.velocity.x = 0;
      player.velocity.y = 0;
      player.rotation = 0;
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
        state.incrementScore();
        break;
      }
    }
  }

  // If the player goes off the screen, wrap them around to the other side.
  if (player.position.x < 0) {
    player.position.x = canvas.width;
  } else if (player.position.x > canvas.width) {
    player.position.x = 0;
  } else if (player.position.y > canvas.height) {
    player.position.y = 0;
  } else if (player.position.y < 0) {
    player.position.y = canvas.height;
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

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') {
    return;
  }

  animate();
  intervalId = window.setInterval(
    () => spawnAsteroid({ canvas, c, state }),
    ASTEROID_SPAWN_INTERVAL,
  );
});
