const parseValues = str => str.slice(str.indexOf('<') + 1, str.indexOf('>')).split(',').map(Number);

export const formatInput = input => input.split('\n').map(line => {
  const [coord, vel, acc] = line.split(', ');
  return { p: parseValues(coord), v: parseValues(vel), a: parseValues(acc) };
});

export const part1 = input => {
  console.log(input);
  return null;
};

export const part2 = input => {
  console.log(part1(input));
  return null;
};
