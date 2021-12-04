export const formatInput = input => input.split('\n').map(num => +num);

const getFuel = mass => Math.max(Math.floor(mass / 3) - 2, 0);

export const part1 = input => input.reduce((acc, n) => acc + getFuel(n), 0);

const getFuel2 = mass => {
  const res = Math.max(Math.floor(mass / 3) - 2, 0);
  return res > 0 ? res + getFuel2(res) : 0;
};

export const part2 = input => input.reduce((acc, n) => acc + getFuel2(n), 0);
