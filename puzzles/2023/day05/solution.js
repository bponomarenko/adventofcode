export const formatInput = input => {
  const [seeds, ...maps] = input.split('\n\n');
  return {
    seeds: seeds.split(': ')[1].split(' ').map(Number),
    maps: maps.map(line => {
      const [type, ...nums] = line.split('\n');
      const [from, , to] = type.slice(0, type.indexOf(' ')).split('-');
      return { from, to, nums: nums.map(nLine => nLine.split(' ').map(Number)) };
    }),
  };
};

export const part1 = ({ seeds, maps }) => {
  let type = 'seed';
  do {
    const { to, nums } = maps.find(({ from }) => from === type);
    seeds = seeds.map(seed => {
      const match = nums.find(([, source, length]) => seed >= source && seed < source + length);
      return (match ? seed - match[1] + match[0] : seed);
    });
    type = to;
  } while (type !== 'location');
  return Math.min(...seeds);
};

const isOverlap = (start1, end1, start2, length2) => {
  const end2 = start2 + length2 - 1;
  return (start1 <= start2 && start2 <= end1) || (start2 <= start1 && start1 <= end2);
};

const getNewRanges = (start, end, target, source, size) => {
  const overlapStart = source <= start ? start : source;
  const sourceEnd = source + size - 1;
  const overlapEnd = sourceEnd >= end ? end : sourceEnd;
  const shift = target - source;
  const remaining = [];

  if (overlapStart > start) {
    remaining.push([start, overlapStart - 1]);
  }
  if (overlapEnd < end) {
    remaining.push([overlapEnd + 1, end]);
  }
  return { newRange: [overlapStart + shift, overlapEnd + shift], remaining };
};

export const part2 = ({ seeds, maps }) => {
  // change to pairs
  let seedRanges = seeds.map((seed, index) => {
    if ((index + 1) % 2 === 0) {
      const start = seeds[index - 1];
      return [start, start + seed - 1];
    }
    return null;
  }).filter(Boolean);

  let type = 'seed';
  do {
    const { to, nums } = maps.find(({ from }) => from === type);
    seedRanges = seedRanges.flatMap(range => {
      const queue = [range];
      const newRanges = [];
      while (queue.length > 0) {
        const [start, end] = queue.pop();
        /**
         * Find any overlaps with the current range.
         * For overlap – calculate new range.
         * For not-overlapping parts – define them as new sub-ranges, and try to find new ranges for them instead
         */
        const match = nums.find(([, source, length]) => isOverlap(start, end, source, length));
        if (match) {
          const { newRange, remaining } = getNewRanges(start, end, ...match);
          queue.push(...remaining);
          newRanges.push(newRange);
        } else {
          // if no overlap – preserve the range as it is
          newRanges.push([start, end]);
        }
      }
      return newRanges;
    });
    type = to;
  } while (type !== 'location');
  return Math.min(...seedRanges.map(([start]) => start));
};
