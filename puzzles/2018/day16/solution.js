export const formatInput = input => {
  const [samples, program] = input.split('\n\n\n\n');
  return [
    samples.split('\n\n').map(sample => {
      const [before, instruction, after] = sample.split('\n');
      const [opcode, ...values] = instruction.split(' ').map(Number);
      return {
        opcode,
        values,
        before: before.split('[')[1].slice(0, -1).split(', ').map(Number),
        afterHash: after.split('[')[1].slice(0, -1).split(', ').map(Number).join(','),
      };
    }),
    program.split('\n').map(line => line.split(' ').map(Number)),
  ];
};

const opcodes = {
  addr: (reg, a, b, c) => {
    reg[c] = reg[a] + reg[b];
    return reg;
  },
  addi: (reg, a, b, c) => {
    reg[c] = reg[a] + b;
    return reg;
  },
  mulr: (reg, a, b, c) => {
    reg[c] = reg[a] * reg[b];
    return reg;
  },
  muli: (reg, a, b, c) => {
    reg[c] = reg[a] * b;
    return reg;
  },
  banr: (reg, a, b, c) => {
    reg[c] = reg[a] & reg[b];
    return reg;
  },
  bani: (reg, a, b, c) => {
    reg[c] = reg[a] & b;
    return reg;
  },
  borr: (reg, a, b, c) => {
    reg[c] = reg[a] | reg[b];
    return reg;
  },
  bori: (reg, a, b, c) => {
    reg[c] = reg[a] | b;
    return reg;
  },
  setr: (reg, a, b, c) => {
    reg[c] = reg[a];
    return reg;
  },
  seti: (reg, a, b, c) => {
    reg[c] = a;
    return reg;
  },
  gtir: (reg, a, b, c) => {
    reg[c] = a > reg[b] ? 1 : 0;
    return reg;
  },
  gtri: (reg, a, b, c) => {
    reg[c] = reg[a] > b ? 1 : 0;
    return reg;
  },
  gtrr: (reg, a, b, c) => {
    reg[c] = reg[a] > reg[b] ? 1 : 0;
    return reg;
  },
  eqir: (reg, a, b, c) => {
    reg[c] = a === reg[b] ? 1 : 0;
    return reg;
  },
  eqri: (reg, a, b, c) => {
    reg[c] = reg[a] === b ? 1 : 0;
    return reg;
  },
  eqrr: (reg, a, b, c) => {
    reg[c] = reg[a] === reg[b] ? 1 : 0;
    return reg;
  },
};

export const part1 = ([samples]) => {
  const opcodeEntries = Object.entries(opcodes);
  return samples.filter(({ before, values, afterHash }) => {
    const filtered = opcodeEntries.filter(([, fn]) => fn(Array.from(before), ...values).join(',') === afterHash);
    return filtered.length >= 3;
  }).length;
};

export const part2 = ([samples, program]) => {
  const opcodeNames = Object.keys(opcodes);
  const opcodeMap = new Map();
  let unmappedOpcodesCount = opcodeNames.length;

  // 1. Find the opcodes mapping
  while (unmappedOpcodesCount > 0) {
    samples = samples.filter(sample => {
      if (opcodeMap.has(sample.opcode)) {
        return false;
      }

      if (sample.options) {
        sample.options = sample.options.filter(name => !opcodeMap.has(name));
      } else {
        sample.options = opcodeNames.filter(name => !opcodeMap.has(name) && opcodes[name](Array.from(sample.before), ...sample.values).join(',') === sample.afterHash);
      }

      if (sample.options.length === 1) {
        // found it
        opcodeMap.set(sample.opcode, sample.options[0]);
        opcodeMap.set(sample.options[0], sample.opcode);
        unmappedOpcodesCount -= 1;
        return false;
      }
      return true;
    });
  }

  // 2. Run the program
  const reg = [0, 0, 0, 0];
  program.forEach(([opcode, ...values]) => {
    opcodes[opcodeMap.get(opcode)](reg, ...values);
  });
  return reg[0];
};
