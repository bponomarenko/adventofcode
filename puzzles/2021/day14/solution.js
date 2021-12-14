import { slidingWindows } from '../../utils/collection.js';

export const formatInput = input => {
  const [template, rules] = input.split('\n\n');
  return [template, new Map(rules.split('\n').map(rule => {
    const [pair, insert] = rule.split(' -> ');
    return [pair, [`${pair[0]}${insert}`, `${insert}${pair[1]}`]];
  }))];
};

const findPolymerizationResult = ([template, rules], steps) => {
  let pairCounts = new Map();

  slidingWindows(template, 2).forEach(pair => {
    pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
  });

  // Apply polymerization rules
  for (let i = 0; i < steps; i += 1) {
    const nextCounts = new Map();
    Array.from(pairCounts.entries()).forEach(([pair, count]) => {
      rules.get(pair).forEach(nextPair => {
        nextCounts.set(nextPair, (nextCounts.get(nextPair) || 0) + count);
      });
    });
    pairCounts = nextCounts;
  }

  const counts = new Map([[template.at(-1), 1]]);
  Array.from(pairCounts.entries()).forEach(([[char], count]) => {
    counts.set(char, (counts.get(char) || 0) + count);
  });
  return Math.max(...counts.values()) - Math.min(...counts.values());
};

export const part1 = input => findPolymerizationResult(input, 10);

export const part2 = input => findPolymerizationResult(input, 40);
