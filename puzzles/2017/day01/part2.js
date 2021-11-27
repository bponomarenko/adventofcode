const main = input => {
  const nums = input.trim().split('').map(Number);
  const count = nums.length;
  const half = count / 2;

  return nums.reduce((acc, num, index) => {
    const compareIndex = index + half;
    // Find next number with a shift
    const nextNum = nums[compareIndex >= count ? compareIndex - count : compareIndex];
    return acc + (num === nextNum ? num : 0);
  }, 0);
};

module.exports = { main };
