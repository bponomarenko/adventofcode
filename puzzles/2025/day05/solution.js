export const formatInput = input => {
  const [ranges, ids] = input.split('\n\n');
  return [
    ranges.split('\n').map(line => line.toNumArray('-')),
    ids.toNumArray('\n'),
  ];
};

export const part1 = ([ranges, ids]) => ids.filter(id => ranges.some(([min, max]) => id >= min && id <= max)).length;

export const part2 = ([ranges]) => {
  let merged;
  do {
    merged = false;
    const newRanges = [];
    // Find all the overlapping ranges and merge them
    ranges.forEach(([min1, max1]) => {
      const index = newRanges.findIndex(([min2, max2]) => min2 <= max1 && max2 >= min1);
      if (index === -1) {
        newRanges.push([min1, max1]);
      } else {
        const [min2, max2] = newRanges[index];
        newRanges[index] = [Math.min(min2, min1), Math.max(max2, max1)];
        merged = true;
      }
    });
    ranges = newRanges;
  } while (merged);
  return ranges.map(([min, max]) => max - min + 1).sum();
};
