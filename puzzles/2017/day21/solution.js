export const formatInput = input => {
  const rules = new Map();
  input.split('\n').forEach(rule => {
    const [pattern, enhancement] = rule.split(' => ');
    // Generated various flipped and rotated patterns to match
    const patternGrid = pattern.toGrid('/');
    [patternGrid, patternGrid.flipGrid(), patternGrid.flipGrid(true)].forEach(g => {
      let grid = g;
      for (let i = 0; i < 4; i += 1) {
        if (i > 0) {
          grid = grid.rotateGrid();
        }
        rules.set(grid.stringifyGrid('/'), enhancement);
      }
    });
  });
  return rules;
};

const enhanceGrid = (grid, enhancements, size) => {
  const step = grid.length / size;
  const enchancedGrid = [];
  for (let y = 0; y < step; y += 1) {
    for (let x = 0; x < step; x += 1) {
      const pattern = grid.slice(y * size, (y + 1) * size).map(row => row.slice(x * size, (x + 1) * size)).join('/');
      const enhancement = enhancements.get(pattern).split('/');
      if (x === 0) {
        enchancedGrid.push(...enhancement);
      } else {
        const shift = enchancedGrid.length - enhancement.length;
        enhancement.forEach((row, i) => {
          enchancedGrid[shift + i] += row;
        });
      }
    }
  }
  return enchancedGrid;
};

const enhanceGridTimes = (input, iterations) => {
  let grid = '.#./..#/###'.split('/');
  for (let i = 0; i < iterations; i += 1) {
    const { length } = grid;
    if (length % 2 === 0) {
      grid = enhanceGrid(grid, input, 2);
    } else if (length % 3 === 0) {
      grid = enhanceGrid(grid, input, 3);
    }
  }
  return grid.map(row => row.split('').filter(cell => cell === '#').length).sum();
};

export const part1 = input => enhanceGridTimes(input, 5);

export const part2 = input => enhanceGridTimes(input, 18);
