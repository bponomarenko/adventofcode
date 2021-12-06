export const formatInput = input => input.split('').map(tile => tile === '^');

export const part1 = tiles => {
  let count = tiles.filter(tile => !tile).length;

  for (let i = 1; i < 40; i += 1) {
    const clone = Array.from(tiles);
    for (let j = 0; j < clone.length; j += 1) {
      const num = parseInt([clone[j - 1], clone[j], clone[j + 1]].map(tile => (tile ? 1 : 0)).join(''), 2);
      tiles[j] = num === 4 || num === 1 || num === 6 || num === 3;
      count += tiles[j] ? 0 : 1;
    }
  }
  return count;
};

export const part2 = tiles => {
  let count = tiles.filter(tile => !tile).length;

  for (let i = 1; i < 400000; i += 1) {
    const clone = Array.from(tiles);
    for (let j = 0; j < clone.length; j += 1) {
      const num = parseInt([clone[j - 1], clone[j], clone[j + 1]].map(tile => (tile ? 1 : 0)).join(''), 2);
      tiles[j] = num === 4 || num === 1 || num === 6 || num === 3;
      count += tiles[j] ? 0 : 1;
    }
  }
  return count;
};
