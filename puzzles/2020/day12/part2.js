const { formatInput } = require('./part1');

const rotate = (direction, degrees, [x, y]) => {
  switch (degrees) {
    case 90:
      return direction === 'R' ? [y, -x] : [-y, x];
    case 180:
      return [-x, -y];
    case 270:
      return direction === 'R' ? [-y, x] : [y, -x];
    default:
      throw new Error('not expected');
  }
};

const main = input => {
  const ship = [0, 0];
  let waypoint = [10, 1];

  const move = (direction, value) => {
    switch (direction) {
      case 'E':
        waypoint[0] += value;
        break;
      case 'W':
        waypoint[0] -= value;
        break;
      case 'N':
        waypoint[1] += value;
        break;
      case 'S':
        waypoint[1] -= value;
        break;
      default:
        throw new Error('not expected');
    }
  };

  input.forEach(str => {
    const instr = str.slice(0, 1);
    const value = +str.slice(1);

    switch (instr) {
      case 'F':
        ship[0] += value * waypoint[0];
        ship[1] += value * waypoint[1];
        break;
      case 'R':
      case 'L':
        waypoint = rotate(instr, value, waypoint);
        break;
      default:
        move(instr, value);
        break;
    }
  });

  return Math.abs(ship[0]) + Math.abs(ship[1]);
};

module.exports = { main: input => main(formatInput(input)) };
