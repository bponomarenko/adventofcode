export const formatInput = input => input.toGrid('\n', ' ');

export const part1 = input => {
  const registers = {
    a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0,
  };
  let countMul = 0;

  for (let i = 0; i < input.length; i += 1) {
    const [cmd, arg1, arg2] = input[i];
    switch (cmd) {
      case 'set':
        registers[arg1] = arg2 in registers ? registers[arg2] : +arg2;
        break;
      case 'sub':
        registers[arg1] -= arg2 in registers ? registers[arg2] : +arg2;
        break;
      case 'mul':
        registers[arg1] *= arg2 in registers ? registers[arg2] : +arg2;
        countMul += 1;
        break;
      case 'jnz':
        if ((arg1 in registers ? registers[arg1] : +arg1) !== 0) {
          i += +arg2 - 1;
        }
        break;
    }
  }
  return countMul;
};

export const part2 = () => {
  const registers = {
    a: 1, b: 81, c: 81, d: 0, e: 0, f: 0, g: 0, h: 0,
  };

  registers.b = registers.b * 100 + 100000;
  registers.c = registers.b + 17000;
  do {
    registers.f = 1;
    registers.d = 2;
    for (let { d } = registers; d * d < registers.b; d += 1) {
      if (registers.b % d === 0) {
        registers.f = 0;
        break;
      }
    }
    if (registers.f === 0) {
      registers.h += 1;
    }
    registers.g = registers.b - registers.c;
    registers.b += 17;
  } while (registers.g !== 0);

  return registers.h;
};
