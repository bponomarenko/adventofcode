import { getDistance, getStraightAdjacent } from '../../utils/grid.js';
import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => {
  const lines = input.split('\n');
  const blizzards = { x: new Map(), y: new Map() };
  lines.forEach((row, y) => row.split('').forEach((tile, x) => {
    if (tile !== '#' && tile !== '.') {
      const targetMap = tile === '>' || tile === '<' ? blizzards.y : blizzards.x;
      const key = (tile === '>' || tile === '<' ? y : x) - 1;
      if (!targetMap.has(key)) {
        targetMap.set(key, []);
      }
      targetMap.get(key).push({ x: x - 1, y: y - 1, type: tile });
    }
  }));
  return { blizzards, height: lines.length - 2, width: lines[0].length - 2 };
};

const willOverlap = (ex, ey, time, blizzards, w, h) => blizzards.some(({ x, y, type }) => {
  switch (type) {
    case '>':
      return (x + time) % w === ex && y === ey;
    case '<':
      return w - ((w - 1 - x + time) % w) - 1 === ex && y === ey;
    case '^':
      return x === ex && h - ((h - 1 - y + time) % h) - 1 === ey;
    case 'v':
      return x === ex && (y + time) % h === ey;
    default:
      return false;
  }
});

const willHaveBlizzard = (ex, ey, time, { x, y }, w, h) => willOverlap(ex, ey, time, x.get(ex) ?? [], w, h)
  || willOverlap(ex, ey, time, y.get(ey) ?? [], w, h);

const findShortestPath = ([sx, sy], [fx, fy], startTime, { blizzards, width, height }) => {
  const limits = [[0, width - 1], [0, height - 1]];
  const visited = new Set();
  const queue = new BinaryHeap(state => state.time + getDistance([state.x, state.y], [fx, fy]), state => state.hash);
  queue.push({ x: sx, y: sy, time: startTime, hash: `${startTime}|${sx},${sy}`, path: [] });

  let mins = Infinity;
  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.x === fx && state.y === fy) {
      mins = Math.min(state.time, mins);
      continue;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 3. Find next states
    const nextPositions = getStraightAdjacent(state.x, state.y, ...limits)
      .concat([[state.x, state.y]])
      .filter(([x, y]) => !willHaveBlizzard(x, y, state.time + 1, blizzards, width, height));

    nextPositions.forEach(([x, y]) => {
      const time = state.time + 1;
      const hash = `${time}|${x},${y}`;
      if (!visited.has(hash) && !queue.has({ hash }) && (time + getDistance([x, y], [fx, fy])) < mins) {
        queue.push({ time, x, y, hash, path: state.path.concat(`${x},${y}`) });
      }
    });
  }
  return mins + 1;
};

export const part1 = input => findShortestPath([0, -1], [input.width - 1, input.height - 1], 0, input);

export const part2 = input => {
  let time = findShortestPath([0, -1], [input.width - 1, input.height - 1], 0, input);
  time = findShortestPath([input.width - 1, input.height], [0, 0], time, input);
  return findShortestPath([0, -1], [input.width - 1, input.height - 1], time, input);
};
