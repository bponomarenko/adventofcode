export const formatInput = input => input.split(',');

const getNextPos = (dir, pos) => {
  switch (dir) {
    case 'se':
      return [pos[0] + 1, pos[1], pos[2] - 1];
    case 'sw':
      return [pos[0] - 1, pos[1] + 1, pos[2]];
    case 'nw':
      return [pos[0] - 1, pos[1], pos[2] + 1];
    case 'ne':
      return [pos[0] + 1, pos[1] - 1, pos[2]];
    case 'n':
      return [pos[0], pos[1] - 1, pos[2] + 1];
    case 's':
      return [pos[0], pos[1] + 1, pos[2] - 1];
    default:
      throw new Error(`Not expected position: ${dir}`);
  }
};

const getDistance = pos => pos.sum(n => Math.abs(n)) / 2;

export const part1 = input => {
  let pos = [0, 0, 0];
  input.forEach(dir => {
    pos = getNextPos(dir, pos);
  });
  return getDistance(pos);
};

export const part2 = input => {
  let pos = [0, 0, 0];
  let max = 0;
  input.forEach(dir => {
    pos = getNextPos(dir, pos);
    max = Math.max(max, getDistance(pos));
  });
  return max;
};
