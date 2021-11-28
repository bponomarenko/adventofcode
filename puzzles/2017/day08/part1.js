const instructionRegexp = /(.+)\s(inc|dec)\s(.+)\sif\s(.+)/;

const formatInput = input => {
  const instructions = input.split('\n').map(line => {
    const [, register, operator, amount, condition] = line.match(instructionRegexp);
    return {
      register,
      // Parse instruction direction into modification function
      getValue: operator === 'inc' ? value => (value || 0) + +amount : value => (value || 0) - +amount,
      condition,
    };
  });

  // Populate registers with "0" value
  const registers = instructions.reduce((acc, { register, condition }) => {
    const [conditionReg] = condition.split(' ');
    return { ...acc, [register]: 0, [conditionReg]: 0 };
  }, {});
  return { instructions, registers };
};

// Defines all registers as variables and appends condition
const createExpression = (registers, condition) => Object.entries(registers).map(([reg, value]) => `const ${reg} = ${value}`).concat(condition).join(';');

const main = input => {
  const registers = { ...input.registers };
  input.instructions.forEach(({ register, getValue, condition }) => {
    // Prepare condition expression and evaluate it
    // eslint-disable-next-line no-eval
    const truthful = eval(createExpression(registers, condition));
    if (truthful) {
      registers[register] = getValue(registers[register]);
    }
  });
  return Math.max(...Object.values(registers));
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  createExpression,
};
