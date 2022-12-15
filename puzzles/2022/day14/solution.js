export const formatInput = input => input.split('\n').map(line => line.split(' -> ').map(coord => coord.split(',').map(Number)));

const findRocks = lines => {
  const rocks = new Set();
  let leftX = Infinity;
  let rightX = -Infinity;
  let bottomY = -Infinity;

  lines.forEach(line => {
    for (let i = 1; i < line.length; i += 1) {
      const [xs, ys] = line[i - 1];
      const [xe, ye] = line[i];
      leftX = Math.min(leftX, xs, xe);
      rightX = Math.max(rightX, xs, xe);
      bottomY = Math.max(bottomY, ys + 2, ye + 2);

      if (xs === xe) {
        // move by Y
        for (let dy = 0, my = Math.abs(ys - ye); dy <= my; dy += 1) {
          rocks.add(`${xs},${ys < ye ? ys + dy : ys - dy}`);
        }
      } else if (ys === ye) {
        // move by X
        for (let dx = 0, mx = Math.abs(xs - xe); dx <= mx; dx += 1) {
          rocks.add(`${xs < xe ? xs + dx : xs - dx},${ys}`);
        }
      }
    }
  });
  return { rocks, leftX, rightX, bottomY };
};

const findStartY = rocks => Array.from(rocks)
  .map(line => (line.startsWith('500,') ? +line.split(',')[1] : null))
  .filter(Boolean)
  .sort((a, b) => a - b)[0] - 1;

const fillSand = (input, checkLimits = true) => {
  const { rocks, leftX, rightX, bottomY } = findRocks(input);
  const start = [500, findStartY(rocks)];

  const isInbound = (x, y) => y > 0 && (checkLimits ? x >= leftX && x <= rightX && y < (bottomY - 2) : true);
  const isFree = (x, y) => y !== bottomY && !rocks.has(`${x},${y}`);
  let count = checkLimits ? 0 : 1;

  for (;;) {
    let [x, y] = start;
    for (;;) {
      if (isFree(x, y + 1)) {
        // down
        y += 1;
      } else if (isFree(x - 1, y + 1)) {
        // left
        x -= 1;
        y += 1;
      } else if (isFree(x + 1, y + 1)) {
        // right
        x += 1;
        y += 1;
      } else {
        // can't move anywhere else
        break;
      }
    }

    if (isInbound(x, y)) {
      rocks.add(`${x},${y}`);
      count += 1;
      if (x === 500) {
        start[1] = Math.min(y - 1, start[1]);
      }
    } else {
      return count;
    }
  }
};

export const part1 = input => fillSand(input);

export const part2 = input => fillSand(input, false);
