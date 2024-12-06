const filterInLimits = (limitsX, limitsY, limitsZ) => ([x, y, z]) => (!limitsX || (x >= limitsX[0] && x <= limitsX[1]))
  && (!limitsY || (y >= limitsY[0] && y <= limitsY[1]))
  && (!limitsZ || (z >= limitsZ[0] && z <= limitsZ[1]));

const directionsMap = {
  // north
  n: 'n',
  u: 'n',
  '^': 'n',

  // south
  s: 's',
  d: 's',
  v: 's',

  // east
  e: 'e',
  r: 'e',
  '>': 'e',

  // west
  w: 'w',
  l: 'w',
  '<': 'w',

  // north-east
  ne: 'ne',
  en: 'ne',

  // north-west
  nw: 'nw',

  // south-east
  se: 'se',
  es: 'se',

  // south-west
  sw: 'sw',
  ws: 'sw',
};

export const getNormalisedDirection = dir => directionsMap[dir.toLowerCase()];

export const getRelativeCoord = (x, y, dir, step = 1) => {
  switch (getNormalisedDirection(dir)) {
    case 'w':
      return [x - step, y];
    case 'e':
      return [x + step, y];
    case 'n':
      return [x, y - step];
    case 's':
      return [x, y + step];
    case 'nw':
      return [x - step, y - step];
    case 'ne':
      return [x + step, y - step];
    case 'sw':
      return [x - step, y + step];
    case 'se':
      return [x + step, y + step];
    default:
      return [x, y];
  }
};

export const getStraightAdjacent = (x, y, ...limits) => [
  getRelativeCoord(x, y, 'w'),
  getRelativeCoord(x, y, 'e'),
  getRelativeCoord(x, y, 'n'),
  getRelativeCoord(x, y, 's'),
].filter(filterInLimits(...limits));

export const getAdjacent = (x, y, ...limits) => [
  getRelativeCoord(x, y, 'nw'),
  getRelativeCoord(x, y, 'n'),
  getRelativeCoord(x, y, 'ne'),
  getRelativeCoord(x, y, 'w'),
  getRelativeCoord(x, y, 'e'),
  getRelativeCoord(x, y, 'sw'),
  getRelativeCoord(x, y, 's'),
  getRelativeCoord(x, y, 'se'),
].filter(filterInLimits(...limits));

export const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

/**
 *
 * @param {string} dir current direction. Should be one of the values from the "directions" above.
 * @param {number} degree degree to turn the direction by. Can be positive or negative, and should be dividible by 45.
 */
export const changeDirection = (dir, degree) => {
  let index = directions.indexOf(dir) + (degree / 45);
  if (index < 0) {
    index += directions.length;
  }
  if (index >= directions.length) {
    index -= directions.length;
  }
  return directions[index];
};

export const getStraightAdjacent3d = (x, y, z, ...limits) => [
  [x - 1, y, z],
  [x + 1, y, z],
  [x, y - 1, z],
  [x, y + 1, z],
  [x, y, z - 1],
  [x, y, z + 1],
].filter(filterInLimits(...limits));

export const isStraightAdjacent3d = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2) === 1;

export const getDistance = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs((z1 || 0) - (z2 || 0));
