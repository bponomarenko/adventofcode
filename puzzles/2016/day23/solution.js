const isNumeric = value => !Number.isNaN(+value);
const isNumber = value => typeof value === 'number';

export const formatInput = input => input.split('\n').map(line => {
  const [cmd, arg1, arg2] = line.split(' ');
  return [cmd, isNumeric(arg1) ? +arg1 : arg1, arg2 && isNumeric(arg2) ? +arg2 : arg2];
});

const findAnswer = (input, initialValue) => {
  const registers = { a: initialValue, b: 0, c: 0, d: 0 };
  let pointer = 0;

  const getValue = pos => (isNumber(pos) ? pos : registers[pos]);

  while (pointer >= 0 && pointer < input.length) {
    const [cmd, arg1, arg2] = input[pointer];
    let tglIndex;
    let tglCmd;

    switch (cmd) {
      case 'cpy':
        pointer += 1;
        if (isNumber(arg2)) {
          break;
        }
        registers[arg2] = getValue(arg1);
        break;
      case 'inc':
        pointer += 1;
        if (isNumber(arg1)) {
          break;
        }
        registers[arg1] += 1;
        break;
      case 'dec':
        pointer += 1;
        if (isNumber(arg1)) {
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
        [tglCmd] = input[tglIndex];

        if (tglCmd === 'inc') {
          input[tglIndex][0] = 'dec';
        } else if (tglCmd === 'dec' || tglCmd === 'tgl') {
          input[tglIndex][0] = 'inc';
        } else if (tglCmd === 'jnz') {
          input[tglIndex][0] = 'cpy';
        } else if (tglCmd === 'cpy') {
          input[tglIndex][0] = 'jnz';
        }
        break;
    }
  }
  return registers.a;
};

export const part1 = input => findAnswer(input, 7);

export const part2 = input => findAnswer(input, 12);
