import { ValidKeys } from '../types';
import Asteroid from './Asteroid';
import Projectile from './Projectile';

export default class GameState {
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