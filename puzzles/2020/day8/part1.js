const main = input => {
  const instructions = input.split('\n').map(str => {
    const [instruction, value] = str.split(' ');
    return [instruction, +value];
  });

  let acc = 0;
  let i = 0;
  const visited = new Set();

  while (i < instructions.length) {
    if (visited.has(i)) {
      // Found the loop
      return acc;
    }
    // Mark node as visited
    visited.add(i);

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
  return acc;
};

module.exports = { main };
