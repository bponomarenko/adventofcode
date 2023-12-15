import { changeDirection } from '../../utils/grid.js';

export const formatInput = input => input.split('\n');

export const part1 = input => {
  const coord = [0, 0];
  let shipDirection = 'e';

  const move = (direction, value) => {
    switch (direction) {
      case 'e':
        coord[0] += value;
        break;
      case 'w':
        coord[0] -= value;
        break;
      case 'n':
        coord[1] += value;
        break;
      case 's':
        coord[1] -= value;
        break;
      default:
        throw new Error(`not expected${direction}`);
    }
  };

  input.forEach(str => {
    const instr = str.slice(0, 1).toLowerCase();
    const value = +str.slice(1);

    switch (instr) {
      case 'f':
        move(shipDirection, value);
        break;
      case 'l':
        shipDirection = changeDirection(shipDirection, -value);
        break;
      case 'r':
        shipDirection = changeDirection(shipDirection, value);
        break;
      default:
        move(instr, value);
        break;
    }
  });

  return Math.abs(coord[0]) + Math.abs(coord[1]);
};

const rotate = (direction, degrees, [x, y]) => {
  switch (degrees) {
    case 90:
      return direction === 'r' ? [y, -x] : [-y, x];
    case 180:
      return [-x, -y];
    case 270:
      return direction === 'r' ? [-y, x] : [y, -x];
    default:
      throw new Error('not expected');
  }
};

export const part2 = input => {
  const ship = [0, 0];
  let waypoint = [10, 1];

  const move = (direction, value) => {
    switch (direction) {
      case 'e':
        waypoint[0] += value;
        break;
      case 'w':
        waypoint[0] -= value;
        break;
      case 'n':
        waypoint[1] += value;
        break;
      case 's':
        waypoint[1] -= value;
        break;
      default:
        throw new Error('not expected');
    }
  };

  input.forEach(str => {
    const instr = str.slice(0, 1).toLowerCase();
    const value = +str.slice(1);

    switch (instr) {
      case 'f':
        ship[0] += value * waypoint[0];
        ship[1] += value * waypoint[1];
        break;
      case 'r':
      case 'l':
        waypoint = rotate(instr, value, waypoint);
        break;
      default:
        move(instr, value);
        break;
    }
  });

  return Math.abs(ship[0]) + Math.abs(ship[1]);
};
