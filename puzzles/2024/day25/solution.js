export const formatInput = input => {
  const locks = [];
  const keys = [];
  let max = 0;
  input.split('\n\n').forEach(block => {
    const grid = block.toGrid();
    max = grid.length;
    const scheme = new Array(grid[0].length).fill(0);
    grid.forEach(row => row.forEach((tile, i) => {
      if (tile === '#') {
        scheme[i] += 1;
      }
    }));
    if (grid[0].every(tile => tile === '#')) {
      locks.push(scheme);
    } else {
      keys.push(scheme);
    }
  });
  return [locks, keys, max];
};

export const part1 = ([locks, keys, max]) => locks.sum(lock => keys.sum(key => lock.every((pin, i) => pin + key[i] <= max)));

// There is no coding challenge for the part 2, yay :)
export const part2 = () => 'That\'s a wrap';
