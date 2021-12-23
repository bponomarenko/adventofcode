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
    this.#cache.delete(this.#getHash(node));
    return node;
  }

  has(node) {
    return this.#cache.has(this.#getHash(node));
  }

  get(node) {
    return this.#cache.get(this.#getHash(node));
  }
}
