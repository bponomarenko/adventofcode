const { formatInput, memRegex } = require('./part1');

function* addresses(bitMask) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const bit in ['1', '0']) {
    const newBitMask = bitMask.replace('X', bit);
    if (newBitMask.includes('X')) {
      yield* addresses(newBitMask);
    } else {
      yield parseInt(newBitMask, 2);
    }
  }
}

const main = input => {
  const memory = new Map();
  let mask;

  input.forEach(line => {
    if (line.startsWith('mask')) {
      mask = line.replace('mask = ', '');
    } else {
      const { index, value } = memRegex.exec(line).groups;
      const indexBin = (+index).toString(2).split('').reverse();
      const newIndexBin = mask.split('')
        .reverse()
        .map((maskBit, i) => (maskBit === '0' ? (indexBin[i] ?? '0') : maskBit))
        .reverse()
        .join('');

      // eslint-disable-next-line no-restricted-syntax
      for (const addr of addresses(newIndexBin)) {
        memory.set(addr, +value);
      }
    }
  });
  return Array.from(memory.values()).reduce((acc, value) => acc + value, 0);
};

module.exports = { main: input => main(formatInput(input)) };
