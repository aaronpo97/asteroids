import Asteroid from './classes/Asteroid';
import type GameState from './classes/GameState';
import type { Vector } from './types';

export const spawnAsteroid = ({
  canvas,
  c,
  state,
}: {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  state: GameState;
}) => {
  const index = Math.floor(Math.random() * 4);

  const position: Vector = { x: 0, y: 0 };
  const velocity: Vector = { x: 0, y: 0 };

  const radius = 50 * Math.random() + 10;

  switch (index) {
    case 0: // left side of the screen
      position.x = 0 - radius;
      position.y = Math.random() * canvas.height;
      velocity.x = 1;
      velocity.y = 0;
      break;
    case 1: // bottom side of the screen
      position.x = Math.random() * canvas.width;
      position.y = canvas.height + radius;
      velocity.x = 0;
      velocity.y = -1;
      break;
    case 2: // right side of the screen
      position.x = canvas.width + radius;
      position.y = Math.random() * canvas.height;
      velocity.x = -1;
      velocity.y = 0;

      break;
    case 3: // top side of the screen
      position.x = Math.random() * canvas.width;
      position.y = 0 - radius;
      velocity.x = 0;
      velocity.y = 1;
      break;
    default:
      break;
  }

  const asteroid = new Asteroid({ c, position, velocity, radius });
  state.addAsteroid(asteroid);
};
