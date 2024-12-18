export const formatInput = input => {
  const [regs, program] = input.split('\n\n');
  return [
    Object.fromEntries(regs.split('\n').map(reg => {
      const [a, b] = reg.split(': ');
      return [a.slice(-1), +b];
    })),
    program.split(': ')[1].split(',').map(Number),
  ];
};

export const runProgram = (regs, program, compare = false) => {
  const out = [];
  let { A, B, C } = regs;
  let pointer = 0;
  let outPointer = 0;

  const combo = value => {
    switch (value) {
      case 4:
        return A;
      case 5:
        return B;
      case 6:
        return C;
      default:
        return value;
    }
  };

  while (pointer < program.length) {
    const value = program[pointer + 1];
    switch (program[pointer]) {
      case 0:
        A = Math.floor(A / 2 ** combo(value));
        break;
      case 1:
        B ^= value;
        break;
      case 2:
        B = combo(value) & 7;
        break;
      case 3:
        pointer = A === 0 ? pointer : value - 2;
        break;
      case 4:
        B ^= C;
        break;
      case 5:
        out.push(combo(value) & 7);
        if (compare && out.at(-1) !== program[outPointer]) {
          return false;
        }
        outPointer += 1;
        break;
      case 6:
        B = Math.floor(A / 2 ** combo(value));
        break;
      case 7:
        C = Math.floor(A / 2 ** combo(value));
        break;
    }
    pointer += 2;
  }
  return compare ? out.length === program.length : out.join(',');
};

export const part1 = input => runProgram(...input);

export const part2 = ([regs, program], isTest) => {
  if (isTest) {
    // This is naive, brute-force approach just to see if the test works
    let a = 0;
    regs.A = a;
    while (!runProgram(regs, program, true)) {
      a += 1;
      regs.A = a;
    }
    return a;
  }

  // This approach is actually based on reverse-engineered analysis
  // of the program. By knowing the output, we can find the answer for
  // the last iteration and then backtrack all the answers all the way
  // to the starting iteration.
  let num = 1;
  for (let i = 0; i < program.length; i += 1) {
    const str = program.slice(-(i + 1)).join(',');
    for (let j = (num + 1) * 8 - 1; j >= num; j -= 1) {
      regs.A = j;
      if (runProgram(regs, program) === str) {
        num = j;
        break;
      }
    }
  }
  return num;
};
