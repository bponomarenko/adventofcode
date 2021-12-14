export const formatInput = input => input.split('\n').map(line => line.split(''));

export const part1 = input => {
  const visitPoints = new Map();
  input.forEach((line, x) => line.forEach((char, y) => {
    if (char !== '#' && char !== '.') {
      visitPoints.set(char, [x, y]);
    }
  }));

  console.log(visitPoints);
  return null;
};

export const part2 = input => {
  console.log(part1(input));
  return null;
};
