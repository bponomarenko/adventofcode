import { getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => input.slice(1, -1);

const arr = length => new Array(length).fill('?');
const fillGaps = matrix => matrix.map(row => row.map(cell => (cell === '?' ? '#' : cell)));

const getMatrix = input => {
  const matrix = '.'.toGrid();
  let startPos = [0, 0];

  const expandMatrix = (path, startFrom) => {
    const start = [...startFrom];
    let pos = [...startFrom];
    let index = 0;

    while (index < path.length) {
      const dir = path[index];
      if (dir === '(') {
        index += expandMatrix(path.slice(index + 1), pos);
      } else if (dir === ')') {
        return index;
      } else if (dir === '|') {
        pos = [...start];
      } else {
        let [x, y] = getRelativeCoord(pos[0], pos[1], dir, 2);
        if (x > matrix[0].length) {
          matrix.forEach(row => {
            row.push('?', '?');
          });
        } else if (x < 0) {
          matrix.forEach(row => {
            row.splice(0, 0, '?', '?');
          });
          pos[0] += 2;
          startPos[0] += 2;
          start[0] += 2;
          x += 2;
        } else if (y > matrix.length) {
          matrix.push(arr(matrix[0].length), arr(matrix[0].length));
        } else if (y < 0) {
          matrix.splice(0, 0, arr(matrix[0].length), arr(matrix[0].length));
          pos[1] += 2;
          startPos[1] += 2;
          start[1] += 2;
          y += 2;
        }
        const [dx, dy] = getRelativeCoord(pos[0], pos[1], dir, 1);
        matrix[dy][dx] = dir === 'W' || dir === 'E' ? '|' : '-';
        matrix[y][x] = '.';
        pos = [x, y];
      }
      index += 1;
    }
    return 0;
  };

  expandMatrix(input, startPos);

  return [fillGaps(matrix), startPos];
};

export const part1 = input => {
  const [matrix, start] = getMatrix(input);

  console.log(matrix.toGridString(), '\n', start, '\n');
  return null;
};

export const part2 = input => {
  const result = part1(input);
  console.log(result);
  return null;
};
