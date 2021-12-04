const regex = /^(\d+)-(\d+)\s(.):\s(\w+)/;
export const formatInput = input => input
  .split('\n')
  .map(line => {
    const [, min, max, char, password] = regex.exec(line);
    return {
      min: +min, max: +max, char, password,
    };
  });

export const part1 = input => input
  .filter(rule => {
    const length = rule.password.split(rule.char).length - 1;
    return length >= rule.min && length <= rule.max;
  }).length;

export const part2 = input => input
  .filter(rule => rule.password[rule.min - 1] === rule.char ^ rule.password[rule.max - 1] === rule.char).length;
