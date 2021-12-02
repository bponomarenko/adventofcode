const formatInput = input => input.split('\n').map(line => {
  const [cmd, value] = line.split(' ');
  return { cmd, value: +value };
});

const main = input => {
  let pos = 0;
  let depth = 0;

  input.forEach(({ cmd, value }) => {
    switch (cmd) {
      case 'forward':
        pos += value;
        break;
      case 'down':
        depth += value;
        break;
      case 'up':
        depth -= value;
        break;
    }
  });
  return pos * depth;
};

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
