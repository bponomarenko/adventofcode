import { getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => {
  let map = input.split('\n').map(line => line.split(''));
  // Trim the map - remove first line
  map.splice(0, 1);
  // remove last line
  map.splice(-1, 1);
  // remove first and last column
  map = map.map(line => line.slice(1, -1));
  return map;
};

const moveCost = { A: 1, B: 10, C: 100, D: 1000 };
const finishY = { A: 2, B: 4, C: 6, D: 8 };
const columnLetters = Object.fromEntries(Object.entries(finishY).map(entry => entry.reverse()));
const columnIndexesArr = Object.values(finishY);
let adjacent;

const populateAdjacent = map => {
  // populate adjacent elements map
  adjacent = map.map((line, x) => line.map((char, y) => getStraightAdjacent(map, x, y).filter(([dx, dy]) => map[dx][dy] !== '#')));
};

const getPositions = (count, map, x, y, dx, dy) => adjacent[x][y]
  .filter(([x1, y1]) => (dx !== x1 || dy !== y1) && map[x1][y1] === '.')
  .flatMap(([x1, y1]) => [[x1, y1, count]].concat(getPositions(count + 1, map, x1, y1, x, y)));

class Field {
  #notInPlace = null;

  #state = null;

  constructor(map, energy) {
    this.energy = energy;
    this.map = map.map(line => Array.from(line));
    this.size = this.map.length;
    this.columnLetters = [];
  }

  get state() {
    if (!this.#state) {
      this.#state = this.map.map(line => line.join('')).join('\n');
    }
    return this.#state;
  }

  get notInPlace() {
    if (this.#notInPlace == null) {
      this.#notInPlace = columnIndexesArr.reduce((acc, y) => acc + this.countEmptyLetters(y) + this.countInvalidLetters(y), 0);
    }
    return this.#notInPlace;
  }

  get score() {
    return this.energy + this.notInPlace;
  }

  get finished() {
    return this.notInPlace === 0;
  }

  clone() {
    return new Field(this.map, this.energy);
  }

  move(char, x1, y1, x2, y2, count) {
    this.energy += moveCost[char] * count;
    // switch elements
    [this.map[x2][y2], this.map[x1][y1]] = [this.map[x1][y1], this.map[x2][y2]];
  }

  countLetters(y) {
    if (!this.columnLetters[y]) {
      // [empty, invalid]
      const letters = [0, 0];
      const columnLetter = columnLetters[y];
      for (let i = 1; i < this.size; i += 1) {
        const char = this.map[i][y];
        if (char === '.') {
          letters[0] += 1;
        } else if (char !== columnLetter) {
          letters[1] += 1;
        }
      }
      this.columnLetters[y] = letters;
    }
    return this.columnLetters[y];
  }

  countEmptyLetters(y) {
    return this.countLetters(y)[0];
  }

  countInvalidLetters(y) {
    return this.countLetters(y)[1];
  }

  generateNextFields() {
    const fields = [];

    this.map.forEach((line, x) => line.forEach((char, y) => {
      // Can only move letters
      if (char === '.' || char === '#') {
        return;
      }

      // don't move char if it is on the finish column
      if (x > 0 && this.countInvalidLetters(y) === 0) {
        return;
      }

      // Find possible next fields
      getPositions(1, this.map, x, y).forEach(([x1, y1, count]) => {
        if (x === 0) {
          // Can only move to own room from the hallway
          if (x1 === 0 || finishY[char] !== y1) {
            return;
          }

          // Can't move in the room when there is another letter
          if (this.countInvalidLetters(y1) > 0) {
            return;
          }
          // Don't stop above the empty field
          if (x1 > 0 && x1 < this.size - 1 && this.map[x1 + 1][y] === '.') {
            return;
          }
        } else if (x1 !== 0 || columnIndexesArr.includes(y1)) {
          // Can only move to the hallway, but not right above the rooms
          return;
        }

        const newField = this.clone();
        newField.move(char, x, y, x1, y1, count);
        fields.push(newField);
      });
    }));
    return fields;
  }
}

const sortAmphipods = input => {
  const startField = new Field(input, 0);
  const queue = new Map([[startField.state, startField]]);
  const visited = new Set([]);

  while (queue.size) {
    // 1. Get next state
    let min = Infinity;
    let fieldState;
    for (const [state, field] of queue) {
      const h = field.score;
      if (h < min) {
        fieldState = state;
        min = h;
      }
    }

    const field = queue.get(fieldState);
    queue.delete(fieldState);

    // 2. Check if we found the node
    if (field.finished) {
      return field.energy;
    }

    // 3. Mark it as visited
    visited.add(field.state);

    // 4. Find next steps
    field.generateNextFields().forEach(nextField => {
      if (!visited.has(nextField.state)) {
        if (queue.has(nextField.state)) {
          const queuedField = queue.get(nextField.state);
          if (nextField.energy < queuedField.energy) {
            queuedField.energy = nextField.energy;
          }
        } else {
          queue.set(nextField.state, nextField);
        }
      }
    });
  }
  return null;
};

export const part1 = input => {
  populateAdjacent(input);
  return sortAmphipods(input);
};

export const part2 = input => {
  input.splice(2, 0, ...'##D#C#B#A##\n##D#B#A#C##'.split('\n').map(line => line.split('')));
  populateAdjacent(input);
  return sortAmphipods(input);
};
