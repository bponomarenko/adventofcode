const { formatInput } = require('./part1');

const main = input => {
  // Arrange letters in each word, and then assert its uniqueness
  const rearranged = input.map(phrase => phrase.map(word => word.split('').sort().join('')));
  return rearranged.reduce((acc, phrase) => (new Set(phrase).size === phrase.length ? acc + 1 : acc), 0);
};

module.exports = { main: input => main(formatInput(input)) };
