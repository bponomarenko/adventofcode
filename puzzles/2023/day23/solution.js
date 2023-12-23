import { getRelativeCoord, getNormalisedDirection, changeDirection } from '../../utils/grid.js';
import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => input.split('\n');

const directions = ['n', 'e', 's', 'w'];

const findLongestPath = grid => {
  const finishX = grid[0].length - 2;
  const finishY = grid.length - 1;
  const rectSize = finishX * finishY;
  const queue = new BinaryHeap(state => rectSize - state.path.length, state => state.hash);
  queue.push({ x: 1, y: 0, hash: '1,0', path: [] });

  let maxLength = 0;
  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.x === finishX && state.y === finishY) {
      maxLength = Math.max(maxLength, state.path.length);
      continue;
    }

    // 3. Find next states
    directions.forEach(dir => {
      const [x, y] = getRelativeCoord(state.x, state.y, dir);
      const tile = grid[y]?.[x];
      if (!tile || tile === '#') {
        return;
      }

      const hash = `${x},${y}`;
      if (state.path.includes(hash)) {
        return;
      }

      let newState;
      if (tile === '.') {
        // regular tile – just step on it
        newState = { x, y, hash, path: state.path.concat(hash) };
      } else {
        const slope = getNormalisedDirection(tile);
        // if opposite direction – don't move as we'll just stay on the same tile
        if (changeDirection(dir, 180) !== slope) {
          const [sx, sy] = getRelativeCoord(x, y, slope);
          const sHash = `${sx},${sy}`;
          if (!state.path.includes(sHash)) {
            newState = { x: sx, y: sy, hash: sHash, slopeHash: hash, path: state.path.concat(hash, sHash) };
          }
        }
      }

      if (newState) {
        queue.push(newState);
      }
    });
  }
  return maxLength;
};

export const part1 = input => findLongestPath(input);

export const part2 = input => findLongestPath(input.map(row => row.replaceAll(/[^.#]/g, '.')));
