export const get2dLinesIntersection = ([[x1, y1], [x2, y2]], [[x3, y3], [x4, y4]]) => {
  const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
};

const isWithinSegment = ([x, y], [[x1, y1], [x2, y2]]) => {
  const [xl, xr] = x2 > x1 ? [x1, x2] : [x2, x1];
  const [yl, yr] = y2 > y1 ? [y1, y2] : [y2, y1];
  return x >= xl && x <= xr && y >= yl && y <= yr;
};

export const get2dSegmentsIntersection = (line1, line2) => {
  const intersection = get2dLinesIntersection(line1, line2);
  return intersection && isWithinSegment(intersection, line1) && isWithinSegment(intersection, line2) ? intersection : null;
};
