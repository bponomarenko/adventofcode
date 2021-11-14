const main = input => {
  const nums = input.split('\n').map(Number);

  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] + nums[j] === 2020) {
        return nums[i] * nums[j];
      }
    }
  }
  return null;
};

module.exports = { main };
