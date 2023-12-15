import { getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => input;

export const part1 = input => {
  let coords = [0, 0];
  const houses = new Set([coords.join(',')]);

  for (let i = 0, l = input.length; i < l; i += 1) {
    coords = getRelativeCoord(...coords, input[i]);
    houses.add(coords.join(','));
  }
  return houses.size;
};

export const part2 = input => {
  let coords = [0, 0];
  let coordsRobot = [0, 0];
  const houses = new Set([coords.join(',')]);

  for (let i = 0, l = input.length; i < l; i += 2) {
    coords = getRelativeCoord(...coords, dirMap[input[i]]);
    coordsRobot = getRelativeCoord(...coordsRobot, dirMap[input[i + 1]]);
    houses.add(coords.join(','));
    houses.add(coordsRobot.join(','));
  }
  return houses.size;
};
