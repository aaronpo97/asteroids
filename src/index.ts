import GameState from './classes/GameState';
import LivesDisplay from './classes/LivesDisplay';
import Player from './classes/Player';
import ScoreDisplay from './classes/ScoreDisplay';
import SoundEffects from './classes/SoundEffects';

import { circleTriangleCollision, circleCollision } from './helpers/collisions';
import { spawnAsteroid } from './helpers/spawning';

import {
  ASTEROID_SPAWN_INTERVAL,
  SPEED,
  FRICTION,
  ROTATIONAL_SPEED,
  ASTEROID_SIZES,
  ASTEROID_SCORES,
  ASTEROID_RADII,
} from './constants';

import { handleKeyDown, handleKeyUp } from './events';

const canvas = document.querySelector<HTMLCanvasElement>('#game-container')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const soundEffects = new SoundEffects(new AudioContext());
soundEffects.load();

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
  ctx: ctx,
});
const state = new GameState();
const scoreDisplay = new ScoreDisplay(ctx, state, { x: 10, y: 40 });
const livesDisplay = new LivesDisplay(ctx, state, { x: 10, y: 80 });

const asteroidSpawnerCallback = () => {
  const size = ASTEROID_SIZES[Math.floor(Math.random() * ASTEROID_SIZES.length)];
  spawnAsteroid({ canvas, ctx, state, size });
};
let intervalId = window.setInterval(asteroidSpawnerCallback, ASTEROID_SPAWN_INTERVAL);

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  const lives = state.getLives();

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  scoreDisplay.update();
  livesDisplay.update();

  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = state.projectiles[i];
    projectile.update();

    /** If the projectile is outside of the canvas, remove it from the state.projectiles array. */
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      state.removeProjectile(projectile);
    }
  }

  for (let i = state.asteroids.length - 1; i >= 0; i -= 1) {
    const asteroid = state.asteroids[i];
    asteroid.update();

    /**
     * If the player collides with an asteroid, and the player has no more lives, stop the animation
     * and clear the asteroid spawning interval.
     */
    if (circleTriangleCollision(asteroid, player.getVertices())) {
      soundEffects.play('death');
      if (lives <= 0) {
        window.cancelAnimationFrame(animationId);
        window.clearInterval(intervalId);
        return;
      }

      state.decrementLives();

      /** Reset the player's position, velocity, and rotation to their initial values. */
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
      const isColliding = circleCollision(asteroid, projectile);

      const size = Object.entries(ASTEROID_RADII).find(
        ([s, radius]) => radius === asteroid.radius,
      )![0] as (typeof ASTEROID_SIZES)[number];

      if (isColliding) {
        soundEffects.play('hit');
        state.removeProjectile(projectile);
        state.removeAsteroid(asteroid);
        state.incrementScore(ASTEROID_SCORES[size]);

        break;
      }
    }

    if (document.visibilityState === 'hidden') {
      window.cancelAnimationFrame(animationId);
      window.clearInterval(intervalId);
      return;
    }
  }

  // If the player goes off the screen, wrap them around to the other side.
  if (player.position.x < 0) {
    player.position.x = canvas.width;
  }
  if (player.position.x > canvas.width) {
    player.position.x = 0;
  }
  if (player.position.y > canvas.height) {
    player.position.y = 0;
  }
  if (player.position.y < 0) {
    player.position.y = canvas.height;
  }

  if (state.keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  }
  if (!state.keys.w.pressed) {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }
  if (state.keys.d.pressed) {
    player.rotation += ROTATIONAL_SPEED;
  }
  if (state.keys.a.pressed) {
    player.rotation -= ROTATIONAL_SPEED;
  }
}

animate();

window.addEventListener('keydown', (event) =>
  handleKeyDown({ event, state, player, ctx, soundEffects }),
);
window.addEventListener('keyup', (event) => handleKeyUp({ event, state, soundEffects }));
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') {
    return;
  }

  animate();
  intervalId = window.setInterval(asteroidSpawnerCallback, ASTEROID_SPAWN_INTERVAL);
});
