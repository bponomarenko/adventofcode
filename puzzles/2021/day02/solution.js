const formatInput = input => input.split('\n').map(line => {
  const [cmd, value] = line.split(' ');
  return { cmd, value: +value };
});

const part1 = input => {
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

const part2 = input => {
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

module.exports = { part1, part2, formatInput };
