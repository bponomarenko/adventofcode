const processInstructions = instructions => {
  let acc = 0;
  let i = 0;
  const visited = new Set();

  while (i < instructions.length) {
    if (visited.has(i)) {
      // Found loop, return negative result
      throw new Error('Loop!');
    } else {
      visited.add(i);
    }

    const [instr, value] = instructions[i];
    switch (instr) {
      case 'acc':
        acc += value;
        i += 1;
        break;
      case 'jmp':
        i += value;
        break;
      default:
        i += 1;
        break;
    }
  }
  // No loop! Return accumulator value
  return acc;
};

const main = input => {
  const instructions = input.split('\n').map(str => {
    const [instruction, value] = str.split(' ');
    return [instruction, +value];
  });

  let indexToSwitch = -1;

  do {
    // eslint-disable-next-line no-loop-func
    indexToSwitch = instructions.findIndex(([instr], i) => i > indexToSwitch && (instr === 'nop' || instr === 'jmp'));
    const instructionsClone = [...instructions];
    const [instr, value] = instructions[indexToSwitch];
    instructionsClone.splice(indexToSwitch, 1, [instr === 'nop' ? 'jmp' : 'nop', value]);

    try {
      return processInstructions(instructionsClone);
    } catch {
      // ignore
    }
  // eslint-disable-next-line no-constant-condition
  } while (true);
};

module.exports = { main };
