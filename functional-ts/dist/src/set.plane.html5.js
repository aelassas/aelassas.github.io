import { Point } from "./set.plane.js";
export class Plane {
  width;
  height;
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  draw(set, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) throw new Error(`Canvas with id ${canvasId} not found`);
    canvas.width = this.width;
    canvas.height = this.height;
    const context = canvas.getContext('2d');
    const semiWidth = this.width / 2;
    const semiHeight = this.height / 2;
    const xMin = -semiWidth;
    const xMax = semiWidth;
    const yMin = -semiHeight;
    const yMax = semiHeight;
    for (let x = 0; x < this.width; x++) {
      const xp = xMin + x * (xMax - xMin) / this.width;
      for (let y = 0; y < this.height; y++) {
        const yp = yMax - y * (yMax - yMin) / this.height;
        if (set(new Point(xp, yp))) context.fillRect(x, y, 1, 1);
      }
    }
  }
  clear(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) throw new Error(`Canvas with id ${canvasId} not found`);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);
  }
}