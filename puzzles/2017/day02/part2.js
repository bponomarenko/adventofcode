const findDiv = nums => {
  for (let i = 0, l = nums.length; i < l; i += 1) {
    for (let j = 0; j < l; j += 1) {
      // Find division result for the whole numbers
      if (i !== j && nums[i] % nums[j] === 0) {
        return nums[i] / nums[j];
      }
    }
  }
  throw new Error('Div not found, which is not expected');
};

const main = input => input.split('\n').reduce((acc, line) => {
  const nums = line.split(/\s+/).map(Number);
  return acc + findDiv(nums);
}, 0);

module.exports = { main };
