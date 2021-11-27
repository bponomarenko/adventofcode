const formatInput = input => input.split('\n');

const memRegex = /^mem\[(?<index>\d+)\] = (?<value>\d+)$/;

const main = input => {
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

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
  memRegex,
};
