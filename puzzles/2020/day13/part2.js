const { formatInput } = require('./part1');

const mulInv = (a, b) => {
  if (b === 1) {
    return 1;
  }
  const b0 = b;
  let x0 = 0;
  let x1 = 1;

  while (a > 1) {
    const q = Math.floor(a / b);

    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0) {
    x1 += b0;
  }
  return x1;
};

const chineseRemainder = congruences => {
  const prod = congruences.reduce((acc, [modulo]) => acc * modulo, 1);
  let sum = 0;

  for (let i = 0, len = congruences.length; i < len; i += 1) {
    const [ni, ri] = congruences[i];
    const p = Math.floor(prod / ni);
    sum += ri * p * mulInv(p, ni);
  }
  return sum % prod;
};

const main = input => {
  const congruences = [];

  input.ids.forEach((id, i) => {
    if (id !== 'x') {
      congruences.push([+id, id - i]);
    }
  });
  return chineseRemainder(congruences);
};

module.exports = { main: input => main(formatInput(input)) };
