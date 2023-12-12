import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n').map(row => {
  const [springs, groups] = row.split(' ');
  return [springs, groups.split(',').map(Number)];
});

const countVariations = (springs, groups, startPos = 0, startIndex = 0, memory = new Map()) => {
  const maxPos = springs.length - 1;
  const maxIndex = groups.length - 1;
  let index = startIndex;
  let group = groups[index];
  let isPrevDamaged = false;

  for (let pos = startPos; pos <= maxPos; pos += 1) {
    let spring = springs[pos];
    if (isPrevDamaged && spring === '?') {
      // next one should only be damaged
      spring = '#';
    }

    if (spring === '#') {
      if (group === 1) {
        if (pos === maxPos) {
          // no more matches – check if there are groups left to match
          return index === maxIndex ? 1 : 0;
        }
        if (springs[pos + 1] === '.' || springs[pos + 1] === '?') {
          // a match
          if (index === maxIndex) {
            // last group matched
            return springs.indexOf('#', pos + 1) === -1 ? 1 : 0;
          }
          index += 1;
          group = groups[index];
          pos += 1;
          isPrevDamaged = false;
        } else {
          // found another damaged spring – doesn't match current group
          return 0;
        }
      } else if (springs[pos + 1] === '.') {
        return 0;
      } else {
        group -= 1;
        isPrevDamaged = true;
      }
    } else if (spring === '.') {
      if (isPrevDamaged) {
        return 0;
      }
    } else {
      // Use memoisation to prevent repeating the same sequences over and over again
      const hash1 = `${pos}-${index}-.`;
      let variation1;
      if (memory.has(hash1)) {
        variation1 = memory.get(hash1);
      } else {
        variation1 = countVariations(springs, groups, pos + 1, index, memory);
        memory.set(hash1, variation1);
      }

      const hash2 = `${pos}-${index}-#`;
      let variation2;
      if (memory.has(hash2)) {
        variation2 = memory.get(hash2);
      } else {
        variation2 = countVariations(
          `${springs.substring(0, pos)}#${springs.substring(pos + 1)}`,
          groups,
          pos,
          index,
          memory,
        );
        memory.set(hash2, variation2);
      }
      return variation1 + variation2;
    }
  }
  return 0;
};

export const part1 = input => sum(input.map(params => countVariations(...params)));

export const part2 = input => sum(
  input.map(([springs, groups]) => {
    groups = new Array(5).fill(groups).flat();
    springs = new Array(5).fill(springs).join('?');
    return countVariations(springs, groups);
  }),
);
