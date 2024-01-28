import GameState from '../classes/GameState';

export interface Vector {
  x: number;
  y: number;
}

export interface ConstructorArgs {
  position: Vector;
  velocity: Vector;
  ctx: CanvasRenderingContext2D;
}

export interface GameObject {
  position: Vector;
  velocity?: Vector;
  update: () => void;
  draw: () => void;
  ctx: CanvasRenderingContext2D;
}

export interface DisplayObject extends GameObject {
  state: GameState;
}
export interface CircularGameObject extends GameObject {
  radius: number;
}

export interface TriangularGameObject extends GameObject {
  getVertices(): Vector[];
}

export interface GameStateObject extends GameObject {
  state: GameState;
}

export interface ValidKeys {
  w: { pressed: boolean };
  a: { pressed: boolean };
  d: { pressed: boolean };
}
