import * as set from "./set.core.js";
import { Plane } from "./set.plane.html5.js";
import { Point, disk, horizontalHalfPlane, verticalHalfPlane, translate, scale, rotate } from "./set.plane.js";
/*
 * Initialize the euclidean plane
 *
*/
const euclideanPlane = new Plane(200, 200);
/*
 * Disk
 *
*/
euclideanPlane.draw(disk(new Point(0, 0), 50), 'disk');
/*
 * Horizontal half plane
 *
*/
euclideanPlane.draw(horizontalHalfPlane(0, true), 'hhp');
/*
 * Vertical half plane
 *
*/
euclideanPlane.draw(verticalHalfPlane(0, false), 'vhp');
/**
 * Half disk
 *
*/
euclideanPlane.draw(set.intersection(disk(new Point(0, 0), 50), verticalHalfPlane(0, false)), 'hd');
/**
 * Timers
 *
 */
let translate_timer;
let scale_timer;
let rotate_timer;
/*
 * Translate
 *
*/
export function translate_op() {
  let deltay = 0;
  clearTimeout(scale_timer);
  clearTimeout(rotate_timer);
  translate_timer = setInterval(() => {
    deltay = deltay <= euclideanPlane.height ? deltay + 20 : 0;
    euclideanPlane.draw(translate(disk(new Point(0, -50), 50), 0, deltay), 'ep_op');
  }, 1000);
}
/*
 * Scale
 *
*/
export function scale_op() {
  let deltay = 0;
  let lambday = 0.05;
  clearTimeout(translate_timer);
  clearTimeout(rotate_timer);
  scale_timer = setInterval(() => {
    deltay = deltay <= euclideanPlane.height ? deltay + 20 : 0;
    lambday = deltay <= euclideanPlane.height ? lambday + 0.05 : 0.05;
    euclideanPlane.draw(scale(disk(new Point(0, -50), 50), 1, lambday, 0, deltay), 'ep_op');
  }, 1000);
}
/*
 * Rotate
 *
*/
export function rotate_op() {
  let theta = 0;
  clearTimeout(translate_timer);
  clearTimeout(scale_timer);
  rotate_timer = setInterval(() => {
    euclideanPlane.draw(rotate(horizontalHalfPlane(-90, true), theta), 'ep_op');
    theta = (theta + Math.PI / 2) % (2 * Math.PI);
  }, 1000);
}
/**
 * Clear timers and canvas
 */
export function clear(canvasId) {
  clearTimeout(translate_timer);
  clearTimeout(scale_timer);
  clearTimeout(rotate_timer);
  euclideanPlane.clear(canvasId);
}