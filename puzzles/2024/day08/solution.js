export const formatInput = input => {
  const grid = input.toGrid();
  return [
    grid[0].length - 1,
    grid.length - 1,
    grid.flatMap((row, y) => row.map((cell, x) => (cell === '.' ? null : [cell, [x, y]])).filter(Boolean)),
  ];
};

function* findAntinodes(pos, dx, dy, maxX, maxY, any = false) {
  let [x, y] = pos;
  let count = 0;
  while (x >= 0 && x <= maxX && y >= 0 && y <= maxY && (any || count < 2)) {
    if (any || count > 0) {
      yield [x, y];
    }
    x += dx;
    y += dy;
    count += 1;
  }
}

function* findAllAntinodes([x1, y1], [x2, y2], maxX, maxY, any = false) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  yield* findAntinodes([x1, y1], -dx, -dy, maxX, maxY, any);
  yield* findAntinodes([x2, y2], dx, dy, maxX, maxY, any);
}

const countAntinodes = (maxX, maxY, antennas, any) => {
  const antinodes = new Set();
  for (const [[t1, n1], [t2, n2]] of antennas.combinations(2)) {
    if (t1 === t2) {
      for (const [x, y] of findAllAntinodes(n1, n2, maxX, maxY, any)) {
        antinodes.add(`${x}-${y}`);
      }
    }
  }
  return antinodes.size;
};

export const part1 = input => countAntinodes(...input);

export const part2 = input => countAntinodes(...input, true);
