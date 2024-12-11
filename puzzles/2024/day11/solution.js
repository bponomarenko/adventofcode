export const formatInput = input => input.split(' ');

const applyRules = num => {
  if (num === '0') {
    return ['1'];
  }
  const len = num.length;
  return num.length % 2 === 0 ? [num.slice(0, len / 2), `${+num.slice(len / 2)}`] : [`${num * 2024}`];
};

const blinkNum = (num, count, history) => {
  const hash = `${num}-${count}`;
  if (history.has(hash)) {
    return history.get(hash);
  }
  const arr = applyRules(num);
  const res = count === 1 ? arr.length : arr.sum(n => blinkNum(n, count - 1, history));
  history.set(hash, res);
  return res;
};

const blink = (nums, count = 25) => {
  const history = new Map();
  return nums.sum(num => blinkNum(num, count, history));
};

export const part1 = input => blink(input);

export const part2 = input => blink(input, 75);
