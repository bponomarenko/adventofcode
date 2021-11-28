const formatInput = input => input.split(',');

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

const getDistance = pos => (Math.abs(pos[0]) + Math.abs(pos[1]) + Math.abs(pos[2])) / 2;

const main = input => {
  let pos = [0, 0, 0];
  input.forEach(dir => {
    pos = getNextPos(dir, pos);
  });
  return getDistance(pos);
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  getDistance,
  getNextPos,
};
