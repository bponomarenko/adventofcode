const parseValue = value => {
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? value : num;
};

const formatInput = input => input.split('\n').map(line => {
  const [instruction, value1, value2] = line.split(' ');
  return { instruction, value1: parseValue(value1), value2: parseValue(value2) };
});

const main = input => {
  const registers = new Map();
  let played;
  let offset = 0;

  const getValue = key => (typeof key === 'string' ? registers.get(key) || 0 : key);

  do {
    const { instruction, value1, value2 } = input[offset];
    if (instruction === 'jgz') {
      offset += getValue(value1) > 0 ? getValue(value2) : 1;
    } else {
      switch (instruction) {
        case 'snd':
          played = getValue(value1);
          break;
        case 'set':
          registers.set(value1, getValue(value2));
          break;
        case 'add':
          registers.set(value1, getValue(value1) + getValue(value2));
          break;
        case 'mul':
          registers.set(value1, getValue(value1) * getValue(value2));
          break;
        case 'mod':
          registers.set(value1, getValue(value1) % getValue(value2));
          break;
        case 'rcv':
          if (getValue(value1) !== 0) {
            return played;
          }
          break;
        default:
        // Do nothing
          break;
      }
      offset += 1;
    }
  } while (offset >= 0 && offset < input.length);
  throw new Error('should return earlier');
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
};
