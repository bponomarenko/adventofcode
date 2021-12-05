const re = /^(?<instr>\w{3})( (?<reg>[a-z]),?)?( (?<value>[+-]\d+))?$/;

export const formatInput = input => input.split('\n').map(line => {
  const { instr, reg, value } = re.exec(line).groups;
  return [instr, reg ?? null, value ? +value : null];
});

const findRegisterB = (input, regs) => {
  let i = 0;
  while (i < input.length) {
    const [instr, reg, value] = input[i];
    switch (instr) {
      case 'hlf':
        regs[reg] /= 2;
        i += 1;
        break;
      case 'tpl':
        regs[reg] *= 3;
        i += 1;
        break;
      case 'inc':
        regs[reg] += 1;
        i += 1;
        break;
      case 'jmp':
        i += value;
        break;
      case 'jie':
        i += regs[reg] % 2 === 0 ? value : 1;
        break;
      case 'jio':
        i += regs[reg] === 1 ? value : 1;
        break;
    }
  }
  return regs.b;
};

export const part1 = input => findRegisterB(input, { a: 0, b: 0 });

export const part2 = input => findRegisterB(input, { a: 1, b: 0 });
