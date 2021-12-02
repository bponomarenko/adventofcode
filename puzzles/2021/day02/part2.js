const { formatInput } = require('./part1');

const main = input => {
  let pos = 0;
  let depth = 0;
  let aim = 0;

  input.forEach(({ cmd, value }) => {
    switch (cmd) {
      case 'forward':
        pos += value;
        depth += aim * value;
        break;
      case 'down':
        aim += value;
        break;
      case 'up':
        aim -= value;
        break;
    }
  });
  return pos * depth;
};

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
