export const formatInput = input => input.split('\n');

export const part1 = input => {
  let twoLetters = 0;
  let threeLetters = 0;

  input.forEach(line => {
    const counts = new Map();
    line.split('').forEach(char => counts.set(char, (counts.get(char) || 0) + 1));
    const values = Array.from(counts.values());
    if (values.includes(2)) {
      twoLetters += 1;
    }
    if (values.includes(3)) {
      threeLetters += 1;
    }
  });

  return twoLetters * threeLetters;
};

const oneCharDiff = (line1, line2) => {
  let diffs = 0;
  for (let i = 0; i < line1.length; i += 1) {
    diffs += line1[i] !== line2[i] ? 1 : 0;
  }
  return diffs === 1;
};

export const part2 = input => {
  for (let i = 0; i < input.length - 1; i += 1) {
    const line1 = input[i];
    const line2 = input.find((line, j) => i !== j && oneCharDiff(line1, line));
    if (line2) {
      return line1.split('').filter((char, index) => line2[index] === char).join('');
    }
  }
  return null;
};
