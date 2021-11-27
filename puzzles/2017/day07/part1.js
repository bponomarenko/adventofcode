const towerRegex = /(.+)\s\(([0-9]+)\)/;

// Parse input into object with "name", "weight" and optional towers "towersAbove"
const formatInput = input => input.split('\n').map(line => {
  const [tower, discs] = line.split(' -> ');
  const [, name, weight] = tower.match(towerRegex);
  return { name, weight: +weight, towersAbove: discs?.split(', ') };
});

const main = input => {
  // Collection of the referenced nodes
  const refs = new Set();

  input.filter(({ towersAbove }) => !!towersAbove?.length)
    .forEach(({ towersAbove }) => towersAbove.forEach(tower => {
      refs.add(tower);
    }));

  // Find tower that wasn't referenced
  return input.find(({ name }) => !refs.has(name))?.name;
};

module.exports = { main: input => main(formatInput(input)), mainFn: main, formatInput };
