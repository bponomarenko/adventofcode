export const formatInput = input => input.split('\n').map(line => line.split(' ').map(p => p.slice(2).split(',').map(Number)));

const getSafetyFactor = (positions, width, height) => {
  const quadrants = [0, 0, 0, 0];
  const mw = (width - 1) / 2;
  const mh = (height - 1) / 2;
  positions.forEach(p => {
    if (p[0] < mw) {
      if (p[1] < mh) {
        quadrants[0] += 1;
      } else if (p[1] > mh) {
        quadrants[1] += 1;
      }
    } else if (p[0] > mw) {
      if (p[1] < mh) {
        quadrants[2] += 1;
      } else if (p[1] > mh) {
        quadrants[3] += 1;
      }
    }
  });
  return quadrants.mul();
};

const getSize = robots => [
  Math.max(...robots.map(([p]) => p[0])) + 1,
  Math.max(...robots.map(([p]) => p[1])) + 1,
];

const simulate = (robots, width, height, seconds = 100) => robots.map(([[x, y], [dx, dy]]) => {
  const nx = (x + dx * seconds) % width;
  const ny = (y + dy * seconds) % height;
  return [nx < 0 ? width + nx : nx, ny < 0 ? height + ny : ny];
});

export const part1 = input => {
  const [width, height] = getSize(input);
  const positions = simulate(input, width, height);
  return getSafetyFactor(positions, width, height);
};

export const part2 = async input => {
  const [width, height] = getSize(input);
  let count = 0;
  while (count < 10000) {
    count += 1;
    const grid = [];
    simulate(input, width, height, count).forEach(([x, y]) => {
      if (!grid[y]) {
        grid[y] = [];
      }
      grid[y].push(x);
    });

    // Search for the frame around the christmas tree instead of the full pattern
    const rows = grid.filter(line => line.unique().length >= 32);
    if (rows.length > 0) {
      const lines = rows.filter(row => {
        const sorted = row.unique().toSorted((a, b) => a - b);
        const diff = sorted.map((num, i) => (i === 0 ? 0 : num - sorted[i - 1]));
        return diff.filter(num => num === 1).length >= 30;
      });
      if (lines.length === 2) {
        break;
      }
    }
  }
  return count;
};
