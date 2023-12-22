export const formatInput = input => input
  .split('\n')
  .map(row => row.split('~').map(pos => pos.split(',').map(Number)))
  .sort((brick1, brick2) => Math.min(brick1[0][2], brick1[1][2]) - Math.min(brick2[0][2], brick2[1][2]));

const onSegment = ([px, py], [qx, qy], [rx, ry]) => (
  qx <= Math.max(px, rx)
  && qx >= Math.min(px, rx)
  && qy <= Math.max(py, ry)
  && qy >= Math.min(py, ry)
);

const getOrientation = ([px, py], [qx, qy], [rx, ry]) => {
  // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
  // for details of below formula.
  const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
  if (val === 0) {
    return 0;
  }
  return val > 0 ? 1 : 2;
};

const doIntersect = (start1, end1, start2, end2) => {
  const o1 = getOrientation(start1, end1, start2);
  const o2 = getOrientation(start1, end1, end2);
  const o3 = getOrientation(start2, end2, start1);
  const o4 = getOrientation(start2, end2, end1);
  return (o1 !== o2 && o3 !== o4)
    || (o1 === 0 && onSegment(start1, start2, end1))
    || (o2 === 0 && onSegment(start1, end2, end1))
    || (o3 === 0 && onSegment(start2, start1, end2))
    || (o4 === 0 && onSegment(start2, end1, end2));
};

export const part1 = input => {
  const heightMap = [];
  const stackedBricks = [];

  input.forEach(([start, end]) => {
    const xLimits = [Math.min(start[0], end[0]), Math.max(start[0], end[0])];
    const yLimits = [Math.min(start[1], end[1]), Math.max(start[1], end[1])];
    let floorZ = 0;

    if (start[2] !== 1 && end[2] !== 1) {
      // find lowest settled bricks
      for (let x = xLimits[0]; x <= xLimits[1]; x += 1) {
        for (let y = yLimits[0]; y <= yLimits[1]; y += 1) {
          floorZ = Math.max(floorZ, heightMap[y]?.[x] ?? 0);
        }
      }
    }

    const endZ = floorZ + 1 + end[2] - start[2];
    // store brick after it settled on the floor or other bricks
    stackedBricks.push({
      start: start.toSpliced(2, 1, floorZ + 1),
      end: end.toSpliced(2, 1, endZ),
      supports: [],
      supportedBy: [],
    });

    // update the heightMap
    for (let x = xLimits[0], maxX = xLimits[1]; x <= maxX; x += 1) {
      for (let y = yLimits[0]; y <= yLimits[1]; y += 1) {
        if (!heightMap[y]) {
          heightMap[y] = [];
        }
        heightMap[y][x] = endZ;
      }
    }
  });

  // analyze for each brick what other bricks it supports and what bricks supports it
  stackedBricks.forEach(({ start, end, supports }, index) => {
    const zAbove = end[2] + 1;
    stackedBricks.slice(index + 1).forEach((brickAbove, aIndex) => {
      if (brickAbove.start[2] !== zAbove || !doIntersect(start, end, brickAbove.start, brickAbove.end)) {
        return;
      }
      supports.push(aIndex + index + 1);
      brickAbove.supportedBy.push(index);
    });
  });

  // find all bricks that can be disintegrated
  return stackedBricks
    .filter(({ supports }) => supports.length === 0 || supports.every(i => stackedBricks[i].supportedBy.length > 1))
    .length;
};

export const part2 = input => {
  const result = part1(input);
  console.log(result);
  return null;
};
