const nodeRegex = /^(?<node1>\w+)\sto\s(?<node2>\w+)\s=\s(?<distance>\d+)$/;

const getDistance = (nodes, n1, n2) => nodes.find(({ node1, node2 }) => (node1 === n1 && node2 === n2) || (node1 === n2 && node2 === n1))?.distance;

const getRoutes = cities => {
  if (cities.length > 1) {
    return cities.flatMap((city, index) => {
      const subCities = [...cities];
      subCities.splice(index, 1);
      return getRoutes(subCities).map(subRoute => [city, ...subRoute]);
    });
  }
  return [cities];
};

export const formatInput = input => {
  const cities = new Set();
  const routes = input
    .split('\n')
    .map(line => {
      const { node1, node2, distance } = nodeRegex.exec(line).groups;
      cities.add(node1);
      cities.add(node2);
      return { node1, node2, distance: +distance };
    });
  return [cities, routes];
};

export const part1 = ([cities, routes]) => {
  const distances = getRoutes(Array.from(cities))
    .map(route => route.reduce((acc, city, i) => (i > 0 ? acc + getDistance(routes, city, route[i - 1]) : acc), 0));
  return Math.min(...distances);
};

export const part2 = ([cities, routes]) => {
  const distances = getRoutes(Array.from(cities))
    .map(route => route.reduce((acc, city, i) => (i > 0 ? acc + getDistance(routes, city, route[i - 1]) : acc), 0));
  return Math.max(...distances);
};
