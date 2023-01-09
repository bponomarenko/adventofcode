export const formatInput = input => input.split('\n').map(line => {
  if (line.startsWith('deal into')) {
    return ['rev'];
  }
  if (line.startsWith('deal')) {
    return ['inc', +line.split(' ').pop()];
  }
  return ['cut', +line.split(' ').pop()];
});

const process = (instructions, index, size) => {
  instructions.forEach(([cmd, value]) => {
    switch (cmd) {
      case 'rev':
        index = size - index - 1;
        break;
      case 'cut':
        index = (index - value + (value > index ? size : 0)) % size;
        break;
      case 'inc':
        index = (index * value) % size;
        break;
      case 'rvd':
        while (index % value !== 0) {
          index += size;
        }
        index /= value;
        break;
    }
  });
  return index;
};

export const part1 = input => process(input, 2019, 10007);

export const part2 = input => {
  input = input.map(([cmd, value]) => {
    switch (cmd) {
      case 'cut':
        return [cmd, -value];
      case 'inc':
        return ['rvd', value];
      default:
        return [cmd, value];
    }
  }).reverse();

  let index = 2020;
  for (let i = 0; i < 101741582076661; i += 1) {
    index = process(input, index, 119315717514047);
  }
  return index;
};
