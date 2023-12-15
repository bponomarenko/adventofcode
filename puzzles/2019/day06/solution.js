export const formatInput = input => input.split('\n').map(line => {
  const [center, satellite] = line.split(')');
  return [satellite, center];
});

const countOrbits = (map, leaf) => (map.has(leaf) ? 1 + countOrbits(map, map.get(leaf)) : 0);

export const part1 = input => {
  const orbitMap = new Map(input);
  return Array.from(orbitMap.keys()).sum(leaf => countOrbits(orbitMap, leaf));
};

const getPathToCenter = (map, node) => (map.has(node) ? [node, ...getPathToCenter(map, map.get(node))] : []);

export const part2 = input => {
  const orbitMap = new Map(input);
  const myPath = getPathToCenter(orbitMap, 'YOU');
  const santaPath = getPathToCenter(orbitMap, 'SAN');

  let i = myPath.length - 1;
  while (santaPath.includes(myPath[i])) {
    i -= 1;
  }
  return i + santaPath.indexOf(myPath[i + 1]) - 1;
};
