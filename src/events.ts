import GameState from './classes/GameState';
import Player from './classes/Player';
import Projectile from './classes/Projectile';
import SoundEffects from './classes/SoundEffects';

import { PROJECTILE_SPEED } from './constants';

import { Vector } from './types';

interface HandleKeyDownArgs {
  event: KeyboardEvent;
  state: GameState;
  player: Player;

  ctx: CanvasRenderingContext2D;

  soundEffects: SoundEffects;
}

export const handleKeyDown = ({ event, state, player, ctx, soundEffects }: HandleKeyDownArgs) => {
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

      soundEffects.play('shoot');
      const projectile = new Projectile({ position, velocity, ctx: ctx });
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
  soundEffects: SoundEffects;
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
