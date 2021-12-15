export const formatInput = input => input.split('\n');

const isNumeric = value => !Number.isNaN(+value);

const findAnswer = (input, initialValue, limit) => {
  const registers = { a: initialValue, b: 0, c: 0, d: 0 };
  let pointer = 0;
  let expected = 0;

  const getValue = pos => (isNumeric(pos) ? +pos : registers[pos]);

  while (pointer >= 0 && pointer < input.length && limit) {
    const [cmd, arg1, arg2] = input[pointer].split(' ');
    let tglIndex;
    let tglCmd;

    switch (cmd) {
      case 'cpy':
        pointer += 1;
        if (isNumeric(arg2)) {
          break;
        }
        registers[arg2] = getValue(arg1);
        break;
      case 'inc':
        pointer += 1;
        if (isNumeric(arg1)) {
          break;
        }
        registers[arg1] += 1;
        break;
      case 'dec':
        pointer += 1;
        if (isNumeric(arg1)) {
          break;
        }
        registers[arg1] -= 1;
        break;
      case 'jnz':
        pointer += getValue(arg1) ? getValue(arg2) : 1;
        break;
      case 'tgl':
        tglIndex = pointer + getValue(arg1);
        pointer += 1;

        if (tglIndex < 0 || tglIndex >= input.length) {
          break;
        }
        tglCmd = input[tglIndex].slice(0, 3);

        if (tglCmd.startsWith('inc')) {
          input[tglIndex] = input[tglIndex].replace(tglCmd, 'dec');
        } else if (tglCmd.startsWith('dec') || tglCmd.startsWith('tgl') || tglCmd.startsWith('out')) {
          input[tglIndex] = input[tglIndex].replace(tglCmd, 'inc');
        } else if (tglCmd.startsWith('jnz')) {
          input[tglIndex] = input[tglIndex].replace(tglCmd, 'cpy');
        } else if (tglCmd.startsWith('cpy')) {
          input[tglIndex] = input[tglIndex].replace(tglCmd, 'jnz');
        }
        break;
      case 'out':
        pointer += 1;
        if (getValue(arg1) === expected) {
          // switch expected value
          expected = expected ? 0 : 1;
        } else {
          // wrong value
          return false;
        }
        break;
    }

    // Make sure we have safety limit
    limit -= 1;
  }
  return true;
};

export const part1 = input => {
  let counter = 0;
  let found = false;
  while (!found) {
    found = findAnswer(input, counter, 1000000);
    counter += 1;
  }
  return counter - 1;
};

// No puzzle for part 2
export const part2 = () => null;
