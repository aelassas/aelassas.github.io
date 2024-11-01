import { add, multiply } from "./set.fractals.js";
import { ComplexPlane } from "./set.fractals.html5.js";
const complexPlane = new ComplexPlane(300, 300, -1.5, 1.5, -1.5, 1.5, 1.5, 20, 'fractal');
const mandelbrot = (z, c) => add(multiply(z, z), c);
complexPlane.pleaseWait();
setTimeout(() => complexPlane.draw(mandelbrot), 500);