export const formatInput = input => input.split('\n');

export const part1 = input => input
  .map(line => line.split(' ').map(num => num.trim()).filter(Boolean))
  .rotateGrid().map(([op, ...nums]) => {
    nums = nums.map(Number);
    return (op === '+' ? nums.sum() : nums.mul());
  }).sum();

export const part2 = input => {
  const len = Math.max(...input.map(line => line.length));
  const [ops, ...nums] = input.reverse();
  const problems = [];
  let problem;

  ops.padEnd(len, ' ').split('').forEach((op, i) => {
    if (op.trim()) {
      problem = { op, numbers: [] };
      problems.push(problem);
    }
    const number = +nums.map(num => num[i]).reverse().join('').trim();
    if (number > 0) {
      problem.numbers.push(number);
    }
  });
  return problems.map(({ op, numbers }) => (op === '+' ? numbers.sum() : numbers.mul())).sum();
};
