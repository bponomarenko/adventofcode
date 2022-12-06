export const formatInput = input => input;

const findMessageStart = (str, size) => {
  for (let i = 0; i < str.length - size; i += 1) {
    const set = new Set(str.slice(i, i + size));
    if (set.size === size) {
      return i + size;
    }
  }
  return -1;
};

export const part1 = input => findMessageStart(input, 4);

export const part2 = input => findMessageStart(input, 14);
