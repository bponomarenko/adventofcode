export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

const getAdjacent = (x, y) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];

const getValue = (input, x, y, optional) => input[x]?.[y] ?? optional;

const getLowPoints = input => {
  const lowPoints = [];

  for (let i = 0; i < input.length; i += 1) {
    const line = input[i];

    for (let j = 0; j < line.length; j += 1) {
      const value = line[j];

      if (getAdjacent(i, j).every(([x, y]) => value < getValue(input, x, y, Infinity))) {
        lowPoints.push([i, j]);
      }
    }
  }
  return lowPoints;
};

export const part1 = input => getLowPoints(input).reduce((acc, [x, y]) => acc + input[x][y] + 1, 0);

export const part2 = input => {
  const lowPoints = getLowPoints(input);
  const visited = new Set();

  const isNotBorder = ([x, y]) => {
    if (visited.has(`${x}-${y}`)) {
      return false;
    }
    const value = getValue(input, x, y);
    return value != null && value !== 9;
  };

  const getSize = ([x, y]) => {
    let size = isNotBorder([x, y]) ? 1 : 0;
    if (size) {
      // Mark as "visited"
      visited.add(`${x}-${y}`);
    }
    return size + getAdjacent(x, y).reduce((acc, point) => acc + (isNotBorder(point) ? getSize(point) : 0), 0);
  };

  return lowPoints.map(point => getSize(point)).sort((a, b) => a - b).slice(-3).reduce((acc, num) => acc * num, 1);
};
