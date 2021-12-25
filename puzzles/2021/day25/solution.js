export const formatInput = input => input.split('\n').map(line => line.split(''));

const nextSouth = (grid, x, y) => (grid[x + 1] ? [x + 1, y] : [0, y]);
const nextEast = (grid, x, y) => (grid[x][y + 1] ? [x, y + 1] : [x, 0]);

export const part1 = input => {
  const inputLength = input.length;
  let movedEast = -1;
  let movedSouth = -1;
  let count = 0;

  do {
    const inputCopy = input.map(line => Array.from(line));
    movedEast = -1;
    movedSouth = -1;

    for (let x = 0; x < inputLength + 2; x += 1) {
      const eastRow = inputCopy[x];
      const sx = x - 2;
      const southRow = inputCopy[sx] ? Array.from(inputCopy[sx]) : null;
      const rowLength = eastRow?.length || southRow?.length;

      for (let y = 0; y < rowLength; y += 1) {
        if (eastRow?.[y] === '>') {
          const [dx, dy] = nextEast(inputCopy, x, y);
          if (inputCopy[dx][dy] === '.') {
            [input[dx][dy], input[x][y]] = [input[x][y], input[dx][dy]];
            movedEast = x;
          }
        }
        if (southRow?.[y] === 'v') {
          const [dx, dy] = nextSouth(inputCopy, sx, y);
          if (inputCopy[dx][dy] === '.') {
            [input[dx][dy], input[sx][y]] = [input[sx][y], input[dx][dy]];
            movedSouth = x;
          }
        }
      }

      // Update the copy for the south moving cucumbers
      if (movedEast === x) {
        inputCopy[x] = Array.from(input[x]);
      }
    }
    count += 1;
  } while (movedEast >= 0 || movedSouth >= 0);
  return count;
};

// Traditionally, there is no part2 on the 25th day. Yay
export const part2 = () => null;
