const { getKnotHash, stringToHexArray } = require('../day10/part2');

const formatInput = input => new Array(128).fill(input).map((str, index) => `${str}-${index}`);

const main = input => input.reduce((acc, line) => {
  const hash = getKnotHash(stringToHexArray(line));
  // console.log(line, hash);
  // Convert to bits and count amount of high bits
  // console.log(hash
  //   .split('')
  //   .flatMap(char => Number(`0x${char}`).toString(2)));
  return acc + hash
    .split('')
    .flatMap(char => Number(`0x${char}`).toString(2).split(''))
    .filter(bit => bit !== '0')
    .length;
}, 0);

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
};
