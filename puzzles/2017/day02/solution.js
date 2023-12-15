export const formatInput = input => input.split('\n').map(line => line.split(/\s+/).map(Number));

// I love spread operator in JS!
export const part1 = input => input.sum(nums => Math.max(...nums) - Math.min(...nums));

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

export const part2 = input => input.resumduce(nums => findDiv(nums));
