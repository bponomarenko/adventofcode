export const formatInput = input => input.split('\n').map(Number);

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

export const part1 = sequence => {
  for (let i = preamble, l = sequence.length; i < l; i += 1) {
    if (!sums(sequence.slice(i - preamble, i)).includes(sequence[i])) {
      return sequence[i];
    }
  }
  return null;
};

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

export const part2 = sequence => {
  for (let i = preamble, l = sequence.length; i < l; i += 1) {
    if (!sums(sequence.slice(i - preamble, i)).includes(sequence[i])) {
      return findEncryptionWeakness(sequence.slice(0, i), sequence[i]);
    }
  }
  return null;
};
