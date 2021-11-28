const { formatInput, createExpression } = require('./part1');

const main = input => {
  const registers = { ...input.registers };
  let max = 0;
  input.instructions.forEach(({ register, getValue, condition }) => {
    // Prepare condition expression and evaluate it
    // eslint-disable-next-line no-eval
    const truthful = eval(createExpression(registers, condition));
    if (truthful) {
      registers[register] = getValue(registers[register]);
    }

    max = Math.max(max, ...Object.values(registers));
  });
  return max;
};

module.exports = { main: input => main(formatInput(input)) };
