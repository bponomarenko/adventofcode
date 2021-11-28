const preamble = 25;

const sums = sequence => {
  const values = [];
  for (let i = 0, l = sequence.length; i < l - 1; i += 1) {
    for (let j = i + 1; j < l; j += 1) {
      values.push(sequence[i] + sequence[j]);
    }
  }
  return values;
};

const main = input => {
  const sequence = input.split('\n').map(n => +n);
  for (let i = preamble, l = sequence.length; i < l; i += 1) {
    if (!sums(sequence.slice(i - preamble, i)).includes(sequence[i])) {
      return sequence[i];
    }
  }
  return null;
};

module.exports = { main, preamble, sums };
