const { preamble, sums } = require('./part1');

const sum = sequence => sequence.reduce((acc, n) => acc + n, 0);

const findEncryptionWeakness = (sequence, num) => {
  for (let i = 0, l = sequence.length; i < l - 1; i += 1) {
    for (let j = i + 1; j < l; j += 1) {
      const set = sequence.slice(i, j);
      if (sum(set) === num) {
        return Math.min(...set) + Math.max(...set);
      }
    }
  }
  return null;
};

const main = input => {
  const sequence = input.split('\n').map(n => +n);
  for (let i = preamble, l = sequence.length; i < l; i += 1) {
    if (!sums(sequence.slice(i - preamble, i)).includes(sequence[i])) {
      return findEncryptionWeakness(sequence.slice(0, i), sequence[i]);
    }
  }
  return null;
};

module.exports = { main };
