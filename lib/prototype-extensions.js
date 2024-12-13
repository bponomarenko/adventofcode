Array.prototype.sum = function sum(predicate = value => value) {
  return this.reduce((acc, value, i) => acc + predicate(value, i), 0);
};

Array.prototype.power = function power(predicate = value => value) {
  return this.reduce((acc, value) => acc * predicate(value), 1);
};

Array.prototype.combinations = function* combinations(size) {
  if (size < 2) {
    for (const value of this) {
      yield [value];
    }
  } else {
    for (let i = 0, max = this.length + 1 - size; i < max; i += 1) {
      const value = this[i];
      for (const combo of this.slice(i + 1).combinations(size - 1)) {
        yield [value, ...combo];
      }
    }
  }
};

Array.prototype.permutations = function* permutations(size) {
  let index = 0;
  for (const value of this) {
    if (size < 2) {
      yield [value];
    } else {
      for (const perm of this.toSpliced(index, 1).permutations(size - 1)) {
        yield [value, ...perm];
      }
    }
    index += 1;
  }
};

Array.prototype.slidingWindows = function* slidingWindows(size) {
  for (let i = 0, max = this.length - size + 1; i < max; i += size - 1) {
    yield this.slice(i, i + size);
  }
};

Array.prototype.rotateGrid = function rotateGrid(clockwise = true) {
  const rotatedGrid = [];
  const width = this[0].length;
  const height = this.length;
  for (let y = 0; y < width; y += 1) {
    rotatedGrid.push([]);
    for (let x = 0; x < height; x += 1) {
      rotatedGrid[y][x] = clockwise ? this[height - 1 - x][y] : this[x][y];
    }
  }
  return rotatedGrid;
};

Array.prototype.flipGrid = function flipGrid(byYAxis) {
  if (byYAxis) {
    return this.map(line => line.toReversed());
  }
  const lastIndex = this.length - 1;
  return this.map((_, i) => Array.from(this[lastIndex - i]));
};

Array.prototype.toGridString = function toGridString(rowSeparator = '\n', columnSeparator = '') {
  return this.map(row => row.join(columnSeparator)).join(rowSeparator);
};

Array.prototype.gridLimits = function gridLimits() {
  return [[0, this[0].length - 1], [0, this.length - 1]];
};

// LCM - Lowest Common Multiplier
Array.prototype.lcm = function lcm() {
  return this.reduce((acc, num) => {
    let hcf;
    for (let i = 1; i <= acc && i <= num; i += 1) {
      if (acc % i === 0 && num % i === 0) {
        hcf = i;
      }
    }
    return (acc * num) / hcf;
  }, 1);
};

Array.prototype.unique = function unique(predicate = value => value) {
  return Array.from(new Set(this.map(predicate)));
};

String.prototype.toGrid = function toGrid(rowSeparator = '\n', columnSeparator = '') {
  return this.split(rowSeparator).map(row => row.split(columnSeparator));
};
