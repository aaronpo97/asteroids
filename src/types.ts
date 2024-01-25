export interface Vector {
  x: number;
  y: number;
}

export interface ConstructorArgs {
  position: Vector;
  velocity: Vector;
  c: CanvasRenderingContext2D;
}

export interface GameObject {
  position: Vector;
  velocity: Vector;
  update: () => void;
  draw: () => void;
}

export interface CircularGameObject extends GameObject {
  radius: number;
}

export interface TriangularGameObject extends GameObject {
  getVertices(): Vector[];
}

export interface ValidKeys {
  w: { pressed: boolean };
  a: { pressed: boolean };
  d: { pressed: boolean };
}
