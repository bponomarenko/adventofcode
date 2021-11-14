const re = /^(?<name>.+) bags contain (no other bags|(?<bags>.+))\.$/;
const bagRe = /^(?<count>\d+) (?<name>.+) bags?$/;

const main = input => {
  const options = input.split('\n').map(line => {
    const { name, bags } = re.exec(line).groups;
    return {
      name,
      bags: bags ? bags.split(', ').map(b => ({ ...bagRe.exec(b).groups })) : [],
    };
  });

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

module.exports = { main, re, bagRe };
