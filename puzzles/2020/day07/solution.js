const re = /^(?<name>.+) bags contain (no other bags|(?<bags>.+))\.$/;
const bagRe = /^(?<count>\d+) (?<name>.+) bags?$/;

const formatInput = input => input.split('\n').map(line => {
  const { name, bags } = re.exec(line).groups;
  return {
    name,
    bags: bags ? bags.split(', ').map(b => ({ ...bagRe.exec(b).groups })) : [],
  };
});

const part1 = options => {
  const variants = new Set();
  let founds = ['shiny gold'];

  do {
    founds = founds.flatMap(bag => options
      .filter(({ bags }) => bags.some(({ name }) => name === bag))
      .map(({ name }) => name));

    founds.forEach(name => variants.add(name));
  } while (founds.length > 0);
  return variants.size;
};

const countBags = (options, bag) => {
  let sum = 0;
  options
    .find(({ name }) => name === bag)
    .bags
    .forEach(({ count, name }) => {
      sum += count * (countBags(options, name) + 1);
    });
  return sum;
};

const part2 = options => countBags(options, 'shiny gold');

module.exports = { part1, part2, formatInput };
