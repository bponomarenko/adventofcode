export const formatInput = input => input.split('\n')
  .map(line => line.split(' -> ').flatMap(coord => coord.split(',').map(Number)));

const countLineCrosses = lines => {
  // Will store all the visits
  const map = new Map();

  const fillMap = (x, y) => {
    const key = `${x},${y}`;
    // Do not need to keep full count, only if there was double cross
    map.set(key, map.has(key) ? 2 : 1);
  };

  lines.forEach(([x1, y1, x2, y2]) => {
    const invX = x1 > x2;
    const invY = y1 > y2;
    const dx = invX ? -1 : 1;
    const dy = invY ? -1 : 1;

    if (x1 === x2 || y1 === y2) {
      for (let x = x1; invX ? x >= x2 : x <= x2; x += dx) {
        for (let y = y1; invY ? y >= y2 : y <= y2; y += dy) {
          fillMap(x, y);
        }
      }
    } else {
      // Since lines are 45deg, count of steps is delta by one of the sides
      const count = Math.abs(x1 - x2);
      let x = x1;
      let y = y1;

      for (let i = 0; i <= count; i += 1) {
        fillMap(x, y);
        x += dx;
        y += dy;
      }
    }
  });
  return Array.from(map.values()).reduce((acc, cross) => (cross > 1 ? acc + 1 : acc), 0);
};

export const part1 = input => countLineCrosses(input.filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2));

export const part2 = input => countLineCrosses(input);
