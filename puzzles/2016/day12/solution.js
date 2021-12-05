export const formatInput = input => input.split('\n');

const findAnswer = (input, registers) => {
  let pointer = 0;

  const getValue = pos => (Number.isNaN(+pos) ? registers[pos] : +pos);

  while (pointer < input.length) {
    const [cmd, arg1, arg2] = input[pointer].split(' ');
    switch (cmd) {
      case 'cpy':
        registers[arg2] = getValue(arg1);
        pointer += 1;
        break;
      case 'inc':
        registers[arg1] += 1;
        pointer += 1;
        break;
      case 'dec':
        registers[arg1] -= 1;
        pointer += 1;
        break;
      case 'jnz':
        pointer += getValue(arg1) !== 0 ? +arg2 : 1;
        break;
    }
  }
  return registers.a;
};

export const part1 = input => findAnswer(input, { a: 0, b: 0, c: 0, d: 0 });

export const part2 = input => findAnswer(input, { a: 0, b: 0, c: 1, d: 0 });
