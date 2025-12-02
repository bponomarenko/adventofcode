export const formatInput = input => input.split(',').map(range => range.split('-').map(Number));

const filterInvalidIDs = (input, reg) => input.flatMap(([start, end]) => {
  const res = [];
  for (let i = start; i <= end; i += 1) {
    if (reg.test(i)) {
      res.push(i);
    }
  }
  return res;
}).sum();

export const part1 = input => filterInvalidIDs(input, /^(.+)\1$/);

export const part2 = input => filterInvalidIDs(input, /^(.+)\1{1,}$/);
