const main = input => {
  const nums = input.trim().split('').map(Number);
  const lastIndex = nums.length - 1;
  return nums.reduce((acc, num, index) => {
    const nextNum = nums[index === lastIndex ? 0 : index + 1];
    return acc + (num === nextNum ? num : 0);
  }, 0);
};

module.exports = { main };
