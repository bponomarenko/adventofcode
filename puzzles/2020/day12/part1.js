const formatInput = input => input.split('\n');

const directions = ['E', 'S', 'W', 'N'];

const getNewDirection = (shipDirection, degrees) => {
  let index = directions.indexOf(shipDirection) + (degrees / 90);
  if (index < 0) {
    index += directions.length;
  }
  if (index >= directions.length) {
    index -= directions.length;
  }
  return directions[index];
};

const main = input => {
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
        throw new Error('not expected');
    }
  };

  input.forEach(str => {
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

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
  directions,
};
