export const formatInput = input => input.split('\n');

export const part1 = lines => {
  const dx = 3;
  const dy = 1;
  const repeat = lines[0].length;
  let x = dx;
  let y = dy;
  let trees = 0;

  do {
    if (lines[y][x > repeat ? x % repeat : x] === '#') {
      trees += 1;
    }

    x += dx;
    y += dy;
  } while (y < lines.length);

  return trees;
};

const findTrees = (dx, dy, lines) => {
  const repeat = lines[0].length;
  let x = dx;
  let y = dy;
  let trees = 0;

  do {
    if (lines[y][x >= repeat ? x % repeat : x] === '#') {
      trees += 1;
    }

    x += dx;
    y += dy;
  } while (y < lines.length);

  return trees;
};

export const part2 = lines => [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]
  .map(([dx, dy]) => findTrees(dx, dy, lines))
  .reduce((acc, count) => acc * count, 1);
