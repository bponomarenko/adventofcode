export const formatInput = input => input.slice(1, -1);

const mul = 'mul\\(([0-9]{1,3}),([0-9]{1,3})\\)';

export const part1 = input => {
  const mulReg = new RegExp(mul, 'g');
  let sum = 0;
  for (let [, x, y] of input.matchAll(mulReg)) {
    sum += x * y;
  }
  return sum;
};

export const part2 = input => {
  const mulReg = new RegExp(`(do\\(\\))|(don't\\(\\))|${mul}`, 'g');
  let skip = false;
  let sum = 0;
  for (let [, on, off, x, y] of input.matchAll(mulReg)) {
    if (on) {
      skip = false;
    } else if (off) {
      skip = true;
    } else if (!skip) {
      sum += x * y;
    }
  }
  return sum;
};
