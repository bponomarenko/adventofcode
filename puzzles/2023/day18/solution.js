import { getRelativeCoord, getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.toGrid('\n', ' ').map(([dir, count, color]) => [
  dir,
  +count,
  color.slice(2, -1),
]);

const floodFill = path => {
  console.log(path);
  const filled = new Map([['0,0', 1]]);
  let x = 0;
  let y = 0;
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  path.forEach(([dir, count]) => {
    count *= 2; // make grid 2 times bigger so we can fill it more easily
    while (count) {
      [x, y] = getRelativeCoord(x, y, dir);
      [minX, maxX] = [Math.min(minX, x), Math.max(maxX, x)];
      [minY, maxY] = [Math.min(minY, y), Math.max(maxY, y)];
      filled.set(`${x},${y}`, 1);
      count -= 1;
    }
  });

  const limits = [[minX - 1, maxX + 1], [minY - 1, maxY + 1]];
  const queue = [[minX - 1, minY - 1]];
  while (queue.length) {
    const [dx, dy] = queue.shift();
    const hash = `${dx},${dy}`;
    if (!filled.has(hash)) {
      filled.set(hash, 2);
      queue.push(...getStraightAdjacent(dx, dy, ...limits));
    }
  }

  let count = 0;
  for (let dy = minY; dy <= maxY; dy += 1) {
    if (dy % 2 === 0) {
      for (let dx = minX; dx <= maxX; dx += 1) {
        if (dx % 2 === 0) {
          count += +(filled.get(`${dx},${dy}`) !== 2);
        }
      }
    }
  }
  return count;
};

export const part1 = input => floodFill(input);

const directions = ['R', 'D', 'L', 'U'];

export const part2 = input => floodFill(input.map(([,, color]) => [directions[+color.at(-1)], parseInt(color.slice(0, 5), 16)]));
