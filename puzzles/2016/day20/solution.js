export const formatInput = input => input.split('\n').map(range => {
  const [min, max] = range.split('-');
  return [+min, +max];
});

export const part1 = input => {
  let num = 0;
  let range;
  do {
    range = input.find(([min, max]) => num >= min && num <= max);
    if (!range) {
      return num;
    }
    num = range[1] + 1;
  } while (range);
  return null;
};

export const part2 = ranges => {
  const MAX = 4_294_967_295;
  let count = 0;
  let num = 0;

  while (ranges.length) {
    const index = ranges.findIndex(([min, max]) => num >= min && num <= max);
    if (index === -1) {
      ranges = ranges.filter(([min]) => num <= min);
      if (!ranges.length) {
        break;
      }
      const nextBlocked = Math.min(...ranges.map(([min]) => min));
      count += nextBlocked - num;
      num = nextBlocked;
      // eslint-disable-next-line no-continue
      continue;
    }
    const [range] = ranges.splice(index, 1);
    num = range[1] + 1;
  }
  return count + (num <= MAX ? MAX - num + 1 : 0);
};
