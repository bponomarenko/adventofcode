import { getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => input.split('\n');
formatInput.doNotTrim = true;

const pipes = ['-', '|', '+', ' '];
const horizontalPipes = ['#', '+', '-'];
const verticalPipes = ['#', '+', '|'];

const walkPath = (input, pipeCallback) => {
  let x = 0;
  let y = input[0].indexOf('|');
  let dir = 'd';

  const inRange = (i, j) => i >= 0 && i < input.length && j >= 0 && j < input[i].length;
  const getValue = (i, j) => {
    const value = input[i][j].trim();
    // "#" would indicate any of the letters
    return pipes.includes(value) ? value : '#';
  };

  while (inRange(x, y)) {
    const pipe = input[x][y];

    pipeCallback(pipe);

    switch (pipe) {
      case '|':
      case '-':
        // Simply skip those characters
        break;
      case '+':
        // Path makes a turn
        if (dir === 'd' || dir === 'u') {
          const [ly, lx] = getRelativeCoord(y, x, 'l');
          const lScore = inRange(lx, ly) ? horizontalPipes.indexOf(getValue(lx, ly)) : -1;
          const [ry, rx] = getRelativeCoord(y, x, 'r');
          const rScore = inRange(rx, ry) ? horizontalPipes.indexOf(getValue(rx, ry)) : -1;
          // change direction
          dir = lScore > rScore ? 'l' : 'r';
        } else {
          const [uy, ux] = getRelativeCoord(y, x, 'u');
          const uScore = inRange(ux, uy) ? verticalPipes.indexOf(getValue(ux, uy)) : -1;
          const [dy, dx] = getRelativeCoord(y, x, 'd');
          const dScore = inRange(dx, dy) ? verticalPipes.indexOf(getValue(dx, dy)) : -1;
          // change direction
          dir = uScore > dScore ? 'u' : 'd';
        }
        break;
      case ' ':
        // end of the path
        return;
    }
    // Go to the next position
    [y, x] = getRelativeCoord(y, x, dir);
  }
};

export const part1 = input => {
  const path = [];
  walkPath(input, pipe => {
    if (!pipes.includes(pipe)) {
      path.push(pipe);
    }
  });
  return path.join('');
};

export const part2 = input => {
  let count = 0;
  walkPath(input, () => {
    count += 1;
  });
  return count - 1;
};
