// eslint-disable-next-line no-eval
export const formatInput = input => input.split('\n').map(line => eval(line));

const arr = value => Array.isArray(value);

// Tries to add value to the specified index in the pair array (recursively)
const addToPair = (pair, index, value) => {
  if (arr(pair[index])) {
    addToPair(pair[index], index, value);
  } else {
    pair[index] += value;
  }
};

const explode = (pair, level = 0) => {
  // If the pair is not "deep enough" – try to explode nested array
  if (level < 4) {
    if (arr(pair[0])) {
      // Try to explode left part of the pair
      const exploded = explode(pair[0], level + 1);
      if (exploded) {
        // If just above the exploded part – replace it with 0
        if (level === 3) {
          pair[0] = 0;
        }

        if (exploded[1] != null) {
          if (arr(pair[1])) {
            addToPair(pair[1], 0, exploded[1]);
          } else {
            addToPair(pair, 1, exploded[1]);
          }
        }
        // Bubble up, so it will be added in the parent
        return [exploded[0]];
      }
    }

    if (arr(pair[1])) {
      // And then try to explode right part of the pair (if left one was not exploded)
      const exploded = explode(pair[1], level + 1);
      if (exploded) {
        // If just above the exploded part – replace it with 0
        if (level === 3) {
          pair[1] = 0;
        }

        if (exploded[0] != null) {
          if (arr(pair[0])) {
            addToPair(pair[0], 1, exploded[0]);
          } else {
            addToPair(pair, 0, exploded[0]);
          }
        }
        // Bubble up, so it will be added in the parent
        return [null, exploded[1]];
      }
    }
  } else {
    // Explode
    return pair;
  }
  return null;
};

const split = value => {
  if (arr(value)) {
    // try to split left value
    let splitted = split(value[0]);
    if (splitted) {
      if (arr(splitted)) {
        // Split replacement
        value[0] = splitted;
      }
      return true;
    }

    // and then try to split right one (but only if left part is not splitted)
    splitted = split(value[1]);
    if (splitted) {
      if (arr(splitted)) {
        // Split replacement
        value[1] = splitted;
      }
      return true;
    }
  } else if (value >= 10) {
    // Do split
    return [Math.floor(value / 2), Math.ceil(value / 2)];
  }
  // No split happened
  return false;
};

// Recursive clone
const clone = value => (arr(value) ? value.map(clone) : value);

const add = (value1, value2) => {
  // Clone values as they going to be mutated
  const sum = [clone(value1), clone(value2)];
  let exploded;
  let didSplit;

  do {
    // Try to explode snailfish number first
    exploded = !!explode(sum);
    if (!exploded) {
      // ...if cound't explode – try to split it then
      didSplit = !!split(sum);
    }
  } while (exploded || didSplit);
  return sum;
};

const magnitude = ([left, right]) => (arr(left) ? magnitude(left) : left) * 3 + (arr(right) ? magnitude(right) : right) * 2;

export const part1 = input => magnitude(input.slice(1).reduce((acc, value) => add(acc, value), input[0]));

export const part2 = input => {
  let maxSum = 0;
  for (const [value1, value2] of input.permutations(2)) {
    maxSum = Math.max(maxSum, magnitude(add(value1, value2)));
  }
  return maxSum;
};
