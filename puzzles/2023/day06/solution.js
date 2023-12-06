import { power } from '../../utils/collections.js';

export const formatInput = input => input.split('\n').map(line => line.split(':')[1].split(' ').filter(Boolean).map(Number));

const countPossibleWins = (time, distance) => {
  let count = 0;
  for (let t = 1; t < time; t += 1) {
    const d = (time - t) * t;
    if (d > distance) {
      count += 1;
    }
  }
  return count;
};

export const part1 = ([times, distances]) => power(times.map((time, index) => countPossibleWins(time, distances[index])));

export const part2 = ([times, distances]) => countPossibleWins(+times.join(''), +distances.join(''));
