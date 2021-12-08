export const formatInput = input => input.split('\n').map(line => {
  const [patterns, output] = line.split(' | ');
  return [patterns.trim().split(' '), output.trim().split(' ')];
});

const baseRules = [
  null,
  pattern => pattern.length === 2, // 1
  null,
  null,
  pattern => pattern.length === 4, // 4
  null,
  null,
  pattern => pattern.length === 3, // 7
  pattern => pattern.length === 7, // 8
];

const mapToDigit = (pattern, rules) => {
  const index = rules.findIndex(rule => rule?.(pattern));
  return index !== -1 ? index : null;
};

export const part1 = input => input.reduce((acc, [, output]) => acc + output.filter(num => mapToDigit(num, baseRules) != null).length, 0);

const hasAll = (pattern, partial) => pattern.split('').every(char => partial.includes(char));

export const part2 = input => {
  let sum = 0;
  input.forEach(([patterns, output]) => {
    const rules = Array.from(baseRules);

    const one = patterns.find(pattern => rules[1](pattern));
    const four = patterns.find(pattern => rules[4](pattern));
    const seven = patterns.find(pattern => rules[7](pattern));

    rules[9] = pattern => pattern.length === 6 && hasAll(four, pattern);
    rules[6] = pattern => pattern.length === 6 && !hasAll(one, pattern);
    rules[0] = pattern => pattern.length === 6 && !rules[6](pattern) && !rules[9](pattern);
    rules[3] = pattern => pattern.length === 5 && hasAll(seven, pattern);

    const six = patterns.find(pattern => rules[6](pattern));

    rules[5] = pattern => pattern.length === 5 && hasAll(pattern, six);
    rules[2] = pattern => pattern.length === 5 && !rules[5](pattern) && !rules[5](pattern) && !rules[3](pattern);

    sum += +output.map(pattern => mapToDigit(pattern, rules)).join('');
  });
  return sum;
};
