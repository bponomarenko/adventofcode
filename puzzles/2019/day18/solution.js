// lower cased chars are between 97 & 122
import BinaryHeap from '../../utils/binary-heap.js';
import { getStraightAdjacent } from '../../utils/grid.js';

const isKey = tile => tile.charCodeAt(0) >= 97;
const keyCode = key => 2 ** (key.charCodeAt(0) - 97);

export const formatInput = input => {
  const grid = input.toGrid();
  const keys = new Map();
  let start;
  grid.forEach((row, y) => row.forEach((tile, x) => {
    if (tile === '#' || tile === '.') {
      return;
    }
    if (tile === '@') {
      start = [x, y];
      grid[y][x] = '.';
      return;
    }
    if (isKey(tile)) {
      keys.set(keyCode(tile), [x, y]);
      grid[y][x] = '.';
    } else {
      grid[y][x] = keyCode(tile.toLowerCase());
    }
  }));
  return [grid, start, keys];
};

const findShortestPath = (grid, start, finish, keys) => {
  finish = finish.join('-');
  const visited = new Set();
  const queue = new BinaryHeap(state => state.length, state => state.hash);
  queue.push({ pos: start, length: 0, hash: start.join('-') });

  while (queue.size) {
    const state = queue.pop();
    if (state.hash === finish) {
      return state.length;
    }
    visited.add(state.hash);

    getStraightAdjacent(...state.pos).forEach(([x, y]) => {
      const hash = `${x}-${y}`;
      if (visited.has(hash)) {
        return;
      }
      const tile = grid[y][x];
      if (tile !== '.' && !(keys & tile)) {
        return;
      }
      const length = state.length + 1;
      if (queue.has({ hash })) {
        const queuedItem = queue.get({ hash });
        if (length < queuedItem.length) {
          queuedItem.length = length;
          queue.reposition(queuedItem);
        }
      } else {
        queue.push({ pos: [x, y], length, hash });
      }
    });
  }
  return 0;
};

export const part1 = ([grid, start, keysPos]) => {
  const keys = Array.from(keysPos.keys());
  const allKeys = keys.reduce((acc, key) => acc | key, 0);
  const visited = new Set();
  const queue = new BinaryHeap(state => state.length, state => state.hash);
  queue.push({ pos: start, keys: 0, length: 0, hash: `${start.join('-')}-0` });

  while (queue.size) {
    const state = queue.pop();
    if (state.keys === allKeys) {
      return state.length;
    }
    visited.add(state.hash);

    keys.forEach(key => {
      if (state.keys & key) {
        return;
      }
      const [x, y] = keysPos.get(key);
      const newKeys = state.keys | key;
      const hash = `${x}-${y}-${newKeys}`;
      if (visited.has(hash)) {
        return;
      }
      const length = state.length + findShortestPath(grid, state.pos, [x, y], state.keys);
      if (length === state.length) {
        return;
      }

      if (queue.has({ hash })) {
        const queuedItem = queue.get({ hash });
        if (length < queuedItem.length) {
          queuedItem.length = length;
          queue.reposition(queuedItem);
        }
      } else {
        queue.push({ pos: [x, y], keys: newKeys, length, hash });
      }
    });
  }
  return null;
};

export const part2 = input => {
  console.log(input);
  return null;
};
