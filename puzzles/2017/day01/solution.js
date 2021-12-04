export const formatInput = input => input.trim().split('').map(Number);

export const part1 = nums => {
  const lastIndex = nums.length - 1;

  // Pretty trivial
  return nums.reduce((acc, num, index) => {
    const nextNum = nums[index === lastIndex ? 0 : index + 1];
    return acc + (num === nextNum ? num : 0);
  }, 0);
};

export const part2 = nums => {
  const count = nums.length;
  const half = count / 2;

  return nums.reduce((acc, num, index) => {
    const compareIndex = index + half;
    // Find next number with a shift
    const nextNum = nums[compareIndex >= count ? compareIndex - count : compareIndex];
    return acc + (num === nextNum ? num : 0);
  }, 0);
};
