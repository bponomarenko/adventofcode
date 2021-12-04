export const formatInput = input => input.split('\n');

const getNewDirection = (directions, shipDirection, degrees) => {
  let index = directions.indexOf(shipDirection) + (degrees / 90);
  if (index < 0) {
    index += directions.length;
  }
  if (index >= directions.length) {
    index -= directions.length;
  }
  return directions[index];
};

export const part1 = input => {
  const coord = [0, 0];
  let shipDirection = 'E';

  const move = (direction, value) => {
    switch (direction) {
      case 'E':
        coord[0] += value;
        break;
      case 'W':
        coord[0] -= value;
        break;
      case 'N':
        coord[1] += value;
        break;
      case 'S':
        coord[1] -= value;
        break;
      default:
        throw new Error(`not expected${direction}`);
    }
  };

  input.forEach(str => {
    const directions = ['E', 'S', 'W', 'N'];
    const instr = str.slice(0, 1);
    const value = +str.slice(1);

    switch (instr) {
      case 'F':
        move(shipDirection, value);
        break;
      case 'L':
        shipDirection = getNewDirection([...directions].reverse(), shipDirection, value);
        break;
      case 'R':
        shipDirection = getNewDirection(directions, shipDirection, value);
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
      return direction === 'R' ? [y, -x] : [-y, x];
    case 180:
      return [-x, -y];
    case 270:
      return direction === 'R' ? [-y, x] : [y, -x];
    default:
      throw new Error('not expected');
  }
};

export const part2 = input => {
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
