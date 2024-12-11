export const formatInput = input => input.split(' ');

const applyRules = num => {
  if (num === '0') {
    return ['1'];
  }
  const len = num.length;
  if (num.length % 2 === 0) {
    return [num.slice(0, len / 2), `${+num.slice(len / 2)}`];
  }
  return [`${num * 2024}`];
};

const blinkNum = (num, count, history) => {
  let arr = history.get(num);
  if (!arr) {
    arr = applyRules(num);
    history.set(num, arr);
  }
  return count === 1 ? arr.length : arr.sum(n => blinkNum(n, count - 1, history));
};

const blink = (nums, count = 25) => {
  const history = new Map();
  return nums.sum(num => blinkNum(num, count, history));
};

export const part1 = input => blink(input);

export const part2 = input => blink(input, 75);
