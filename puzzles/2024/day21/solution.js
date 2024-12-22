export const formatInput = input => input.split('\n');

const codePadMoves = {
  A: [['0', 'l'], ['3', 'u']],
  0: [['A', 'r'], ['2', 'u']],
  1: [['2', 'r'], ['4', 'u']],
  2: [['3', 'r'], ['5', 'u'], ['1', 'l'], ['0', 'd']],
  3: [['2', 'l'], ['6', 'u'], ['A', 'd']],
  4: [['5', 'r'], ['7', 'u'], ['1', 'd']],
  5: [['6', 'r'], ['8', 'u'], ['4', 'l'], ['2', 'd']],
  6: [['5', 'l'], ['9', 'u'], ['3', 'd']],
  7: [['8', 'r'], ['4', 'd']],
  8: [['9', 'r'], ['5', 'd'], ['7', 'l']],
  9: [['8', 'l'], ['6', 'd']],
};
const dirPadMoves = {
  A: [['u', 'l'], ['r', 'd']],
  u: [['A', 'r'], ['d', 'd']],
  r: [['A', 'u'], ['d', 'l']],
  l: [['d', 'r']],
  d: [['l', 'l'], ['r', 'r'], ['u', 'u']],
};

const findShortestPaths = (a, b, padMoves) => {
  if (a === b) {
    return ['A'];
  }
  const queue = [[a, a, '']];
  let shortest = [];
  while (queue.length) {
    let [code, moves, path] = queue.shift();
    if (code === b) {
      path = `${path}A`;
      if (shortest.length) {
        const min = shortest[0].length;
        if (path.length === min) {
          shortest.push(path);
        } else if (path.length < min) {
          shortest = [path];
        }
      } else {
        shortest.push(path);
      }
    }
    padMoves[code].forEach(([nextCode, move]) => {
      if (!moves.includes(nextCode)) {
        queue.push([nextCode, `${moves}${nextCode}`, `${path}${move}`]);
      }
    });
  }
  return shortest;
};

const memory = new Map();

const findShortestPath = (str, maxLevel, level = maxLevel) => {
  const path = [];
  for (const [a, b] of ['A', ...str].slidingWindows(2)) {
    const hash = `${a}-${b}-${level}`;
    if (!memory.has(hash)) {
      let paths = findShortestPaths(a, b, level === maxLevel ? codePadMoves : dirPadMoves);
      memory.set(hash, level > 0 ? Math.min(...paths.map(shortPath => findShortestPath(shortPath, maxLevel, level - 1))) : paths[0].length);
    }
    path.push(memory.get(hash));
  }
  return path.sum();
};

const getComplexity = (input, countKeypads) => input.sum(code => findShortestPath(code, countKeypads) * +code.replace('A', ''));

export const part1 = input => getComplexity(input, 2);

export const part2 = input => getComplexity(input, 25);
