const { re, bagRe } = require('./part1');

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

const main = input => {
  const options = input.split('\n').map(line => {
    const { name, bags } = re.exec(line).groups;
    return {
      name,
      bags: bags ? bags.split(', ').map(b => ({ ...bagRe.exec(b).groups })) : [],
    };
  });
  return countBags(options, 'shiny gold');
};

module.exports = { main };
