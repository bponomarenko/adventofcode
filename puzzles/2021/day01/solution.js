export const formatInput = input => input.split('\n').map(num => +num);

// Count icreasing elements
export const part1 = input => input.reduce((acc, num, index) => ((index > 0 && num > input[index - 1]) ? acc + 1 : acc), 0);

export const part2 = input => {
  // Get sum of 3 elements
  const sum = index => input[index] + input[index - 1] + input[index - 2];
  // Count icreasing sums
  return input.reduce((acc, num, index) => (index > 2 && sum(index) > sum(index - 1) ? acc + 1 : acc), 0);
};
