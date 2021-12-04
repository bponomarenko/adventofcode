export const formatInput = input => input.split('\n');

const memRegex = /^mem\[(?<index>\d+)\] = (?<value>\d+)$/;

export const part1 = input => {
  const memory = new Map();
  let mask;

  input.forEach(line => {
    if (line.startsWith('mask')) {
      mask = line.replace('mask = ', '');
    } else {
      const { index, value } = memRegex.exec(line).groups;
      const valueBin = (+value).toString(2).split('').reverse();
      const newValueBin = mask.split('')
        .reverse()
        .map((maskBit, i) => (maskBit === 'X' ? (valueBin[i] ?? '0') : maskBit))
        .reverse()
        .join('');
      memory.set(index, parseInt(newValueBin, 2));
    }
  });
  return Array.from(memory.values()).reduce((acc, value) => acc + value, 0);
};

function* addresses(bitMask) {
  // eslint-disable-next-line guard-for-in
  for (const bit in ['1', '0']) {
    const newBitMask = bitMask.replace('X', bit);
    if (newBitMask.includes('X')) {
      yield* addresses(newBitMask);
    } else {
      yield parseInt(newBitMask, 2);
    }
  }
}

export const part2 = input => {
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

      for (const addr of addresses(newIndexBin)) {
        memory.set(addr, +value);
      }
    }
  });
  return Array.from(memory.values()).reduce((acc, value) => acc + value, 0);
};
