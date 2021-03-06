export const formatInput = input => input.split(/\s/).map(value => +value);

// Calculates kinda unique hash key for the memory banks
const memoryHash = banks => banks.join('-');

export const part1 = input => {
  // Get number of memory banks
  const size = input.length;
  const history = new Set();
  // Copy of the input for memory rearrangements
  const banks = Array.from(input);
  let cyclesCount = 0;

  while (!history.has(memoryHash(banks))) {
    history.add(memoryHash(banks));
    cyclesCount += 1;

    const max = Math.max(...banks);
    // Index of the "donor" bank
    const index = banks.indexOf(max);
    const block = Math.ceil(banks[index] / size);
    let toSplit = banks[index];

    // Fill all but the donor bank with equal parts
    for (let i = 0; i < size - 1; i += 1) {
      const shiftedIndex = (i + index + 1) % size;
      if (toSplit >= block) {
        banks[shiftedIndex] += block;
        toSplit -= block;
      } else {
        banks[shiftedIndex] += toSplit;
        toSplit = 0;
      }
    }
    // Fill remaining donor bank
    banks[index] = 0 + toSplit;
  }
  return cyclesCount;
};

export const part2 = input => {
  // Get number of memory banks
  const size = input.length;
  const history = new Map();
  // Copy of the input for memory rearrangements
  const banks = Array.from(input);

  while (!history.has(memoryHash(banks))) {
    // Keep memory hash but also its index position
    history.set(memoryHash(banks), history.size);

    const max = Math.max(...banks);
    // Index of the "donor" bank
    const index = banks.indexOf(max);
    const block = Math.ceil(banks[index] / size);
    let toSplit = banks[index];

    // Fill all but the donor bank with equal parts
    for (let i = 0; i < size - 1; i += 1) {
      const shiftedIndex = (i + index + 1) % size;
      if (toSplit >= block) {
        banks[shiftedIndex] += block;
        toSplit -= block;
      } else {
        banks[shiftedIndex] += toSplit;
        toSplit = 0;
      }
    }
    // Fill remaining donor bank
    banks[index] = 0 + toSplit;
  }
  // return amount of loops
  return history.size - history.get(memoryHash(banks));
};
