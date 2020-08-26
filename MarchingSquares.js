/** MarchingSquares.js
 *  Description: A rendition of the Marching squares algorithmn which generates a contour for a 2-D scalar fieldp5.
 *               Uses linear interpolation to create a less "blocky" image.
 *               Imports p5.js and OpenSimplexNoise.js.
 */

let arr; // 2D Array holding noise values from OpenSimplexNoise (-1 to 1)
let cols, rows; // Size of 2-D Array
let res = 4; // Resolution size of Marching Squares
let increment = 0.1; // Increment val for xoff and yoff in OpenSimplexNoise
let zoff = 0; // Used as time value in OpenSimplexNoise
let noise; // OpenSimplexNoise object

// Set up canvas, arrays, and noise objects
function setup() {
  createCanvas(400, 400);
  noise = new OpenSimplexNoise(Date.now());
  cols = 1 + width / res;
  rows = 1 + height / res;
  arr = gen2DArr(cols, rows);
}

// Draws Marching Squares algorithm using OpenSimplexNoise and linear interpolation
function draw() {
  background(0); 
  calcArr();
  for (let i = 0; i < cols-1; i++) {
    for (let j = 0; j < rows-1; j++) {
      let x = i * res;
      let y = j * res;

      // Values of the four corners
      let a_val = arr[i][j] +1;
      let b_val = arr[i+1][j] + 1;
      let c_val = arr[i+1][j+1]+1;
      let d_val = arr[i][j+1] +1;

      // Values of the four points based on linear interpolation and weight of corners
      let a = createVector(lerp(x, x + res, (1 - a_val) / (b_val - a_val)), y);
      let b = createVector(x + res, lerp(y, y + res, (1 - b_val) / (c_val - b_val)));
      let c = createVector(lerp(x, x + res, (1 - d_val) / (c_val - d_val)), y + res);
      let d = createVector(x, lerp(y, y + res, (1 - a_val) / (d_val - a_val)));

      // Grab state from weight of four corners
      let state = getState(ceil(arr[i][j]), ceil(arr[i+1][j]), 
        ceil(arr[i+1][j+1]), ceil(arr[i][j+1]));

      // Draw lines based on state of four corners
      stroke(255);
      strokeWeight(1);
      drawState(a, b, c, d, state);
    }
  } 
}

// Calculates array based on OpenSimplexNoise
function calcArr() {
  let xoff = 0;
  for (let i = 0; i < cols; i++) {
    xoff += increment;
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      arr[i][j] = float(noise.noise3D(xoff, yoff, zoff));
      yoff += increment;
    }
  }
  zoff += 0.01;
}

// Draws a line from vector x1 to vector x2
function drawLine(x1, x2) {
  line(x1.x, x1.y, x2.x, x2.y);
}

// Draws a line depending on the state of the four corners
function drawState(a, b, c, d, state) {
  switch (state) {
    case 1:  
      drawLine(c, d);
      break;
    case 2:  
      drawLine(b, c);
      break;
    case 3:  
      drawLine(b, d);
      break;
    case 4:  
      drawLine(a, b);
      break;
    case 5:  
      drawLine(a, d);
      drawLine(b, c);
      break;
    case 6:  
      drawLine(a, c);
      break;
    case 7:  
      drawLine(a, d);
      break;
    case 8:  
      drawLine(a, d);
      break;
    case 9:  
      drawLine(a, c);
      break;
    case 10: 
      drawLine(a, b);
      drawLine(c, d);
      break;
    case 11: 
      drawLine(a, b);
      break;
    case 12: 
      drawLine(b, d);
      break;
    case 13: 
      drawLine(b, c);
      break;
    case 14: 
      drawLine(c, d);
      break;
    }
}

// Calculates the state of the four corners
function getState(a, b, c, d) {
  let i = 0;
  return (((((((i | a) << 1) | b) << 1) | c) << 1) | d);
}

// Generates 2-D array from cols and rows
function gen2DArr(cols, rows) {
  arr = new Array(cols);
  for (i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}