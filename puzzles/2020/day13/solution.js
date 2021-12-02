const formatInput = input => {
  const [timestamp, ids] = input.split('\n');
  return { timestamp: +timestamp, ids: ids.split(',') };
};

const part1 = input => {
  const firstBus = input.ids
    .map(id => (id === 'x' ? null : [+id, id - (input.timestamp % id)]))
    .filter(Boolean)
    .sort(([, d1], [, d2]) => d1 - d2)[0];
  return firstBus[0] * firstBus[1];
};

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

const part2 = input => {
  const congruences = [];

  input.ids.forEach((id, i) => {
    if (id !== 'x') {
      congruences.push([+id, id - i]);
    }
  });
  return chineseRemainder(congruences);
};

module.exports = { part1, part2, formatInput };
