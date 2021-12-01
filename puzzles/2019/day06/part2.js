const { formatInput } = require('./part1');

const getPathToCenter = (map, node) => (map.has(node) ? [node, ...getPathToCenter(map, map.get(node))] : []);

const main = input => {
  const orbitMap = new Map(input);
  const myPath = getPathToCenter(orbitMap, 'YOU');
  const santaPath = getPathToCenter(orbitMap, 'SAN');

  let i = myPath.length - 1;
  while (santaPath.includes(myPath[i])) {
    i -= 1;
  }
  return i + santaPath.indexOf(myPath[i + 1]) - 1;
};
module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
