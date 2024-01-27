import Asteroid from './classes/Asteroid';
import type GameState from './classes/GameState';
import type { Vector } from './types';

interface SpawnAsteroidArgs {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  state: GameState;
}
export const spawnAsteroid = ({ canvas, c, state }: SpawnAsteroidArgs) => {
  const positions = ['left', 'bottom', 'right', 'top'] as const;
  const randomPosition = positions[Math.floor(Math.random() * positions.length)];
  const position: Vector = { x: 0, y: 0 };
  const velocity: Vector = { x: 0, y: 0 };
  const radius = 50;
  switch (randomPosition) {
    case 'left': {
      // 0 to PI radians (0 to 180 degrees)
      const angle = Math.random() * Math.PI;
      position.x = 0 - radius;
      position.y = Math.random() * canvas.height;

      velocity.x = Math.sin(angle);
      velocity.y = Math.cos(angle);
      break;
    }
    case 'bottom': {
      // 90 to 270 degrees
      const angle = Math.random() * Math.PI + Math.PI / 2;
      position.x = Math.random() * canvas.width;
      position.y = canvas.height + radius;
      velocity.x = Math.sin(angle);
      velocity.y = Math.cos(angle);
      break;
    }
    case 'right': {
      // 180 to 360 degrees
      const angle = Math.random() * Math.PI + Math.PI;
      position.x = canvas.width + radius;
      position.y = Math.random() * canvas.height;

      velocity.x = Math.sin(angle);
      velocity.y = Math.cos(angle);
      break;
    }

    case 'top': {
      // 270 to 450 degrees
      const angle = Math.random() * Math.PI + (Math.PI * 3) / 2;
      position.x = Math.random() * canvas.width;
      position.y = 0 - radius;
      velocity.x = Math.sin(angle);
      velocity.y = Math.cos(angle);
      break;
    }
    default:
      break;
  }

  const asteroid = new Asteroid({ c, position, velocity, radius });
  state.addAsteroid(asteroid);
};
