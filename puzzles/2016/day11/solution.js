import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => input.split('\n').map(floor => {
  const [, content] = floor.slice(0, -1).split(' contains ');
  if (content === 'nothing relevant') {
    return [];
  }
  return content.split(/,?\sand\s|,\s/).map(item => {
    const [, name, component] = item.split(' ');
    return [name.split('-')[0], component];
  });
});

const lastFloor = 3;

const isGenerator = item => (item & 1) === 1;
const isSameName = (item1, item2) => (item1 >> 1) === (item2 >> 1);
// if name the same, they are of the matching group
// if not – check if the type is the same
const isCompatible = (item1, item2) => isSameName(item1, item2) || isGenerator(item1) === isGenerator(item2);

class Floor {
  #snapshot;

  constructor(items) {
    this.items = items;
  }

  get snapshot() {
    if (!this.#snapshot) {
      this.#snapshot = this.items.sort().join(',');
    }
    return this.#snapshot;
  }

  get empty() {
    return this.items.length === 0;
  }

  clone() {
    return new Floor(Array.from(this.items));
  }
}

class State {
  #snapshot;
  #heuristic;

  constructor(el, floors, steps) {
    this.el = el;
    this.floors = floors;
    this.steps = steps;
  }

  get score() {
    return this.steps + this.heuristic;
  }

  get heuristic() {
    if (!this.#heuristic) {
      this.#heuristic = this.floors.reduce((acc, floor, i) => acc + floor.items.length * (lastFloor - i), 0);
    }
    return this.#heuristic;
  }

  get snapshot() {
    if (!this.#snapshot) {
      this.#snapshot = `${this.el}|${this.floors.map(floor => floor.snapshot).join('|')}`;
    }
    return this.#snapshot;
  }

  get finished() {
    return this.floors.slice(0, -1).every(floor => floor.empty);
  }

  canGoToFloor(floorIndex, combo) {
    const floor = this.floors[floorIndex];
    // Empty floor? No problems!
    if (floor.empty) {
      return true;
    }

    const allItems = combo.concat(floor.items);
    // Make sure all elements are compatible between each other.
    return allItems.every(item => isGenerator(item) || allItems.some(subItem => isSameName(subItem, item) && isGenerator(subItem)));
  }

  clone(floorIndex, combo) {
    const state = new State(floorIndex, this.floors.map(floor => floor.clone()), this.steps + 1);
    state.floors[this.el].items = state.floors[this.el].items.filter(item => !combo.includes(item));
    state.floors[floorIndex].items.push(...combo);
    return state;
  }

  generateNextStates() {
    const floor = this.floors[this.el];
    if (floor.empty) {
      return [];
    }

    // get component combinations
    const count = floor.items.length;
    const componentCombos = [];
    for (let i = 0; i < count; i += 1) {
      // try to go with a single component
      componentCombos.push([floor.items[i]]);
      for (let j = i + 1; j < count; j += 1) {
        // ...or with two of them (if compatible)
        if (isCompatible(floor.items[i], floor.items[j])) {
          componentCombos.push([floor.items[i], floor.items[j]]);
        }
      }
    }

    // Convert combination to a future state, if compatible
    return componentCombos
      .flatMap(combo => [
        this.el < lastFloor && this.canGoToFloor(this.el + 1, combo) && this.clone(this.el + 1, combo),
        this.el > 0 && this.canGoToFloor(this.el - 1, combo) && this.clone(this.el - 1, combo),
      ])
      .filter(Boolean);
  }
}

const mapToFloors = floors => {
  const numMap = new Map();
  let num = 1;
  return floors.map(items => new Floor(items.map(([name, type]) => {
    if (!numMap.has(name)) {
      numMap.set(name, num);
      num += 1;
    }
    return (numMap.get(name) << 1) + (type === 'generator' ? 1 : 0);
  })));
};

const countSteps = floors => {
  const initialState = new State(0, mapToFloors(floors), 0);
  const queue = new BinaryHeap(state => state.score, state => state.snapshot);
  queue.push(initialState);
  const visited = new Set([]);

  while (queue.size) {
    // 1. Get next field
    const state = queue.pop();

    // 2. Check if we found the node
    if (state.finished) {
      return state.steps;
    }

    // 3. Mark it as visited
    visited.add(state.snapshot);

    // 4. Find next steps
    state.generateNextStates().forEach(nextState => {
      if (!visited.has(nextState.snapshot)) {
        if (queue.has(nextState)) {
          const queuedField = queue.get(nextState);
          if (nextState.steps < queuedField.steps) {
            queuedField.steps = nextState.steps;
            queue.reposition(queuedField);
          }
        } else {
          queue.push(nextState);
        }
      }
    });
  }
  return null;
};

export const part1 = input => countSteps(input);

export const part2 = input => {
  input[0].push(
    ['elerium', 'generator'],
    ['elerium', 'microchip'],
    ['dilithium', 'generator'],
    ['dilithium', 'microchip'],
  );
  return countSteps(input);
};
