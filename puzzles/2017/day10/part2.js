const { computeInRounds } = require('./part1');

const stringToHexArray = str => str.split('').map(char => char.charCodeAt(0));

const formatInput = input => {
  const [, chars] = input.split('\n');
  return stringToHexArray(chars).concat(17, 31, 73, 47, 23);
};

const xor = values => {
  let res = values[0];
  for (let i = 1; i < values.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    res ^= values[i];
  }
  return res;
};

const pad = (value, count) => (value.length > count ? value : `${new Array(count - value.length + 1).join('0')}${value}`);

const getKnotHash = input => {
  // Array with numbers 0 - 255
  const list = new Array(256).fill(0).map((_, i) => i);
  const hash = computeInRounds(list, input, 256, 64);
  const denseHash = new Array(16).fill(0).map((_, index) => xor(hash.slice(index * 16, (index + 1) * 16)));
  // Get final hex string
  return denseHash.map(code => pad(code.toString(16), 2)).join('');
};

const main = input => getKnotHash(input);

module.exports = {
  main: input => main(formatInput(input)),
  getKnotHash,
  stringToHexArray,
  pad,
};
