const formatInput = input => input.split('\n').map(line => {
  const [center, satellite] = line.split(')');
  return [satellite, center];
});

const countOrbits = (map, leaf) => (map.has(leaf) ? 1 + countOrbits(map, map.get(leaf)) : 0);

const main = input => {
  const orbitMap = new Map(input);
  return Array.from(orbitMap.keys()).reduce((acc, leaf) => acc + countOrbits(orbitMap, leaf), 0);
};

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
