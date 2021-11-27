const formatInput = input => input.split('\n').map(phrase => phrase.split(' '));

// Use Set to make sure word is unique
const main = input => input.reduce((acc, phrase) => (new Set(phrase).size === phrase.length ? acc + 1 : acc), 0);

module.exports = { main: input => main(formatInput(input)), formatInput };
