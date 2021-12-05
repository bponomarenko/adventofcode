export const formatInput = input => input.split('');

export const part1 = input => input.reduce((floor, direction) => (direction === '(' ? floor + 1 : floor - 1), 0);

export const part2 = input => {
  let floor = 0;
  for (let i = 0; i < input.length; i += 1) {
    floor += input[i] === '(' ? 1 : -1;
    if (floor === -1) {
      return i + 1;
    }
  }
  return 0;
};
