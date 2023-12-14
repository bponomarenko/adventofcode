import { opcodes } from '../day16/solution.js';

export const formatInput = input => {
  const [ip, ...instructions] = input.split('\n');
  return [
    +ip.split(' ')[1],
    instructions.map(row => {
      const [name, ...values] = row.split(' ');
      return { name, values: values.map(Number) };
    }),
  ];
};

const runProgram = (reg, ipReg, instructions) => {
  const programSize = instructions.length;
  let ip = 0;
  while (ip < programSize && ip >= 0) {
    reg[ipReg] = ip;
    const { name, values } = instructions[ip];
    opcodes[name](reg, ...values);
    ip = reg[ipReg] + 1;
  }
  return reg[0];
};

export const part1 = input => runProgram([0, 0, 0, 0, 0, 0], ...input);

export const part2 = input => runProgram([1, 0, 0, 0, 0, 0], ...input);
