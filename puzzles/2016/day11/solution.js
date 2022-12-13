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
const sort = items => items.sort((a, b) => a - b);

class State {
  #snapshot;
  #heuristic;

  constructor(el, floors, steps) {
    this.el = el;
    this.floors = floors;
    this.steps = steps;
  }

  get score() {
    return this.steps + this.heuristic / 100;
  }

  get heuristic() {
    if (!this.#heuristic) {
      this.#heuristic = this.floors.reduce((acc, items, i) => acc + items.length * (lastFloor - i) ** 2, 0);
    }
    return this.#heuristic;
  }

  get snapshot() {
    if (!this.#snapshot) {
      const typeMap = new Map();
      let counter = 1;
      const floors = this.floors.map(items => items.map(item => {
        const type = Math.abs(item);
        if (!typeMap.has(type)) {
          typeMap.set(type, counter);
          counter += 1;
        }
        return typeMap.get(type) * (item > 0 ? 1 : -1);
      }).join(','));

      this.#snapshot = [this.el].concat(floors).join('|');
    }
    return this.#snapshot;
  }

  get finished() {
    return !this.floors[0].length && !this.floors[1].length && !this.floors[2].length;
  }

  canGoToFloor(floorIndex, combo) {
    const items = this.floors[floorIndex];
    // Empty floor? No problems!
    if (!items.length) {
      return true;
    }

    const allItems = combo.concat(items);
    // Make sure all elements are compatible between each other.
    return allItems.every(item => item < 0 || allItems.some(subItem => (subItem + item === 0) && subItem < 0));
  }

  clone(floorIndex, combo) {
    const floors = this.floors.map((floor, i) => {
      if (i === floorIndex) {
        return sort([...floor, ...combo]);
      }
      const items = i === this.el ? floor.filter(item => !combo.includes(item)) : Array.from(floor);
      return sort([...items]);
    });
    return new State(floorIndex, floors, this.steps + 1);
  }

  generateNextStates() {
    const items = this.floors[this.el];
    if (!items.length) {
      return [];
    }

    const componentCombos = [];
    const canMoveUp = this.el < lastFloor;
    const shouldMoveDown = this.el > 0 && this.floors.some((floor, i) => floor.length > 0 && i < this.el);

    // get component combinations
    for (let i = 0; i < items.length; i += 1) {
      const item1 = items[i];
      const canMoveItemDown = shouldMoveDown && this.canGoToFloor(this.el - 1, [item1]);
      let canMoveTwoItemsUp = false;

      for (let j = i + 1; j < items.length; j += 1) {
        const item2 = items[j];
        // try to go with two of them (if compatible)
        // if name the same, they are of the matching group
        // if not – check if the type is the same
        if ((item1 + item2 === 0) || (item1 < 0 && item2 < 0)) {
          if (canMoveUp && this.canGoToFloor(this.el + 1, [item1, item2])) {
            componentCombos.push(this.clone(this.el + 1, [item1, item2]));
            canMoveTwoItemsUp = true;
          } else if (!canMoveItemDown && shouldMoveDown && this.canGoToFloor(this.el - 1, [item1, item2])) {
            componentCombos.push(this.clone(this.el - 1, [item1, item2]));
          }
        }
      }

      // ...or try to go with a single component
      if (!canMoveTwoItemsUp && canMoveUp && this.canGoToFloor(this.el + 1, [item1])) {
        componentCombos.push(this.clone(this.el + 1, [item1]));
      }
      if (canMoveItemDown) {
        componentCombos.push(this.clone(this.el - 1, [item1]));
      }
    }
    return componentCombos;
  }
}

const mapToFloors = floors => {
  const numMap = new Map();
  let num = 1;
  return floors.map(items => sort(items.map(([name, type]) => {
    if (!numMap.has(name)) {
      numMap.set(name, num);
      num += 1;
    }
    return numMap.get(name) * (type === 'generator' ? -1 : 1);
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
