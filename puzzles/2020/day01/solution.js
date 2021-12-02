const formatInput = input => input.split('\n').map(Number);

const part1 = nums => {
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] + nums[j] === 2020) {
        return nums[i] * nums[j];
      }
    }
  }
  return null;
};

const part2 = nums => {
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      for (let k = j + 1; k < nums.length; k += 1) {
        if (nums[i] + nums[j] + nums[k] === 2020) {
          return nums[i] * nums[j] * nums[k];
        }
      }
    }
  }
  return null;
};

module.exports = { part1, part2, formatInput };
