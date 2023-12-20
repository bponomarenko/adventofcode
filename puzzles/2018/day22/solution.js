import { getDistance, getStraightAdjacent } from '../../utils/grid.js';
import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => {
  const [depth, target] = input.split('\n');
  return [+depth.split(': ')[1], target.split(': ')[1].split(',').map(Number)];
};

const getGeologicIndex = (x, y, target, depth, memo) => {
  if ((x === 0 && y === 0) || (x === target[0] && y === target[1])) {
    return 0;
  }
  if (x === 0) {
    return y * 48271;
  }
  if (y === 0) {
    return x * 16807;
  }
  // eslint-disable-next-line no-use-before-define
  return getErosionLevel(x - 1, y, target, depth, memo) * getErosionLevel(x, y - 1, target, depth, memo);
};

const getErosionLevel = (x, y, target, depth, memo) => {
  const hash = `${x},${y}`;
  if (!memo.has(hash)) {
    memo.set(hash, [(getGeologicIndex(x, y, target, depth, memo) + depth) % 20183]);
  }
  return memo.get(hash)[0];
};

const getType = (x, y, target, depth, memo) => getErosionLevel(x, y, target, depth, memo) % 3;

export const part1 = ([depth, target]) => {
  const memo = new Map();
  let riskLevel = 0;
  for (let x = 0; x <= target[0]; x += 1) {
    for (let y = 0; y <= target[1]; y += 1) {
      riskLevel += getType(x, y, target, depth, memo);
    }
  }
  return riskLevel;
};

const tools = [
  ['c', 't'], // rocky
  ['c', 'n'], // wet
  ['t', 'n'], // narrow
];
const canEnter = (type, tool) => tools[type].includes(tool);

export const part2 = ([depth, target]) => {
  const limits = [[0, Infinity], [0, Infinity]];
  const visited = new Set();
  const memo = new Map();
  const queue = new BinaryHeap(({ time, x, y, tool }) => time + getDistance([x, y], target) + (tool !== 't') * 7, state => state.hash);
  queue.push({
    x: 0, y: 0, time: 0, tool: 't', type: 0, hash: '0,0,t',
  });

  while (queue.size) {
  // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.x === target[0] && state.y === target[1]) {
      return state.time + (state.tool !== 't') * 7;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 3. Find next states
    getStraightAdjacent(state.x, state.y, ...limits).forEach(([x, y]) => {
      let newState = { x, y, type: getType(x, y, target, depth, memo) };
      if (canEnter(newState.type, state.tool)) {
        newState = { ...newState, time: state.time + 1, tool: state.tool, hash: `${x},${y},${state.tool}` };
      } else {
        const tool = tools[newState.type].find(t => tools[state.type].includes(t));
        newState = { ...newState, time: state.time + 8, tool, hash: `${x},${y},${tool}` };
      }

      if (visited.has(newState.hash)) {
        return;
      }

      if (queue.has(newState)) {
        const queuedField = queue.get(newState);
        if (newState.time < queuedField.time) {
          queuedField.time = newState.time;
          queue.reposition(queuedField);
        }
      } else {
        queue.push(newState);
      }
    });
  }
  return null;
};
