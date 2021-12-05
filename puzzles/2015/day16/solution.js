const sueRe = /^Sue\s(?<num>\d+):\s(?<things>.*)$/;

export const formatInput = input => input.split('\n').map(line => {
  const { num, things } = sueRe.exec(line).groups;
  return {
    num: +num,
    props: things.split(', ').map(thing => {
      const [name, value] = thing.split(': ');
      return [name, +value];
    }),
  };
});

const findNum = (input, criteria) => input.find(({ props }) => props.every(([name, value]) => criteria[name](value))).num;

export const part1 = input => findNum(input, {
  children: value => value === 3,
  cats: value => value === 7,
  samoyeds: value => value === 2,
  pomeranians: value => value === 3,
  akitas: value => value === 0,
  vizslas: value => value === 0,
  goldfish: value => value === 5,
  trees: value => value === 3,
  cars: value => value === 2,
  perfumes: value => value === 1,
});

export const part2 = input => findNum(input, {
  children: value => value === 3,
  cats: value => +value > 7,
  samoyeds: value => value === 2,
  pomeranians: value => +value < 3,
  akitas: value => value === 0,
  vizslas: value => value === 0,
  goldfish: value => +value < 5,
  trees: value => +value > 3,
  cars: value => value === 2,
  perfumes: value => value === 1,
});
