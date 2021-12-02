const formatInput = input => input.split('\n').map(phrase => phrase.split(' '));

// Use Set to make sure word is unique
const part1 = input => input.reduce((acc, phrase) => (new Set(phrase).size === phrase.length ? acc + 1 : acc), 0);

const part2 = input => {
  // Arrange letters in each word, and then assert its uniqueness
  const rearranged = input.map(phrase => phrase.map(word => word.split('').sort().join('')));
  return rearranged.reduce((acc, phrase) => (new Set(phrase).size === phrase.length ? acc + 1 : acc), 0);
};

module.exports = { part1, part2, formatInput };
