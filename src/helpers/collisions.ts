import { CircularGameObject, Vector } from '../types';

export const circleCollision = (circle1: CircularGameObject, circle2: CircularGameObject) => {
  const xDiff = circle2.position.x - circle1.position.x;
  const yDiff = circle2.position.y - circle1.position.y;

  // using the Pythagorean theorem to calculate the distance between the two circles
  const distance = Math.sqrt(xDiff ** 2 + yDiff ** 2);

  // if the distance is less than the sum of the two radii, then the circles are colliding
  if (distance <= circle1.radius + circle2.radius) {
    return true;
  }

  return false;
};
export const isPointOnLineSegment = ({
  point,
  line,
}: {
  point: Vector;
  line: { start: Vector; end: Vector };
}) => {
  return (
    point.x >= Math.min(line.start.x, line.end.x) &&
    point.x <= Math.max(line.start.x, line.end.x) &&
    point.y >= Math.min(line.start.y, line.end.y) &&
    point.y <= Math.max(line.start.y, line.end.y)
  );
};
export const circleTriangleCollision = (
  circle: { position: Vector; radius: number },
  triangle: Vector[],
) => {
  /** Check if the circle is colliding with any of the triangle's edges. */
  for (let i = 0; i < 3; i += 1) {
    const start = triangle[i];
    const end = triangle[(i + 1) % 3];

    let dx = end.x - start.x;
    let dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    const dot =
      ((circle.position.x - start.x) * dx + (circle.position.y - start.y) * dy) / length ** 2;

    let closestX = start.x + dot * dx;
    let closestY = start.y + dot * dy;

    if (
      !isPointOnLineSegment({
        point: { x: closestX, y: closestY },
        line: { start, end },
      })
    ) {
      closestX = closestX < start.x ? start.x : end.x;
      closestY = closestY < start.y ? start.y : end.y;
    }

    dx = closestX - circle.position.x;
    dy = closestY - circle.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= circle.radius) {
      return true;
    }
  }

  return false;
};
