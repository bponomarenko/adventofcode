export const formatInput = input => input.split('\n').map(line => (line[0] === 'R' ? 1 : -1) * line.slice(1));

export const part1 = input => {
  let dial = 50;
  let counter = 0;
  input.forEach(steps => {
    dial += (steps % 100);
    if (dial > 99) {
      dial %= 100;
    } else if (dial < 0) {
      dial += 100;
    }
    if (dial === 0) {
      counter += 1;
    }
  });
  return counter;
};

export const part2 = input => {
  let dial = 50;
  let counter = 0;

  input.forEach(steps => {
    const pos = dial > 0;
    counter += Math.floor(Math.abs(steps) / 100);
    dial += (steps % 100);

    if (dial > 99) {
      counter += 1;
      dial %= 100;
    } else if (dial < 0) {
      if (pos) {
        counter += 1;
      }
      dial += 100;
    } else if (dial === 0) {
      counter += 1;
    }
  });
  return counter;
};
