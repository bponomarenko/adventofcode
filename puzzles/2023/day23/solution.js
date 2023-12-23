import { getRelativeCoord, getNormalisedDirection, changeDirection } from '../../utils/grid.js';
import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => input.split('\n');

const directions = ['n', 'e', 's', 'w'];

const findAllNodes = (grid, withSlopes) => {
  const queue = [{ x: 1, y: 0, hash: '1,0', dir: 's' }];
  const nodes = { [queue[0].hash]: new Map() };

  while (queue.length) {
    const path = [];
    let { x, y, hash, dir } = queue.shift();
    let blockedReverse = false;
    let blockedForward = false;

    for (;;) {
      const [nx, ny] = getRelativeCoord(x, y, dir);
      path.push(`${nx},${ny}`);

      if (withSlopes) {
        const tile = grid[ny][nx];
        if (tile !== '.') {
          if (getNormalisedDirection(tile) === dir) {
            blockedReverse = true;
          } else {
            blockedForward = true;
          }
        }
      }

      const dirOptions = directions.filter(nextDir => {
        const [dx, dy] = getRelativeCoord(nx, ny, nextDir);
        const tile = grid[dy]?.[dx];
        return tile && tile !== '#' && changeDirection(nextDir, 180) !== dir;
      });

      if (dirOptions.length !== 1) {
        // intersection!
        const nHash = `${nx},${ny}`;
        if (!nodes[nHash]) {
          nodes[nHash] = new Map();
          dirOptions.forEach(opt => {
            queue.push({ x: nx, y: ny, hash: nHash, dir: opt });
          });
        }

        if (!blockedReverse) {
          nodes[nHash].set(hash, path.length);
        }
        if (!blockedForward) {
          nodes[hash].set(nHash, path.length);
        }
        break;
      }
      // no intersection – continue following the path
      dir = dirOptions[0];
      [x, y] = [nx, ny];
    }
  }
  const entries = Object.entries(nodes)
    .map(([name, nextNodes]) => [name, Array.from(nextNodes.entries()).map(([n, l]) => ({ node: n, length: l }))]);
  return Object.fromEntries(entries);
};

const sumAllNodes = nodes => {
  const memo = new Set();
  return Object.entries(nodes).flatMap(([start, nextNodes]) => nextNodes.map(({ node, length }) => {
    if (memo.has(`${start}-${node}`)) {
      return 0;
    }
    memo.add(`${start}-${node}`).add(`${node}-${start}`);
    return length;
  })).sum();
};

const findLongestPath = (grid, withSlopes) => {
  // convert grid to a bi-directional graph with start/end/intersections as nodes
  const nodes = findAllNodes(grid, withSlopes);
  const allNodes = sumAllNodes(nodes);
  const finish = `${grid[0].length - 2},${grid.length - 1}`;
  const lastIntersection = Object.entries(nodes).find(([, nextNodes]) => nextNodes.some(({ node }) => node === finish))[0];
  const queue = new BinaryHeap(state => allNodes - state.length, state => state.node);
  queue.push({ node: '1,0', path: [], length: 0, remaining: allNodes, eliminated: new Set() });

  // Find the longest path through the graph
  let maxLength = 0;
  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.node === finish) {
      maxLength = Math.max(maxLength, state.length);
      continue;
    }

    let remaining = state.remaining;
    const eliminated = new Set(state.eliminated);
    nodes[state.node].forEach(({ node, length }) => {
      if (eliminated.has(`${state.node},${node}`)) {
        return;
      }
      eliminated.add(`${state.node},${node}`).add(`${node},${state.node}`);
      remaining -= length;
    });

    // 3. Find next states
    nodes[state.node].forEach(({ node, length }) => {
      if (state.path.includes(node) || (state.node === lastIntersection && node !== finish) || (state.length + length + remaining) < maxLength) {
        return;
      }
      queue.push({ node, path: state.path.concat(node), length: state.length + length, remaining, eliminated });
    });
  }
  return maxLength;
};

export const part1 = input => findLongestPath(input, true);

export const part2 = input => findLongestPath(input);
