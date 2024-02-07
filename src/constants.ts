export const SPEED = 2.5;
export const ROTATIONAL_SPEED = 0.02;
export const FRICTION = 0.99;
export const PROJECTILE_SPEED = 10;
export const ASTEROID_SPAWN_INTERVAL = 3000;
export const ASTEROID_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export const ASTEROID_RADII: Record<(typeof ASTEROID_SIZES)[number], number> = {
  xs: 20,
  sm: 30,
  md: 40,
  lg: 50,
} as const;

export const ASTEROID_SCORES: Record<(typeof ASTEROID_SIZES)[number], number> = {
  xs: 40,
  sm: 30,
  md: 20,
  lg: 10,
} as const;
