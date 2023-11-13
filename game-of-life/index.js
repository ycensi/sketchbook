/**
 * Creates a 2D array of the specified size
 * @param {number} rows Number of rows on the grid
 * @param {number} cols Number of columns on the grid
 * @param {number} initialValue Initial value for each cell
 */
function create2DArray(rows, cols, initialValue = 0) {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols).fill(initialValue);
  }
  return arr;
}

/**
 * Fills the grid with random values
 * @param {number[][]} array 2D array to fill
 * @param {number} probability Probability of a cell being alive
 */
function randomFill2DArray(array, probability = 0.5) {
  return array.map((row) =>
    row.map(() => (Math.random() < probability ? 1 : 0))
  );
}

/**
 * Draws the grid on the canvas
 * @param {number[][]} array 2D array to draw
 */
function drawGrid(array) {
  array.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 1) {
        fill(255);
        stroke(0);
        rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
      }
    })
  );
}

/**
 * Counts the number of neighbors of a cell
 * @param {number[][]} grid 2D array to count the neighbors
 * @param {number} x X coordinate of the cell
 * @param {number} y Y coordinate of the cell
 * @returns {number} Number of neighbors
 */
function countNeighbors(grid, x, y) {
  let sum = 0;
  let cols = grid[0].length;
  let rows = grid.length;
  for (let i = -1; i < 2; i++) {
    const row = (x + i + rows) % rows;
    for (let j = -1; j < 2; j++) {
      const col = (y + j + cols) % cols;
      sum += grid[row][col];
    }
  }
  sum -= grid[x][y];
  return sum;
}

/**
 * Get the next generation of the grid based on the current generation
 * See more: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 * @param {number[][]} currentGeneration Current generation of the grid
 */
function nextGeneration(currentGeneration) {
  const nextGeneration = create2DArray(cols, rows, 0);

  currentGeneration.forEach((row, i) =>
    row.forEach((cell, j) => {
      const neighbors = countNeighbors(currentGeneration, i, j);

      if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGeneration[i][j] = 0;
      } else if (cell === 0 && neighbors === 3) {
        nextGeneration[i][j] = 1;
      } else {
        nextGeneration[i][j] = cell;
      }
    })
  );

  return nextGeneration;
}

let grid;
let cols;
let rows;
let resolution = 10;

/**
 * Changes the resolution of the grid
 */
function changeResolution() {
  const newResolution = document.getElementById('resolutionInput').value;
  resolution = Math.floor(newResolution);
  setup();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(windowWidth / resolution);
  rows = Math.floor(windowHeight / resolution);
  grid = create2DArray(cols, rows);
  grid = randomFill2DArray(grid);
}

function draw() {
  background(0);
  drawGrid(grid);
  grid = nextGeneration(grid);
}
