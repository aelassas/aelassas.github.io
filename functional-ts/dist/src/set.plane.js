/*
 * Point
 *
*/
export class Point {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
/*
 * Euclidean distance
 *
*/
export function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
/*
 * Disk
 *
*/
export const disk = (center, radius) => p => distance(p, center) <= radius;
/*
 * Horizontal half plane
 *
*/
export const horizontalHalfPlane = (y, isLowerThan) => p => isLowerThan ? p.y <= y : p.y >= y;
/*
 * Vertical half plane
 *
*/
export const verticalHalfPlane = (x, isLowerThan) => p => isLowerThan ? p.x <= x : p.x >= x;
/*
 * Translate
 *
*/
const translatePoint = (deltax, deltay) => p => new Point(p.x + deltax, p.y + deltay);
export const translate = (e, deltax, deltay) => p => e(translatePoint(-deltax, -deltay)(p));
/*
 * Scale
 *
*/
const scalePoint = (lambdax, lambday, deltax, deltay) => p => new Point(lambdax * p.x + deltax, lambday * p.y + deltay);
export const scale = (e, lambdax, lambday, deltax, deltay) => p => e(scalePoint(1 / lambdax, 1 / lambday, -deltax / lambdax, -deltay / lambday)(p));
/*
 * Rotate
 *
*/
const rotatePoint = theta => p => new Point(p.x * Math.cos(theta) - p.y * Math.sin(theta), p.x * Math.sin(theta) + p.y * Math.cos(theta));
export const rotate = (e, theta) => p => e(rotatePoint(-theta)(p));