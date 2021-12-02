const formatInput = input => input.split('\n');

const part1 = input => {
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

const part2 = input => {
  const result = part1(input);
  return result;
};

module.exports = { part1, part2, formatInput };
