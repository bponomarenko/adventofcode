export const formatInput = input => input;

export const part1 = input => {
  let coords = [0, 0];
  const houses = new Set([coords.join(',')]);

  for (let i = 0, l = input.length; i < l; i += 1) {
    switch (input[i]) {
      case '>':
        coords[0] += 1;
        break;
      case '<':
        coords[0] -= 1;
        break;
      case '^':
        coords[1] += 1;
        break;
      case 'v':
        coords[1] -= 1;
        break;
    }
    houses.add(coords.join(','));
  }
  return houses.size;
};

const getNewCoords = (coords, direction) => {
  switch (direction) {
    case '>':
      return [coords[0] + 1, coords[1]];
    case '<':
      return [coords[0] - 1, coords[1]];
    case '^':
      return [coords[0], coords[1] + 1];
    case 'v':
      return [coords[0], coords[1] - 1];
    default:
      return coords;
  }
};

export const part2 = input => {
  let coords = [0, 0];
  let coordsRobot = [0, 0];
  const houses = new Set([coords.join(',')]);

  for (let i = 0, l = input.length; i < l; i += 2) {
    coords = getNewCoords(coords, input[i]);
    coordsRobot = getNewCoords(coordsRobot, input[i + 1]);
    houses.add(coords.join(','));
    houses.add(coordsRobot.join(','));
  }
  return houses.size;
};
