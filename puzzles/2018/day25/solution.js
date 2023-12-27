export const formatInput = input => input.split('\n').map(row => row.split(',').map(Number));

export const getDistance = ([x1, y1, z1, w1], [x2, y2, z2, w2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2) + Math.abs((w1 - w2));

export const part1 = input => {
  let constellations = 0;
  while (input.length) {
    const constellation = [input.pop()];
    for (;;) {
      const pointIndex = input.findIndex(point => constellation.some(p => getDistance(p, point) <= 3));
      if (pointIndex === -1) {
        break;
      }
      constellation.push(input.splice(pointIndex, 1)[0]);
    }
    constellations += 1;
  }
  return constellations;
};

export const part2 = () => {};
