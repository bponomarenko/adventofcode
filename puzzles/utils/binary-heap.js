/**
 * Example of a simple search algo with the goal of finding solution with the minimum score
 *
const findShortestPath = (grid, start, finish) => {
  const visited = new Set();
  const queue = new BinaryHeap(state => state.score, state => state.hash);
  queue.push({ pos: start, score: 0, hash: start.join('-') });

  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.pos === finish) {
     return state.score;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 3. Find next states
    for (...) {
      const newPos = ...;
      const hash = newPos.join('-');
      if (visited.has(hash)) {
        return;
      }
      const score = state.score + scoreChange;
      if (queue.has({ hash })) {
        const queuedItem = queue.get({ hash });
        if (score < queuedItem.score) {
          queuedItem.score = score;
          queue.reposition(queuedItem);
        }
      } else {
        queue.push({ pos: newPos, score, hash });
      }
    }
  }
  return null;
};
*/

export default class BinaryHeap {
  #getValue;
  #getHash;
  #heap = [];
  #cache = new Map();

  constructor(getValue, getHash) {
    this.#getValue = getValue || (node => node);
    this.#getHash = getHash || (node => node);
  }

  get size() {
    return this.#cache.size;
  }

  push(node) {
    const value = this.#getValue(node);
    let min = 0;
    let max = this.#heap.length;
    let half;

    while (min !== max && half !== 0) {
      half = (max - min) >> 1;
      const index = min + half;
      if (value <= this.#getValue(this.#heap[index])) {
        max = index;
      } else {
        min = index;
      }
    }
    this.#heap.splice(max, 0, node);
    this.#cache.set(this.#getHash(node), node);
  }

  reposition(node) {
    const index = this.#heap.indexOf(node);
    if (index === -1) {
      throw new Error('Specified node is not present in the heap');
    }
    this.#heap.splice(index, 1);
    this.push(node);
  }

  pop() {
    const node = this.#heap.shift();
    if (node) {
      this.#cache.delete(this.#getHash(node));
    }
    return node;
  }

  has(node) {
    return this.#cache.has(this.#getHash(node));
  }

  get(node) {
    return this.#cache.get(this.#getHash(node));
  }
}
