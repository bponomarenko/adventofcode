export const formatInput = input => input.toGrid();

const rollingRock = 'O';

const rollRocks = (grid, dir) => {
  const maxX = grid[0].length - 1;
  const maxY = grid.length - 1;
  const toNorth = dir === 'n';
  const toWest = dir === 'w';

  for (let y = toNorth ? 0 : maxY; toNorth ? y <= maxY : y >= 0; y += toNorth ? 1 : -1) {
    for (let x = toWest ? 0 : maxX; toWest ? x <= maxX : x >= 0; x += toWest ? 1 : -1) {
      if (grid[y][x] !== rollingRock) {
        continue;
      }

      switch (dir) {
        case 'n':
          for (let dx = y - 1; dx >= 0 && grid[dx][x] === '.'; dx -= 1) {
            grid[dx][x] = rollingRock;
            grid[dx + 1][x] = '.';
          }
          break;
        case 's':
          for (let dx = y + 1; dx <= maxY && grid[dx][x] === '.'; dx += 1) {
            grid[dx][x] = rollingRock;
            grid[dx - 1][x] = '.';
          }
          break;
        case 'w':
          for (let dx = x - 1; dx >= 0 && grid[y][dx] === '.'; dx -= 1) {
            grid[y][dx] = rollingRock;
            grid[y][dx + 1] = '.';
          }
          break;
        case 'e':
          for (let dx = x + 1; dx <= maxX && grid[y][dx] === '.'; dx += 1) {
            grid[y][dx] = rollingRock;
            grid[y][dx - 1] = '.';
          }
          break;
      }
    }
  }
  return grid;
};

const countTotalLoad = grid => grid.map((row, i) => (grid.length - i) * row.filter(field => field === rollingRock).length).sum();

export const part1 = input => countTotalLoad(rollRocks(input, 'n'));

export const part2 = async input => {
  const memory = new Map();
  const cycles = 1000000000;
  let i = cycles;

  while (i > 0) {
    // roll rocks
    rollRocks(input, 'n');
    rollRocks(input, 'w');
    rollRocks(input, 's');
    rollRocks(input, 'e');

    // check if we seen state like this before
    const hash = input.toGridString('');
    if (memory.has(hash) && i % (memory.get(hash) - i) === 1) {
      break;
    }
    memory.set(hash, i);
    i -= 1;
  }
  return countTotalLoad(input);
};
