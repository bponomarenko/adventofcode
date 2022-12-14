export const formatInput = input => input.split('\n').map(line => line.split(' -> ').map(coord => coord.split(',').map(Number)));

const findRocks = lines => {
  const rocks = new Set();
  lines.forEach(line => {
    for (let i = 1; i < line.length; i += 1) {
      const [xs, ys] = line[i - 1];
      const [xe, ye] = line[i];

      // move by Y
      if (xs === xe) {
        for (let dy = 0, my = Math.abs(ys - ye); dy <= my; dy += 1) {
          rocks.add(`${xs},${ys < ye ? ys + dy : ys - dy}`);
        }
      }

      // move by X
      if (ys === ye) {
        for (let dx = 0, mx = Math.abs(xs - xe); dx <= mx; dx += 1) {
          rocks.add(`${xs < xe ? xs + dx : xs - dx},${ys}`);
        }
      }
    }
  });
  return rocks;
};

const findLimits = rocks => {
  const arr = Array.from(rocks).map(coord => coord.split(',').map(Number));
  const xx = arr.map(([x]) => x);
  return [Math.min(...xx), Math.max(...xx), Math.max(...arr.map(([, y]) => y)) + 2];
};

const fillSand = (input, checkLimits = true) => {
  const rocks = findRocks(input);
  const [lx, rx, bottom] = findLimits(rocks);
  const filled = new Set(rocks);
  const initialSize = filled.size;

  const isFree = (x, y) => (checkLimits ? true : y !== bottom) && !filled.has(`${x},${y}`);
  const isInbound = (x, y) => (checkLimits ? x >= lx && x <= rx : true) && y < bottom;
  const isFreeAndInbound = (x, y) => isFree(x, y) && isInbound(x, y);
  const sinkDown = (x, y) => {
    while (isFreeAndInbound(x, y + 1)) {
      y += 1;
    }
    return y;
  };

  let x;
  let y;

  do {
    // Find first position for attempt
    x = 500;
    y = sinkDown(x, 0);

    do {
      // attempt to roll to the left
      if (isFree(x - 1, y + 1)) {
        x -= 1;
        y = sinkDown(x, y + 1);
        // attempt to find another position
        continue;
      }

      // attempt to roll to the right
      if (isFree(x + 1, y + 1)) {
        x += 1;
        y = sinkDown(x, y + 1);
        // attempt to find another position
        continue;
      }
      // Settle at the current place
      filled.add(`${x},${y}`);
    } while (isFreeAndInbound(x, y));

    // Check the bounds
    if (!isInbound(x, y)) {
      // last entry is in a free fall or on the floor – remove it
      filled.delete(`${x},${y}`);
      break;
    }
  } while (y > 0);
  return filled.size - initialSize;
};

export const part1 = input => fillSand(input);

export const part2 = input => fillSand(input, false);
