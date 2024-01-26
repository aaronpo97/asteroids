import GameState from './classes/GameState';
import Player from './classes/Player';
import Projectile from './classes/Projectile';

import { PROJECTILE_SPEED } from './constants';

import { Vector } from './types';

interface HandleKeyDownArgs {
  event: KeyboardEvent;
  state: GameState;
  player: Player;

  c: CanvasRenderingContext2D;
}

export const handleKeyDown = ({ event, state, player, c }: HandleKeyDownArgs) => {
  switch (event.code) {
    case 'KeyW': {
      state.keys.w.pressed = true;
      break;
    }
    case 'KeyA': {
      state.keys.a.pressed = true;
      break;
    }
    case 'KeyD': {
      state.keys.d.pressed = true;
      break;
    }

    case 'Space': {
      const position: Vector = {
        x: player.position.x + Math.cos(player.rotation) * 30,
        y: player.position.y + Math.sin(player.rotation) * 30,
      };
      const velocity: Vector = {
        x: Math.cos(player.rotation) * PROJECTILE_SPEED,
        y: Math.sin(player.rotation) * PROJECTILE_SPEED,
      };

      const projectile = new Projectile({ position, velocity, c });
      state.addProjectile(projectile);
      break;
    }
    default:
      break;
  }
};

interface HandleKeyUpArgs {
  event: KeyboardEvent;
  state: GameState;
}

export const handleKeyUp = ({ event, state }: HandleKeyUpArgs) => {
  switch (event.code) {
    case 'KeyW':
      state.keys.w.pressed = false;
      break;
    case 'KeyA':
      state.keys.a.pressed = false;
      break;
    case 'KeyD':
      state.keys.d.pressed = false;
      break;

    default:
      break;
  }
};
