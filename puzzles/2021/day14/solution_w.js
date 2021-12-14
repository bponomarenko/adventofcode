import WorkerPool from '../../../lib/workers/worker-pool.js';

export const formatInput = input => {
  const [template, rules] = input.split('\n\n');
  return [template, new Map(rules.split('\n').map(rule => rule.split(' -> ')))];
};

const findPolymerizationResult = ([template, rules], count) => new Promise(resolve => {
  const pool = new WorkerPool({ workerPath: new URL('polymerize.js', import.meta.url).pathname });
  let result = [];

  pool.on('done', () => {
    const counts = new Map();
    // Count individual characters
    result.join('').split('').forEach(char => {
      counts.set(char, (counts.get(char) || 0) + 1);
    });
    resolve(Math.max(...counts.values()) - Math.min(...counts.values()));
  });

  for (let i = 0; i < template.length - 1; i += 1) {
    pool.runTask({ template: template.slice(i, i + 2), rules, count }, partial => {
      result.push(partial);
    });
  }
});

export const part1 = input => findPolymerizationResult(input, 10);

export const part2 = input => findPolymerizationResult(input, 40);
