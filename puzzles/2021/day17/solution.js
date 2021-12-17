export const formatInput = input => {
  const [, x1, x2, y1, y2] = input.match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/);
  return [[+x1, +x2], [+y1, +y2]];
};

const launchProbe = (vx, vy, dx, dy) => {
  let x = 0;
  let y = 0;
  let maxY = 0;

  do {
    // Update position
    x += vx;
    y += vy;

    // get max y value
    maxY = Math.max(maxY, y);

    // Check if we are in the target area
    if (x >= dx[0] && y <= dy[1]) {
      return maxY;
    }

    // Update velocity
    vx = vx > 0 ? vx - 1 : 0;
    vy -= 1;

    // Check if we will never reach the target area
    if ((vx === 0 && x < dx[0])) {
      break;
    }
  } while (x + vx <= dx[1] && y + vy >= dy[0]);
  return null;
};

const getHitsMaxY = ([dx, dy]) => {
  const hits = [];

  // Get some reasonable bounds for the loops

  // Amount of min steps in triangular number sequence needed to reach target area
  const minX = Math.floor(Math.sqrt(dx[0] * 2));
  // Max Y-velocity, which wouldn't miss target area on the "way down"
  const maxY = Math.abs(dy[0]) * 2;

  for (let x = minX; x <= dx[1]; x += 1) {
    for (let y = maxY; y >= dy[0]; y -= 1) {
      const hit = launchProbe(x, y, dx, dy);
      if (hit != null) {
        hits.push(hit);
      }
    }
  }
  return hits;
};

export const part1 = input => Math.max(...getHitsMaxY(input));

export const part2 = input => getHitsMaxY(input).length;
