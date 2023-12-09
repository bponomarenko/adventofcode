import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n').map(line => line.split(' ').map(Number));

const getPrediction = nums => {
  let prediction = nums.at(-1);
  let diffs = nums;
  while (diffs.some(num => num !== 0)) {
    diffs = diffs.slice(1).map((num, index) => num - diffs[index]);
    prediction += diffs.at(-1);
  }
  return prediction;
};

export const part1 = input => sum(input.map(getPrediction));

export const part2 = input => sum(input.map(num => getPrediction(num.reverse())));
