export const formatInput = input => input.split('\n');

export const part1 = input => {
  let sum = 0;
  input.forEach(str => {
    sum += str.length;
    // eslint-disable-next-line no-eval
    sum -= eval(str).length;
  });
  return sum;
};

export const part2 = input => {
  let sum = 0;
  input.forEach(str => {
    sum += `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`.length;
    sum -= str.length;
  });
  return sum;
};
